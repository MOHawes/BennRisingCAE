const mongoose = require("mongoose");

const MenteeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: "Mentee",
    immutable: true,
  },
  requestedMentors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },
  ],
  approvedMentors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },
  ],
  age: {
    type: Number,
    required: false,
  },
  interests: [
    {
      type: String,
      enum: [
        "Music",
        "Technology",
        "Sports",
        "Outdoor activities",
        "Books and writing",
        "Art",
        "Exercising",
        "Food",
        "Gaming",
        "Pets and animals",
        "Gardening",
        "Cars",
        "Politics",
        "Movies",
      ],
    },
  ],
  school: {
    type: String,
    enum: [
      "Grace Christian School",
      "Mount Anthony Middle High School",
      "Mount Anthony Union High School",
    ],
    required: false,
  },
  guardianEmail: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    enum: ["What's in your food", "Kid's for science!"],
    required: false,
  },
  ageCheck: {
    type: Boolean,
    required: true,
    default: false,
  },
  // Consent fields - Make sure they're at the root level
  hasParentConsent: {
    type: Boolean,
    default: false,
  },
  parentConsentData: {
    type: {
      guardianName: { type: String },
      guardianEmail: { type: String },
      guardianPhone: { type: String },
      emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String }
      },
      consentDate: { type: Date },
      consentFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MatchRequest",
      },
      matchedMentorName: { type: String }
    },
    default: null
  }
}, {
  // Add these options to ensure all fields are saved
  strict: false,
  timestamps: true
});

// Add a pre-save hook to log what's being saved
MenteeSchema.pre('save', function(next) {
  console.log('Saving mentee with consent fields:', {
    hasParentConsent: this.hasParentConsent,
    hasParentConsentData: !!this.parentConsentData
  });
  next();
});

module.exports = mongoose.model("Mentee", MenteeSchema);