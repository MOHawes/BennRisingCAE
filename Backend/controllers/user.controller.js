const router = require("express").Router();
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const validateMentee = require("../middleware/validate-mentee");
const validateMentor = require("../middleware/validate-mentor");

// Import JSONWEBTOKEN for token creation
const jwt = require("jsonwebtoken");
// Import BCRYPT to hash passwords
const bcrypt = require("bcrypt");
// Model Imports
const Mentor = require("../models/mentor.model");
const Mentee = require("../models/mentee.model");
const Admin = require("../models/admin.model");
// Import email service
const { sendWelcomeEmail } = require("../services/emailService");

// ! Register user route
// Endpoint: http://localhost:4000/user/register
// Request Type: POST
router.post("/register", async (req, res) => {
  try {
    // Destructure the request body:
    let {
      firstName,
      lastName,
      email,
      password,
      userType,
      guardianEmail,
      school,
      ageCheck,
      interests,
      project,
    } = req.body;

    if (email.toLowerCase().endsWith("@placeholder.edu")) {
      userType = "Mentor";
    }

    // Make sure a valid usertype is provided
    if (!["Admin", "Mentor", "Mentee"].includes(userType)) {
      return res
        .status(400)
        .json({ message: "you must enter a valid usertype" });
    }

    // !Mentee specific checks:
    // Mentees prvide additional info while mentors don't - verify they provide these
    // Make sure age is over 13, guardian email and school are provided
    if (userType === "Mentee") {
      // Make sure mentee checked "over 13 y/o" box
      if (!ageCheck) {
        return res.status(400).json({
          message:
            "You must confirm that you are over 13 years old to register as a mentee",
        });
      }
      // Check for guardian email
      if (!guardianEmail) {
        return res.status(400).json({
          message: "Guardian email is required",
        });
      }
      // Check for valid school selection
      const validSchools = [
        "Grace Christian School",
        "Mount Anthony Middle High School",
        "Mount Anthony Union High School",
      ];
      if (!school || !validSchools.includes(school)) {
        return res.status(400).json({
          message: "School must be selected",
        });
      }
    }

    // TODO Notify if user email has already been used
    // ? this might be handles already from the model/schema

    // establish empty user variable
    let user = null;

    // Create user
    // use if/else statement based on userType
    if (userType === "Admin") {
      user = new Admin({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: bcrypt.hashSync(password, 10),
      });
    } else if (userType === "Mentor") {
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
      // IMPORTANT: Create mentee with ALL fields including consent fields
      user = new Mentee({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: bcrypt.hashSync(password, 10),
        guardianEmail: guardianEmail || "placeholder@placeholder.com",
        school: school,
        ageCheck: true,
        interests: interests,
        project: project,
        approvedMentors: [], // empty array to push accepted mentor into
        requestedMentors: [], // empty array to keep track of match request
        // EXPLICITLY SET CONSENT FIELDS
        hasParentConsent: false,
        parentConsentData: null,
      });

      // Log what we're creating
      console.log("Creating new mentee with fields:", {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hasParentConsent: user.hasParentConsent,
        parentConsentData: user.parentConsentData,
      });
    }
    //  Save the new user in the database and store the response in a variable (saved user)
    const newUser = await user.save();

    // Log the saved mentee to verify fields
    if (userType === "Mentee") {
      console.log("Saved mentee document:", {
        id: newUser._id,
        hasParentConsent: newUser.hasParentConsent,
        hasParentConsentData: !!newUser.parentConsentData,
      });

      // Verify by fetching the document again
      const verifyMentee = await Mentee.findById(newUser._id);
      console.log("Verification - Mentee from DB:", {
        id: verifyMentee._id,
        hasParentConsent: verifyMentee.hasParentConsent,
        hasParentConsentData: !!verifyMentee.parentConsentData,
      });
    }

    // Send welcome email to new mentees
    if (userType === "Mentee") {
      try {
        await sendWelcomeEmail(
          newUser.email,
          `${newUser.firstName} ${newUser.lastName}`
        );
        console.log("Welcome email sent successfully");
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the registration if email fails
      }
    }

    // Create JWT token
    const token = jwt.sign({ id: newUser._id, userType: userType }, "secret", {
      expiresIn: "7d",
    });

    // Success message that returns updated user info
    res.status(201).json({
      message: ` New ${newUser.userType} successfully registered!`,
      token: token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        userType: newUser.userType,
        isProfileComplete: false, // added to keep track of profile completion (picture, bio, interest, etc.)
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ! Route for Login
// ENDPOINT: http://localhost:4000/user/login
// Request type: POST
router.post("/login", async (req, res) => {
  try {
    // Destructure body
    const { email, password } = req.body;

    //  ?Check the database to see if the user email exists
    // const user = await User.findOne({ email: email });

    // ? Check database for user (must check admin, mentor, and mentee)
    // Try to find user in admin list first
    let user = await Admin.findOne({ email: email });
    let userType = "Admin";

    // If not an admin, check if they're a mentor
    if (!user) {
      user = await Mentor.findOne({ email: email });
      userType = "Mentor";

      // If not a mentor, check if they're a mentee
      if (!user) {
        user = await Mentee.findOne({ email: email });
        userType = "Mentee";

        // If user not found anywhere, return error
        if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
      }
    }

    // Check/compare provided password if user found
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, userType: userType }, "secret", {
      expiresIn: "7d",
    });
    console.log(token);
    res.status(200).json({
      message: `Welcome, ${user.firstName}. You have been successfuly logged in.`,
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: userType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ! Route for mentor to update their info
// ENDPOINT: http://localhost:4000/user/mentor/update
// Request Type: PUT

router.put(
  "/mentor/update",
  validateSession,
  validateMentor,
  async (req, res) => {
    try {
      //1. get id from JWT
      const id = req.user._id;

      // Get mentor's profile fields from req.body
      const {
        firstName,
        lastName,
        email,
        password,
        bio,
        profilePhoto,
        profilePhoto1,
        profilePhoto2,
        interests,
        questionToAsk,
        projectCategory,
      } = req.body;

      // Empty object to hold updated info
      const updatedInfo = {};

      // only update if provided values are NOT undefined (this way fields can be left empty)
      // ! added .trim() to make sure empty fields wont overwrite existing data
      if (firstName !== undefined && firstName.trim() !== "")
        updatedInfo.firstName = firstName;
      if (lastName !== undefined && lastName.trim() !== "")
        updatedInfo.lastName = lastName;
      if (email !== undefined && email.trim() !== "") updatedInfo.email = email;
      if (password !== undefined && password.trim() !== "")
        updatedInfo.password = bcrypt.hashSync(password, 10);
      if (bio !== undefined && bio.trim() !== "") updatedInfo.bio = bio;

      // Handle both old single photo and new two-photo system
      if (profilePhoto !== undefined && profilePhoto.trim() !== "")
        updatedInfo.profilePhoto = profilePhoto;
      if (profilePhoto1 !== undefined && profilePhoto1.trim() !== "")
        updatedInfo.profilePhoto1 = profilePhoto1;
      if (profilePhoto2 !== undefined && profilePhoto2.trim() !== "")
        updatedInfo.profilePhoto2 = profilePhoto2;

      if (
        interests !== undefined &&
        Array.isArray(interests) &&
        interests.length > 0
      )
        updatedInfo.interests = interests;
      if (questionToAsk !== undefined && questionToAsk.trim() !== "")
        updatedInfo.questionToAsk = questionToAsk;
      if (projectCategory !== undefined && projectCategory.trim() !== "")
        updatedInfo.projectCategory = projectCategory;

      // Take new data from updatedMentor and update the mentor's info
      const updatedMentor = await Mentor.findByIdAndUpdate(id, updatedInfo, {
        new: true,
      });

      // error if update was unsuccessful
      if (!updatedMentor) {
        return res
          .status(404)
          .json({ message: "Error updating your profile - please try again" });
      }

      // Give success message if info is updated
      res.status(200).json({
        message: "Your mentor profile was successfully updated",
        user: {
          id: updatedMentor._id,
          firstName: updatedMentor.firstName,
          lastName: updatedMentor.lastName,
          email: updatedMentor.email,
          bio: updatedMentor.bio,
          profilePhoto: updatedMentor.profilePhoto,
          profilePhoto1: updatedMentor.profilePhoto1,
          profilePhoto2: updatedMentor.profilePhoto2,
          interests: updatedMentor.interests,
          questionToAsk: updatedMentor.questionToAsk,
          projectCategory: updatedMentor.projectCategory,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ! Route for Mentee to update their info
// ENDPOINT: http://localhost:4000/user/mentee/update
// Request type: PUT
router.put(
  "/mentee/update",
  validateSession,
  validateMentee,
  async (req, res) => {
    try {
      // Get mentee's id from token
      const id = req.user._id;

      // make sure user is a mentee
      if (req.userType !== "Mentee") {
        return res
          .status(403)
          .json({ message: "This page is only valid for mentees" });
      }
      // Get profile fields from the req.body
      const { firstName, lastName, email, password, guardianEmail, interests } =
        req.body;

      // Empty object to hold updated info:
      const updatedInfo = {};

      // only update if provided values are NOT undefined (this way fields can be left empty)
      // !Added .trim() to make sure empty fields wont overwrite existing data when updating
      if (firstName !== undefined && firstName.trim() !== "")
        updatedInfo.firstName = firstName;
      if (lastName !== undefined && lastName.trim() !== "")
        updatedInfo.lastName = lastName;
      if (email !== undefined && email.trim() !== "") updatedInfo.email = email;
      if (password !== undefined && password.trim() !== "")
        updatedInfo.password = bcrypt.hashSync(password, 10);
      if (guardianEmail !== undefined && guardianEmail.trim() !== "")
        updatedInfo.guardianEmail = guardianEmail;
      if (
        interests !== undefined &&
        Array.isArray(interests) &&
        interests.length > 0
      )
        updatedInfo.interests = interests;

      // Update the mentee in database
      const updatedMentee = await Mentee.findByIdAndUpdate(id, updatedInfo, {
        new: true,
      });
      // give error if update was unsuccessful
      if (!updatedMentee) {
        return res
          .status(404)
          .json({ message: "Error updating your profile - please try again." });
      }

      // Give success message with updated info
      res.status(200).json({
        message: "Your mentee profile was successfully updated",
        user: {
          id: updatedMentee._id,
          firstName: updatedMentee.firstName,
          lastName: updatedMentee.lastName,
          email: updatedMentee.email,
          guardianEmail: updatedMentee.guardianEmail,
          interests: updatedMentee.interests,
          project: updatedMentee.project,
        },
      });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);

// ToDo Route to delete user
// ENDPOINT: http://localhost:4000/user/delete/
// Request type: DELETE
router.delete("/delete", validateSession, validateAdmin, async (req, res) => {
  try {
    //1. GEt user ID from the token
    const id = req.user._id;

    // First try to delete from Mentors
    // if mentor delete count is zero, try deleting from mentee
    const deletedMentor = await Mentor.deleteOne({ _id: id });
    if (deletedMentor.deletedCount === 0) {
      const deletedMentee = await Mentee.deleteOne({ _id: id });

      // If no mentee was found to delete either, return user not found
      if (deletedMentee.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      } else {
        //  else mentee successfull deletion
        return res.status(200).json({
          message: "Mentee successfully deleted from the database",
          deletedUser: "Mentee",
        });
      }
    } else {
      // else mentor successful deletion
      return res.status(200).json({
        message: "Mentor successfully deleted from the database",
        deletedUser: "Mentor",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ! route to view all mentors
// Endpoint:http: //localhost:4000/user/mentor/view-all
// Change to /mentor/view-all
// request type: GET
router.get("/mentor/view-all", async (req, res) => {
  try {
    const mentors = await Mentor.find({ userType: "Mentor" });

    const formattedMentors = mentors.map((mentor) => ({
      id: mentor._id,
      firstName: mentor.firstName,
      lastName: mentor.lastName,
      email: mentor.email,
      bio: mentor.bio || "",
      interests: mentor.interests || "",
      questionToAsk: mentor.questionToAsk || "",
      profilePhoto: mentor.profilePhoto || "",
      profilePhoto1: mentor.profilePhoto1 || "",
      profilePhoto2: mentor.profilePhoto2 || "",
      projectCategory: mentor.projectCategory || "",
      // Add these fields so frontend knows if team is full
      approvedMentees: mentor.approvedMentees || [],
      isTeamFull: mentor.approvedMentees && mentor.approvedMentees.length > 0, // Team is full if they have any approved mentee
    }));

    res.status(200).json({
      message: `All mentors retrieved successfully`,
      mentors: formattedMentors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ! Route for completing user profile information (separate from basic account register or update)
// ENDPOINT: http://localhost:4000/user/completion
// Request type: PUT
router.put("/completion", validateSession, async (req, res) => {
  try {
    // Get user id from token
    const id = req.user._id;

    // Initialize variables
    let profileInfo = {};
    let isProfileComplete = true;

    // ! If user is mentor, update MENTOR specific profile fields
    if (req.userType === "Mentor") {
      // Extract mentor fields from req.body
      const {
        bio,
        profilePhoto,
        profilePhoto1,
        profilePhoto2,
        interests,
        questionToAsk,
        projectCategory,
      } = req.body;

      profileInfo = {
        bio: bio || "",
        profilePhoto: profilePhoto || "",
        profilePhoto1: profilePhoto1 || "",
        profilePhoto2: profilePhoto2 || "",
        interests: interests || "",
        questionToAsk: questionToAsk || "",
        projectCategory: projectCategory || "",
      };

      // Check if all required fields are completed, if not set isProfileComplete = false
      // Now requiring both photos for complete profile
      if (
        !bio ||
        !profilePhoto1 ||
        !profilePhoto2 ||
        !interests ||
        !questionToAsk ||
        !projectCategory
      ) {
        isProfileComplete = false;
      }

      // If mentee, update mentee specific profile fields
    } else if (req.userType === "Mentee") {
      const { age, interests, school, guardianEmail } = req.body;

      profileInfo = {
        age: age || null,
        interests: interests || "",
        school: school || "",
        guardianEmail: guardianEmail || "",
      };

      // Check if all required fields are completed, if not, set profileComplete = false
      if (!age || !interests || !school || !guardianEmail) {
        isProfileComplete = false;
      }
    }

    // Update user info based on user type (findByIdAndUpdate)
    const User = req.userType === "Mentor" ? Mentor : Mentee;
    const updatedUser = await User.findByIdAndUpdate(id, profileInfo, {
      new: true,
    });

    // if no user found, give error
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: `Profile successfully completed` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO Route for photo upload
// ENDPOINT: http://localhost:4000/user/profile-photo
// Request Type: PUT
router.put("/profile-photo", validateSession, async (req, res) => {
  try {
    //1. Get Mentee's id from the token
    const id = req.user._id;

    //  2. get image URL from req.body
    const { profilePhoto, profilePhoto1, profilePhoto2 } = req.body;

    // Check that user is a mentor before updating
    if (req.userType !== "Mentor") {
      return res.status(403).json({
        message: "Only mentors need to upload a profile photo",
      });
    }

    // Build update object based on which photos are provided
    const updateData = {};
    if (profilePhoto) updateData.profilePhoto = profilePhoto;
    if (profilePhoto1) updateData.profilePhoto1 = profilePhoto1;
    if (profilePhoto2) updateData.profilePhoto2 = profilePhoto2;

    // if no photo urls are found, return error
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "Photo seems to be missing! Try again" });
    }

    // Update user info with profilePhoto (findByIdAndUpdate)
    const updatedMentor = await Mentor.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // if no user found, give error
    if (!updatedMentor) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: `Profile photo(s) updated successfully`,
      profilePhoto: updatedMentor.profilePhoto,
      profilePhoto1: updatedMentor.profilePhoto1,
      profilePhoto2: updatedMentor.profilePhoto2,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// !ROUTE to view single MENTOR's profile by id
// ENDPOINT: http://localhost:4000/user/mentor/profile
// Request Type: GET
router.get(
  "/mentor/profile",
  validateSession,
  validateMentor,
  async (req, res) => {
    try {
      // Get the Mentor's id from token
      const id = req.user._id;

      // Make sure userType = Mentor
      if (req.userType !== "Mentor") {
        return res
          .status(403)
          .json({ message: "You must be a mentor to view this page" });
      }

      // If userType is Mentor, find their data from their id
      // Populate the approvedMentees to get full mentee details
      const mentor = await Mentor.findById(id).populate(
        "approvedMentees",
        "firstName lastName email school interests project"
      );

      // If the mentor has approved mentees, get their answers too
      let menteeWithAnswer = null;
      if (mentor.approvedMentees && mentor.approvedMentees.length > 0) {
        // Get the answer for the first (and only) approved mentee
        const Answer = require("../models/match.model");
        const answer = await Answer.findOne({
          menteeId: mentor.approvedMentees[0]._id,
          mentorId: mentor._id,
        });

        // Combine mentee data with their answer
        menteeWithAnswer = {
          ...mentor.approvedMentees[0].toObject(),
          answer: answer ? answer.menteeAnswer : "No answer found",
        };
      }

      // Respond with mentor profile info if successful"
      // return empty string if field was left empty
      res.status(200).json({
        message: `${mentor.firstName} ${mentor.lastName}'s profile found sucessfully`,
        user: {
          mentorId: mentor._id,
          firstName: mentor.firstName,
          lastName: mentor.lastName,
          email: mentor.email,
          bio: mentor.bio || "",
          profilePhoto: mentor.profilePhoto || "",
          profilePhoto1: mentor.profilePhoto1 || "",
          profilePhoto2: mentor.profilePhoto2 || "",
          interests: mentor.interests || "",
          questionToAsk: mentor.questionToAsk || "",
          projectCategory: mentor.projectCategory || "",
          menteeRequests: mentor.menteeRequests || [], // arrray not a string
          approvedMentees: mentor.approvedMentees || [], // array not a string
          approvedMenteeDetails: menteeWithAnswer, // Add the full mentee details with answer
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// !ROUTE to view single MENTEE's profile by ID:
// ENDPOINT: http://localhost:4000/user/mentee/profile
// Request Type: GET
router.get("/mentee/profile", validateSession, async (req, res) => {
  try {
    // Get the Mentee's id from token
    const id = req.user._id;

    // Make sure userType = Mentor
    if (req.userType !== "Mentee") {
      return res
        .status(403)
        .json({ message: "You must be a mentee to view this page" });
    }

    // If userType is Mentee, find their data from their id
    const mentee = await Mentee.findById(id);

    // Respond with mentor profile info if successful"
    // return empty string if field was left empty
    res.status(200).json({
      message: `${mentee.firstName} ${mentee.lastName}'s profile found sucessfully`,
      user: {
        menteeId: mentee._id,
        firstName: mentee.firstName,
        lastName: mentee.lastName,
        email: mentee.email,
        guardianEmail: mentee.guardianEmail || "",
        school: mentee.school || "",
        ageCheck: mentee.ageCheck,
        interests: mentee.interests || "",
        project: mentee.project || "",
        requestedMentors: mentee.requestedMentors || [],
        approvedMentors: mentee.approvedMentors || [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ! Route to view all mentees (for admin)
// Endpoint: http://localhost:4000/user/mentee/view-all
// Request type: GET
router.get(
  "/mentee/view-all",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const mentees = await Mentee.find({ userType: "Mentee" });

      const formattedMentees = mentees.map((mentee) => ({
        id: mentee._id,
        firstName: mentee.firstName,
        lastName: mentee.lastName,
        email: mentee.email,
        school: mentee.school || "",
        interests: mentee.interests || [],
        project: mentee.project || "",
        guardianEmail: mentee.guardianEmail || "",
        requestedMentors: mentee.requestedMentors || [],
        approvedMentors: mentee.approvedMentors || [],
        ageCheck: mentee.ageCheck,
      }));

      res.status(200).json({
        message: `All mentees retrieved successfully`,
        mentees: formattedMentees,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Add these routes to your admin.controller.js file

// TODO DELETE /admin/mentee/delete/:id
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
      } else {
        return res.status(200).json({
          message: "Mentee successfully deleted.",
          deletedUserId: id,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// TODO PUT /admin/mentee/update/:id (optional - for future use)
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
      // only update if provided values are NOT undefined
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

      // Update the mentee's info
      const updatedMentee = await Mentee.findByIdAndUpdate(
        menteeId,
        updatedInfo,
        {
          new: true,
        }
      );

      // error if update was unsuccessful
      if (!updatedMentee) {
        return res.status(404).json({
          message: "Error updating mentee profile - please try again",
        });
      }
      // success
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
      res.json({ message: error.message });
    }
  }
);

// ! route to view all mentees (fellows)
// Endpoint: http://localhost:4000/user/mentee/view-all
// request type: GET
router.get(
  "/mentee/view-all",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const mentees = await Mentee.find({ userType: "Mentee" });

      const formattedMentees = mentees.map((mentee) => ({
        id: mentee._id,
        firstName: mentee.firstName,
        lastName: mentee.lastName,
        email: mentee.email,
        school: mentee.school || "",
        age: mentee.age || null,
        interests: mentee.interests || [],
        project: mentee.project || "",
        guardianEmail: mentee.guardianEmail || "",
        approvedMentors: mentee.approvedMentors || [],
        requestedMentors: mentee.requestedMentors || [],
      }));

      res.status(200).json({
        message: `All mentees retrieved successfully`,
        mentees: formattedMentees,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
