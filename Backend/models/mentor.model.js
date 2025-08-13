const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
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
    default: "Mentor",
    immutable: true,
  },

  // Mentor specific profile fields
  //   ! match requests
  // ref allows .populate() to be used in controllers - tells mongoose which model to use

  approvedMentees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
    },
  ],
  menteeRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
    },
  ],

  // Two profile photos for team members
  profilePhoto1: {
    type: String, // URL for uploaded photo - Team Member 1
    required: false,
  },
  profilePhoto2: {
    type: String, // URL for uploaded photo - Team Member 2
    required: false,
  },

  // Keeping the old field for backward compatibility during migration
  profilePhoto: {
    type: String, // URL for uploaded photo (deprecated - use profilePhoto1 and profilePhoto2)
    required: false,
  },

  bio: {
    type: String,
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
      ],
    },
  ],
  questionToAsk: {
    type: String,
    required: false,
  },

  projectCategory: {
    type: String,
    enum: ["video", "science"],
    required: false,
  },
});

module.exports = mongoose.model("Mentor", MentorSchema);
