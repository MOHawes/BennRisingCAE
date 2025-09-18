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
  // ! arrays for tracking matches and requests
  // ref allows .populate() to be used in controllers - tells mongoose which model to use

  // Mentee specific fields:
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
    required: false, // Initially false for basic signup, but is required for profile completion
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
  // Make sure user is over age of 13
  ageCheck: {
    type: Boolean,
    required: true,
    default: false,
  },
  // Add consent data fields
  hasParentConsent: {
    type: Boolean,
    default: false,
  },
  parentConsentData: {
    guardianName: {
      type: String,
    },
    guardianEmail: {
      type: String,
    },
    guardianPhone: {
      type: String,
    },
    emergencyContact: {
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
      relation: {
        type: String,
      }
    },
    consentDate: {
      type: Date,
    },
    consentFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchRequest",
    },
    matchedMentorName: {
      type: String,
    }
  },
});

module.exports = mongoose.model("Mentee", MenteeSchema);