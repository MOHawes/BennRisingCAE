const router = require("express").Router();
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const bcrypt = require("bcrypt");

// Model imports
const Mentor = require("../models/mentor.model");
const Mentee = require("../models/mentee.model");
const Admin = require("../models/admin.model");
const MatchRequest = require("../models/matchRequest.model");

// Import email service
const {
  sendAccountCreatedToMentor,
  sendAccountCreatedToAdmin,
} = require("../services/emailService");

// GET /admin/list-admins - Get all admin accounts
router.get("/list-admins", validateSession, validateAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({}, "firstName lastName email _id");

    res.status(200).json({
      message: "Admin list retrieved successfully",
      admins: admins.map((admin) => ({
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        userType: "Admin",
      })),
    });
  } catch (error) {
    console.error("Error fetching admin list:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST /admin/create-admin - Create new admin account
router.post(
  "/create-admin",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          message:
            "All fields are required: firstName, lastName, email, password",
        });
      }

      // Check if admin with this email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          message: "An admin with this email already exists",
        });
      }

      // Create new admin
      const newAdmin = new Admin({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
      });

      await newAdmin.save();

      // Send the account created email
      try {
        await sendAccountCreatedToAdmin(
          email,
          firstName,
          password // Send the plain text password before it was hashed
        );
        console.log(
          "Admin account creation email sent successfully to:",
          email
        );
      } catch (emailError) {
        console.error(
          "Failed to send admin account creation email:",
          emailError
        );
        // Don't fail the account creation if email fails
        // But you might want to log this for admin attention
      }

      res.status(201).json({
        message: "Admin created successfully",
        admin: {
          id: newAdmin._id,
          firstName: newAdmin.firstName,
          lastName: newAdmin.lastName,
          email: newAdmin.email,
          userType: "Admin",
        },
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /admin/fellows-with-consent - Get all fellows with their consent data
router.get(
  "/fellows-with-consent",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      // Get all mentees - consent data is now stored directly on mentee
      const mentees = await Mentee.find({});

      // Log to debug
      console.log(`Found ${mentees.length} mentees`);
      const menteesWithConsent = mentees.filter(m => m.hasParentConsent);
      console.log(`${menteesWithConsent.length} have parent consent`);

      // Format the response
      const menteesWithConsentFormatted = mentees.map((mentee) => {
        // Build the mentee object with consent data
        const menteeData = {
          id: mentee._id,
          firstName: mentee.firstName,
          lastName: mentee.lastName,
          email: mentee.email,
          school: mentee.school,
          interests: mentee.interests || [],
          project: mentee.project,
          guardianEmail: mentee.guardianEmail,
          approvedMentors: mentee.approvedMentors || [],
          requestedMentors: mentee.requestedMentors || [],
          ageCheck: mentee.ageCheck,
          hasParentConsent: mentee.hasParentConsent || false,
          // Add consent data if available
          consentData: mentee.parentConsentData || null
        };

        return menteeData;
      });

      res.status(200).json({
        message: "Fellows with consent data retrieved successfully",
        mentees: menteesWithConsentFormatted,
      });
    } catch (error) {
      console.error("Error fetching fellows with consent data:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// PUT /admin/mentee/reset-password/:id
router.put(
  "/mentee/reset-password/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const menteeId = req.params.id;
      console.log("Resetting password for mentee ID: ", menteeId);

      // Reset password to "0000"
      const defaultPassword = "0000";
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

      // Update the mentee's password
      const updatedMentee = await Mentee.findByIdAndUpdate(
        menteeId,
        { password: hashedPassword },
        { new: true }
      );

      // Error if update was unsuccessful
      if (!updatedMentee) {
        return res
          .status(404)
          .json({ message: "Mentee not found or error resetting password" });
      }

      // Success response
      res.status(200).json({
        message: `Password reset successfully for ${updatedMentee.firstName} ${updatedMentee.lastName}. New password is: ${defaultPassword}`,
        menteeId: updatedMentee._id.toString(),
        newPassword: defaultPassword,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: error.message });
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
        newPassword: defaultPassword,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// PUT /admin/admin/reset-password/:id
router.put(
  "/admin/reset-password/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const adminId = req.params.id;
      const requestingAdminId = req.user._id.toString();

      // Prevent admins from resetting their own password
      if (adminId === requestingAdminId) {
        return res.status(400).json({
          message:
            "You cannot reset your own password. Please contact another admin.",
        });
      }

      console.log("Resetting password for admin ID: ", adminId);

      // Reset password to "Admin0000"
      const defaultPassword = "Admin0000";
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

      // Update the admin's password
      const updatedAdmin = await Admin.findByIdAndUpdate(
        adminId,
        { password: hashedPassword },
        { new: true }
      );

      // Error if update was unsuccessful
      if (!updatedAdmin) {
        return res
          .status(404)
          .json({ message: "Admin not found or error resetting password" });
      }

      // Success response
      res.status(200).json({
        message: `Password reset successfully for ${updatedAdmin.firstName} ${updatedAdmin.lastName}. New password is: ${defaultPassword}`,
        adminId: updatedAdmin._id.toString(),
        newPassword: defaultPassword,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /admin/mentor/create - Create new mentor
router.post(
  "/mentor/create",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const { firstName, lastName, email, password, projectCategory } =
        req.body;

      // Check if mentor already exists
      const existingMentor = await Mentor.findOne({ email });
      if (existingMentor) {
        return res
          .status(400)
          .json({ message: "Mentor with this email already exists" });
      }

      // Create new mentor
      const newMentor = new Mentor({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
        projectCategory: projectCategory || "",
        approvedMentees: [],
        menteeRequests: [],
      });

      await newMentor.save();

      // Send the account created email
      try {
        await sendAccountCreatedToMentor(
          email,
          firstName,
          password // Send the plain text password before it was hashed
        );
        console.log("Account creation email sent successfully to:", email);
      } catch (emailError) {
        console.error("Failed to send account creation email:", emailError);
        // Don't fail the account creation if email fails
        // But you might want to log this for admin attention
      }

      res.status(201).json({
        message: "Mentor created successfully",
        mentor: newMentor,
      });
    } catch (error) {
      console.error("Error creating mentor:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// PUT /admin/mentor/update/:id - Update mentor
router.put(
  "/mentor/update/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const mentorId = req.params.id;
      const { firstName, lastName, email, projectCategory } = req.body;

      const updatedInfo = {};
      if (firstName !== undefined && firstName.trim() !== "")
        updatedInfo.firstName = firstName;
      if (lastName !== undefined && lastName.trim() !== "")
        updatedInfo.lastName = lastName;
      if (email !== undefined && email.trim() !== "") updatedInfo.email = email;
      if (projectCategory !== undefined)
        updatedInfo.projectCategory = projectCategory;

      const updatedMentor = await Mentor.findByIdAndUpdate(
        mentorId,
        updatedInfo,
        { new: true }
      );

      if (!updatedMentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      res.status(200).json({
        message: "Mentor updated successfully",
        mentor: updatedMentor,
      });
    } catch (error) {
      console.error("Error updating mentor:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE /admin/mentor/delete/:id - Delete mentor
router.delete(
  "/mentor/delete/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const mentorId = req.params.id;
      const deletedMentor = await Mentor.findByIdAndDelete(mentorId);

      if (!deletedMentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      res.status(200).json({
        message: "Mentor deleted successfully",
        deletedMentor,
      });
    } catch (error) {
      console.error("Error deleting mentor:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// PUT /admin/mentee/update/:id - Update mentee
router.put(
  "/mentee/update/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const menteeId = req.params.id;
      console.log("Received mentee ID: ", menteeId);

      const { firstName, lastName, email, school, guardianEmail, interests } =
        req.body;

      const updatedInfo = {};
      if (firstName !== undefined && firstName.trim() !== "")
        updatedInfo.firstName = firstName;
      if (lastName !== undefined && lastName.trim() !== "")
        updatedInfo.lastName = lastName;
      if (email !== undefined && email.trim() !== "") updatedInfo.email = email;
      if (school !== undefined && school.trim() !== "")
        updatedInfo.school = school;
      if (guardianEmail !== undefined && guardianEmail.trim() !== "")
        updatedInfo.guardianEmail = guardianEmail;
      if (interests !== undefined && Array.isArray(interests))
        updatedInfo.interests = interests;

      const updatedMentee = await Mentee.findByIdAndUpdate(
        menteeId,
        updatedInfo,
        { new: true }
      );

      if (!updatedMentee) {
        return res.status(404).json({
          message: "Error updating mentee profile - please try again",
        });
      }

      res.status(200).json({
        message: "Mentee profile was successfully updated",
        user: {
          id: updatedMentee._id.toString(),
          firstName: updatedMentee.firstName,
          lastName: updatedMentee.lastName,
          email: updatedMentee.email,
          school: updatedMentee.school,
          guardianEmail: updatedMentee.guardianEmail,
          interests: updatedMentee.interests,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE /admin/mentee/delete/:id - Delete mentee
router.delete(
  "/mentee/delete/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMentee = await Mentee.deleteOne({ _id: id });

      if (deletedMentee.deletedCount === 0) {
        return res.status(404).json({ message: "Mentee not found." });
      }

      return res.status(200).json({
        message: "Mentee successfully deleted.",
        deletedUserId: id,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /admin/match-requests - Get all match requests
router.get(
  "/match-requests",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      console.log("=== MATCH REQUESTS ENDPOINT HIT ===");

      const matchRequests = await MatchRequest.find()
        .populate("menteeId", "firstName lastName email school interests")
        .populate("mentorId", "firstName lastName projectCategory")
        .populate("answerId", "menteeAnswer programAnswer")
        .sort({ requestedAt: -1 });

      console.log(`Found ${matchRequests.length} match requests`);

      // Log the first match request to see its structure
      if (matchRequests.length > 0) {
        console.log(
          "First match request guardianInfo:",
          matchRequests[0].guardianInfo
        );
      }

      // Calculate status counts
      const statusCounts = matchRequests.reduce((acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      }, {});

      // Format the response
      const formattedRequests = matchRequests.map((request) => {
        const formatted = {
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
          guardianInfo: request.guardianInfo,
          mentee: {
            id: request.menteeId?._id,
            name: `${request.menteeId?.firstName || ""} ${
              request.menteeId?.lastName || ""
            }`,
            email: request.menteeId?.email || "",
            school: request.menteeId?.school || "",
            interests: request.menteeId?.interests || [],
          },
          mentor: {
            id: request.mentorId?._id,
            name: `${request.mentorId?.firstName || ""} ${
              request.mentorId?.lastName || ""
            }`,
            projectCategory: request.mentorId?.projectCategory || "",
          },
          answers: request.answerId
            ? {
                mentorAnswer: request.answerId.menteeAnswer,
                programAnswer: request.answerId.programAnswer,
              }
            : null,
        };

        // Log if this request has guardian info
        if (request.guardianInfo) {
          console.log(`Match request ${request._id} HAS guardian info`);
        }

        return formatted;
      });

      console.log(
        "Sending response with",
        formattedRequests.length,
        "requests"
      );
      console.log(
        "Requests with guardian info:",
        formattedRequests.filter((r) => r.guardianInfo).length
      );

      res.status(200).json({
        requests: formattedRequests,
        statusCounts: statusCounts,
        total: matchRequests.length,
      });
    } catch (error) {
      console.error("Error fetching match requests:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Export the router
module.exports = router;