const router = require("express").Router();
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

// Import JSONWEBTOKEN for token creation
const jwt = require("jsonwebtoken");
// Import BCRYPT to hash passwords
const bcrypt = require("bcrypt");
// Model Imports
const Admin = require("../models/admin.model");
const Mentor = require("../models/mentor.model");
const MatchRequest = require("../models/matchRequest.model");
const Answer = require("../models/match.model");

// GET /admin/match-requests - Get all match requests with details
router.get(
  "/match-requests",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      // Get all match requests with populated data
      const matchRequests = await MatchRequest.find({})
        .populate({
          path: "menteeId",
          select: "firstName lastName email school interests",
        })
        .populate({
          path: "mentorId",
          select: "firstName lastName email projectCategory",
        })
        .populate({
          path: "answerId",
          select: "menteeAnswer programAnswer",
        })
        .sort({ requestedAt: -1 }); // Most recent first

      // Format the data for easier frontend consumption
      const formattedRequests = matchRequests.map((request) => ({
        id: request._id,
        status: request.status,
        requestedAt: request.requestedAt,
        consentDeadline: request.consentDeadline,
        guardianConsentAt: request.guardianConsentAt,
        mentorDecisionAt: request.mentorDecisionAt,
        confirmedAt: request.confirmedAt,
        declinedAt: request.declinedAt,
        expiredAt: request.expiredAt,
        remindersSent: request.remindersSent,
        lastReminderAt: request.lastReminderAt,
        mentee: {
          id: request.menteeId._id,
          name: `${request.menteeId.firstName} ${request.menteeId.lastName}`,
          email: request.menteeId.email,
          school: request.menteeId.school,
          interests: request.menteeId.interests,
        },
        mentor: {
          id: request.mentorId._id,
          name: `${request.mentorId.firstName} ${request.mentorId.lastName}`,
          email: request.mentorId.email,
          projectCategory: request.mentorId.projectCategory,
        },
        answers: request.answerId
          ? {
              mentorAnswer: request.answerId.menteeAnswer,
              programAnswer: request.answerId.programAnswer,
            }
          : null,
        emailsSent: request.emailsSent,
      }));

      res.status(200).json({
        message: "Match requests retrieved successfully",
        requests: formattedRequests,
        totalRequests: formattedRequests.length,
        statusCounts: {
          pending_guardian_consent: formattedRequests.filter(
            (r) => r.status === "pending_guardian_consent"
          ).length,
          pending_mentor_approval: formattedRequests.filter(
            (r) => r.status === "pending_mentor_approval"
          ).length,
          confirmed: formattedRequests.filter((r) => r.status === "confirmed")
            .length,
          declined_by_guardian: formattedRequests.filter(
            (r) => r.status === "declined_by_guardian"
          ).length,
          declined_by_mentor: formattedRequests.filter(
            (r) => r.status === "declined_by_mentor"
          ).length,
          consent_window_expired: formattedRequests.filter(
            (r) => r.status === "consent_window_expired"
          ).length,
        },
      });
    } catch (error) {
      console.error("Error fetching match requests:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// TODO POST /admin/mentor/create
router.post(
  "/mentor/create",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      let { firstName, lastName, email, password, userType, projectCategory } =
        req.body;

      userType = "Mentor"; // default

      // establish empty user variable
      let user = null;

      // Create the user
      if (userType === "Mentor") {
        user = new Mentor({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: bcrypt.hashSync(password, 10),
          approvedMentees: [], //empty array to push accepted mentee into
          menteeRequests: [], // empty array to push match requests into
          projectCategory: req.body.projectCategory
            ? req.body.projectCategory
            : "",
        });
      } else {
        console.log("There was an issue.");
      }

      const newUser = await user.save();

      // Create JWT token
      const token = jwt.sign(
        { id: newUser._id, userType: userType },
        "secret",
        {
          expiresIn: "7d",
        }
      );
      // success message, returns new user info
      res.json({
        message: ` New ${newUser.userType} successfully registered!`,
        token: token,
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          userType: newUser.userType,
        },
      });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);

// POST /admin/create-admin
router.post(
  "/create-admin",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email: email });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ message: "Admin with this email already exists" });
      }

      // Create new admin
      const newAdmin = new Admin({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: bcrypt.hashSync(password, 10),
      });

      await newAdmin.save();

      res.status(201).json({
        message: "New admin successfully created!",
        admin: {
          id: newAdmin._id,
          firstName: newAdmin.firstName,
          lastName: newAdmin.lastName,
          email: newAdmin.email,
          userType: "Admin",
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// PUT /admin/mentor/update/:id
router.put(
  "/mentor/update/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const mentorId = req.params.id;
      console.log("Received mentor ID: ", mentorId);

      const { firstName, lastName, email, projectCategory } = req.body;

      const updatedInfo = {};
      // only update if provided values are NOT undefined (this way fields can be left empty)
      // ! added .trim() to make sure empty fields wont overwrite existing data
      if (firstName !== undefined && firstName.trim() !== "")
        updatedInfo.firstName = firstName;
      if (lastName !== undefined && lastName.trim() !== "")
        updatedInfo.lastName = lastName;
      if (email !== undefined && email.trim() !== "") updatedInfo.email = email;
      if (projectCategory !== undefined && projectCategory.trim() !== "")
        updatedInfo.projectCategory = projectCategory;

      // Take new data from updatedMentor and update the mentor's info
      const updatedMentor = await Mentor.findByIdAndUpdate(
        mentorId,
        updatedInfo,
        {
          new: true,
        }
      );

      // error if update was unsuccessful
      if (!updatedMentor) {
        return res
          .status(404)
          .json({ message: "Error updating your profile - please try again" });
      }
      // success
      res.status(200).json({
        message: "Your mentor profile was successfully updated",
        user: {
          id: updatedMentor._id.toString(),
          firstName: updatedMentor.firstName,
          lastName: updatedMentor.lastName,
          email: updatedMentor.email,
          projectCategory: updatedMentor.projectCategory,
        },
      });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);

// PUT /admin/mentor/reset-password/:id
router.put(
  "/mentor/reset-password/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const mentorId = req.params.id;
      console.log("Resetting password for mentor ID: ", mentorId);

      // Reset password to "0000"
      const defaultPassword = "0000";
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

      // Update the mentor's password
      const updatedMentor = await Mentor.findByIdAndUpdate(
        mentorId,
        { password: hashedPassword },
        { new: true }
      );

      // Error if update was unsuccessful
      if (!updatedMentor) {
        return res
          .status(404)
          .json({ message: "Mentor not found or error resetting password" });
      }

      // Success response
      res.status(200).json({
        message: `Password reset successfully for ${updatedMentor.firstName} ${updatedMentor.lastName}. New password is: ${defaultPassword}`,
        mentorId: updatedMentor._id.toString(),
        newPassword: defaultPassword, // Include in response for admin reference
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE /admin/mentor/delete/:id
router.delete(
  "/mentor/delete/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMentor = await Mentor.deleteOne({ _id: id });

      if (deletedMentor.deletedCount === 0) {
        return res.status(404).json({ message: "Mentor not found." });
      } else {
        return res.status(200).json({
          message: "Mentor successfully deleted.",
          deletedUserId: id,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
