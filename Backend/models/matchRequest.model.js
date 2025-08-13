const mongoose = require("mongoose");

const MatchRequestSchema = new mongoose.Schema(
  {
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    answerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending_guardian_consent",
        "pending_mentor_approval",
        "confirmed",
        "declined_by_guardian",
        "declined_by_mentor",
        "consent_window_expired",
      ],
      default: "pending_guardian_consent",
    },
    // Timestamps for tracking the process
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    consentDeadline: {
      type: Date,
      required: true,
    },
    guardianConsentAt: {
      type: Date,
    },
    guardianConsentReceived: {
      type: Boolean,
      default: false,
    },
    mentorDecisionAt: {
      type: Date,
    },
    confirmedAt: {
      type: Date,
    },
    declinedAt: {
      type: Date,
    },
    expiredAt: {
      type: Date,
    },
    // Email tracking
    remindersSent: {
      type: Number,
      default: 0,
    },
    lastReminderAt: {
      type: Date,
    },
    // Track which emails have been sent
    emailsSent: {
      underReviewToMentor: { type: Boolean, default: false },
      consentNeededToMentee: { type: Boolean, default: false },
      consentRequestToGuardian: { type: Boolean, default: false },
      finalReminderToMentee: { type: Boolean, default: false },
      finalReminderToGuardian: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
MatchRequestSchema.index({ status: 1, consentDeadline: 1 });
MatchRequestSchema.index({ menteeId: 1, mentorId: 1 });

module.exports = mongoose.model("MatchRequest", MatchRequestSchema);
