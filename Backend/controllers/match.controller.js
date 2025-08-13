const router = require("express").Router();
const validateSession = require("../middleware/validate-session");
const validateMentee = require("../middleware/validate-mentee");
const validateMentor = require("../middleware/validate-mentor");
const Mentor = require("../models/mentor.model");
const Mentee = require("../models/mentee.model");
const Answer = require("../models/match.model");
const MatchRequest = require("../models/matchRequest.model");
const {
  sendMatchUnderReviewToMentor,
  sendConsentNeededToMentee,
  sendConsentRequestToGuardian,
  sendMatchRequestToMentor,
  sendMatchConfirmedToMentor,
  sendMatchConfirmedToMentee,
  sendMatchDeclinedToMentee,
  sendGuardianDeclinedToMentor,
  sendConsentApprovedToMentee,
  sendConsentDeclinedToMentee,
  sendConsentWindowClosedToMentee,
  sendMatchDeclinedByMentor,
  sendFinalReminderToMentee,
  sendFinalReminderToGuardian,
} = require("../services/emailService");

// Route to get consent form information (public - no auth required)
router.get("/consent-info/:matchRequestId", async (req, res) => {
  try {
    const { matchRequestId } = req.params;

    // Handle test case for development
    if (
      matchRequestId === "test-match-id" ||
      matchRequestId === "test-match-request-id"
    ) {
      // Return mock data for testing
      return res.status(200).json({
        menteeName: "Test Student",
        mentorName: "Test Mentor",
        projectCategory: "Science",
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      });
    }

    // For real match requests, validate ObjectId
    if (!matchRequestId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid match request ID format",
      });
    }

    const matchRequest = await MatchRequest.findById(matchRequestId)
      .populate("menteeId", "firstName lastName")
      .populate("mentorId", "firstName lastName projectCategory");

    if (!matchRequest) {
      return res.status(404).json({ message: "Match request not found" });
    }

    // Check if consent window is still open
    if (matchRequest.status !== "pending_guardian_consent") {
      return res.status(400).json({
        message: "This consent form is no longer active",
        status: matchRequest.status,
      });
    }

    // Check if consent window has expired
    if (new Date() > matchRequest.consentDeadline) {
      return res.status(400).json({
        message: "The consent window has expired",
      });
    }

    // Return limited information for the form
    res.status(200).json({
      menteeName: `${matchRequest.menteeId.firstName} ${matchRequest.menteeId.lastName}`,
      mentorName: `${matchRequest.mentorId.firstName} ${matchRequest.mentorId.lastName}`,
      projectCategory: matchRequest.mentorId.projectCategory,
      deadline: matchRequest.consentDeadline,
    });
  } catch (error) {
    console.error("Error fetching consent info:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route for mentee to request a mentor (triggers emails #1, #2, #3)
router.post(
  "/request/:mentorId",
  validateSession,
  validateMentee,
  async (req, res) => {
    try {
      const menteeId = req.user._id;
      const mentorId = req.params.mentorId;
      const { answer } = req.body;

      // Get mentee and mentor data
      const mentee = await Mentee.findById(menteeId);
      const mentor = await Mentor.findById(mentorId);

      if (!mentee || !mentor) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if request already exists
      const existingRequest = await MatchRequest.findOne({
        menteeId: menteeId,
        mentorId: mentorId,
        status: {
          $in: [
            "pending_guardian_consent",
            "pending_mentor_approval",
            "confirmed",
          ],
        },
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Match request already exists" });
      }

      // Create Answer record first
      const answerRecord = new Answer({
        menteeId: menteeId,
        mentorId: mentorId,
        mentorQuestion: mentor.questionToAsk,
        menteeAnswer: answer,
      });
      await answerRecord.save();

      // Create match request record
      const matchRequest = new MatchRequest({
        menteeId: menteeId,
        mentorId: mentorId,
        answerId: answerRecord._id,
        status: "pending_guardian_consent",
        requestedAt: new Date(),
        consentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      });

      await matchRequest.save();

      // Add to mentee's requested mentors
      await Mentee.findByIdAndUpdate(menteeId, {
        $push: { requestedMentors: mentorId },
      });

      // Add to mentor's mentee requests
      await Mentor.findByIdAndUpdate(mentorId, {
        $push: { menteeRequests: menteeId },
      });

      // Generate consent form URL
      const consentFormUrl = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/consent/${matchRequest._id}`;

      // Send email #1 to mentor - Match Under Review
      await sendMatchUnderReviewToMentor(mentor.email, mentor.firstName, {
        firstName: mentee.firstName,
        lastName: mentee.lastName,
        interests: mentee.interests,
        answer1: mentee.project || "Not provided", // General answer
        answer2: answer, // Answer to mentor's specific question
      });

      // Send email #2 to mentee - Consent Needed
      await sendConsentNeededToMentee(mentee.email, mentee.firstName);

      // Send email #3 to guardian - Consent Request (with link)
      await sendConsentRequestToGuardian(
        mentee.guardianEmail,
        {
          firstName: mentee.firstName,
          lastName: mentee.lastName,
        },
        {
          firstName: mentor.firstName,
          lastName: mentor.lastName,
          bio: mentor.bio,
        },
        consentFormUrl // Pass the consent form URL
      );

      // Update email tracking
      matchRequest.emailsSent.underReviewToMentor = true;
      matchRequest.emailsSent.consentNeededToMentee = true;
      matchRequest.emailsSent.consentRequestToGuardian = true;
      await matchRequest.save();

      res.status(200).json({
        message:
          "Match request sent successfully. Waiting for guardian consent.",
        matchRequestId: matchRequest._id,
      });
    } catch (error) {
      console.error("Error in match request:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Route to get pending match requests for a mentor
router.get(
  "/pending-requests",
  validateSession,
  validateMentor,
  async (req, res) => {
    try {
      const mentorId = req.user._id;

      const pendingRequests = await MatchRequest.find({
        mentorId: mentorId,
        status: "pending_mentor_approval",
      })
        .populate({
          path: "menteeId",
          select: "firstName lastName email school interests project",
        })
        .populate({
          path: "answerId",
          select: "menteeAnswer",
        });

      res.status(200).json({
        message: "Pending requests retrieved",
        requests: pendingRequests,
      });
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Route for guardian to approve/decline consent
router.post("/consent/:matchRequestId", async (req, res) => {
  try {
    const { matchRequestId } = req.params;
    const { approved, guardianName, childName, guardianEmail, guardianPhone } =
      req.body;

    // Handle test case for development
    if (
      matchRequestId === "test-match-id" ||
      matchRequestId === "test-match-request-id"
    ) {
      // Simulate successful submission for testing
      console.log("Test consent form submitted:", {
        approved,
        guardianName,
        childName,
        guardianEmail,
        guardianPhone,
      });

      return res.status(200).json({
        message: approved
          ? "Test consent approved successfully"
          : "Test consent declined successfully",
      });
    }

    // For real match requests, validate ObjectId
    if (!matchRequestId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid match request ID format",
      });
    }

    const matchRequest = await MatchRequest.findById(matchRequestId)
      .populate("menteeId")
      .populate("mentorId");

    if (!matchRequest) {
      return res.status(404).json({ message: "Match request not found" });
    }

    if (matchRequest.status !== "pending_guardian_consent") {
      return res.status(400).json({ message: "Consent decision already made" });
    }

    // Check if consent window has expired
    if (new Date() > matchRequest.consentDeadline) {
      matchRequest.status = "consent_window_expired";
      matchRequest.expiredAt = new Date();
      await matchRequest.save();
      return res.status(400).json({ message: "Consent window has expired" });
    }

    if (approved) {
      // Update match status
      matchRequest.status = "pending_mentor_approval";
      matchRequest.guardianConsentAt = new Date();
      matchRequest.guardianConsentReceived = true;
      await matchRequest.save();

      // Send email #7 to mentee - Consent Approved
      await sendConsentApprovedToMentee(
        matchRequest.menteeId.email,
        matchRequest.menteeId.firstName
      );

      // Get the answer for the mentor email
      const answer = await Answer.findById(matchRequest.answerId);

      // Send email #8 to mentor - Match Request
      await sendMatchRequestToMentor(
        matchRequest.mentorId.email,
        matchRequest.mentorId.firstName,
        {
          firstName: matchRequest.menteeId.firstName,
          lastName: matchRequest.menteeId.lastName,
          age: matchRequest.menteeId.age,
          school: matchRequest.menteeId.school,
          interests: matchRequest.menteeId.interests,
          answer1: matchRequest.menteeId.project || "Not provided",
          answer2: answer.menteeAnswer,
        }
      );

      res.status(200).json({ message: "Consent approved successfully" });
    } else {
      // Update match status
      matchRequest.status = "declined_by_guardian";
      matchRequest.declinedAt = new Date();
      await matchRequest.save();

      // Remove from requested lists
      await Mentee.findByIdAndUpdate(matchRequest.menteeId._id, {
        $pull: { requestedMentors: matchRequest.mentorId._id },
      });

      await Mentor.findByIdAndUpdate(matchRequest.mentorId._id, {
        $pull: { menteeRequests: matchRequest.menteeId._id },
      });

      // Send email #5 to mentee - Consent Declined
      await sendConsentDeclinedToMentee(
        matchRequest.menteeId.email,
        matchRequest.menteeId.firstName
      );

      // Send email #9 to mentor - Guardian Declined
      await sendGuardianDeclinedToMentor(
        matchRequest.mentorId.email,
        matchRequest.mentorId.firstName
      );

      res.status(200).json({ message: "Consent declined" });
    }
  } catch (error) {
    console.error("Error processing consent:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route for mentor to approve/decline match
router.post(
  "/mentor-decision/:matchRequestId",
  validateSession,
  validateMentor,
  async (req, res) => {
    try {
      const { matchRequestId } = req.params;
      const { approved } = req.body;
      const mentorId = req.user._id;

      const matchRequest = await MatchRequest.findById(matchRequestId)
        .populate("menteeId")
        .populate("mentorId");

      if (!matchRequest) {
        return res.status(404).json({ message: "Match request not found" });
      }

      // Verify this mentor is the one in the request
      if (matchRequest.mentorId._id.toString() !== mentorId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (matchRequest.status !== "pending_mentor_approval") {
        return res.status(400).json({ message: "Match decision already made" });
      }

      if (approved) {
        // Update match status
        matchRequest.status = "confirmed";
        matchRequest.confirmedAt = new Date();
        matchRequest.mentorDecisionAt = new Date();
        await matchRequest.save();

        // Update approved lists
        await Mentor.findByIdAndUpdate(matchRequest.mentorId._id, {
          $pull: { menteeRequests: matchRequest.menteeId._id },
          $push: { approvedMentees: matchRequest.menteeId._id },
        });

        await Mentee.findByIdAndUpdate(matchRequest.menteeId._id, {
          $pull: { requestedMentors: matchRequest.mentorId._id },
          $push: { approvedMentors: matchRequest.mentorId._id },
        });

        // Get all mentees for this mentor (for team email)
        const allMentees = await Mentee.find({
          approvedMentors: matchRequest.mentorId._id,
        });

        // Get answers for all mentees
        const menteeAnswers = await Answer.find({
          mentorId: matchRequest.mentorId._id,
          menteeId: { $in: allMentees.map((m) => m._id) },
        });

        // Send email #10 to mentor - Match Confirmed
        await sendMatchConfirmedToMentor(
          matchRequest.mentorId.email,
          matchRequest.mentorId.firstName,
          allMentees.map((m) => {
            const answer = menteeAnswers.find(
              (a) => a.menteeId.toString() === m._id.toString()
            );
            return {
              firstName: m.firstName,
              lastName: m.lastName,
              email: m.email,
              phone: m.phone,
              interests: m.interests,
              answer1: m.project || "Not provided",
              answer2: answer ? answer.menteeAnswer : "Not provided",
            };
          }),
          "TBD" // Match date - you can add this to your system
        );

        // Send email #10 to mentee - Match Confirmed
        await sendMatchConfirmedToMentee(
          matchRequest.menteeId.email,
          matchRequest.menteeId.firstName,
          [
            {
              firstName: matchRequest.mentorId.firstName,
              lastName: matchRequest.mentorId.lastName,
              email: matchRequest.mentorId.email,
              phone: matchRequest.mentorId.phone,
              interests: matchRequest.mentorId.interests,
              bio: matchRequest.mentorId.bio,
              projectCategory: matchRequest.mentorId.projectCategory,
            },
          ],
          "TBD" // Match date
        );

        res.status(200).json({ message: "Match confirmed successfully" });
      } else {
        // Update match status
        matchRequest.status = "declined_by_mentor";
        matchRequest.declinedAt = new Date();
        matchRequest.mentorDecisionAt = new Date();
        await matchRequest.save();

        // Remove from lists
        await Mentor.findByIdAndUpdate(matchRequest.mentorId._id, {
          $pull: { menteeRequests: matchRequest.menteeId._id },
        });

        await Mentee.findByIdAndUpdate(matchRequest.menteeId._id, {
          $pull: { requestedMentors: matchRequest.mentorId._id },
        });

        // Send email #11 to mentor - Match Declined
        await sendMatchDeclinedByMentor(
          matchRequest.mentorId.email,
          matchRequest.mentorId.firstName
        );

        // Send email #12 to mentee - Match Declined
        await sendMatchDeclinedToMentee(
          matchRequest.menteeId.email,
          matchRequest.menteeId.firstName
        );

        res.status(200).json({ message: "Match declined" });
      }
    } catch (error) {
      console.error("Error processing mentor decision:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Route to send reminders (call this from a cron job)
router.post("/send-reminders", async (req, res) => {
  try {
    // Find matches at 36 hours (12 hours before deadline)
    const thirtyySixHoursAgo = new Date(Date.now() - 36 * 60 * 60 * 1000);
    const matchesNeedingReminder = await MatchRequest.find({
      status: "pending_guardian_consent",
      requestedAt: { $lte: thirtyySixHoursAgo },
      "emailsSent.finalReminderToMentee": false,
    }).populate("menteeId");

    for (const match of matchesNeedingReminder) {
      // Send email #4 - Final reminders
      await sendFinalReminderToMentee(
        match.menteeId.email,
        match.menteeId.firstName
      );
      await sendFinalReminderToGuardian(match.menteeId.guardianEmail);

      match.emailsSent.finalReminderToMentee = true;
      match.emailsSent.finalReminderToGuardian = true;
      match.remindersSent += 1;
      match.lastReminderAt = new Date();
      await match.save();
    }

    // Check for expired consent windows
    const expiredMatches = await MatchRequest.find({
      status: "pending_guardian_consent",
      consentDeadline: { $lt: new Date() },
    })
      .populate("menteeId")
      .populate("mentorId");

    for (const match of expiredMatches) {
      // Update status
      match.status = "consent_window_expired";
      match.expiredAt = new Date();
      await match.save();

      // Remove from lists
      await Mentee.findByIdAndUpdate(match.menteeId._id, {
        $pull: { requestedMentors: match.mentorId._id },
      });

      await Mentor.findByIdAndUpdate(match.mentorId._id, {
        $pull: { menteeRequests: match.menteeId._id },
      });

      // Send email #6 to mentee - Consent Window Closed
      await sendConsentWindowClosedToMentee(
        match.menteeId.email,
        match.menteeId.firstName
      );
    }

    res.status(200).json({
      message: "Reminders processed",
      remindersSet: matchesNeedingReminder.length,
      expiredMatches: expiredMatches.length,
    });
  } catch (error) {
    console.error("Error processing reminders:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
