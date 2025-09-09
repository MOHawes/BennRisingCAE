const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
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
  mentorQuestion: {
    type: String,
  },
  menteeAnswer: {
    type: String,
    required: true,
    maxlength: 150,
  },
  programQuestion: {
    type: String,
    default: "How do you want to grow through participating in the Bennington Rising program?",
  },
  programAnswer: {
    type: String,
    required: true,
    maxlength: 150,
  },
});

module.exports = mongoose.model("Answer", AnswerSchema);