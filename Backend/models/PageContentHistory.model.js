const mongoose = require("mongoose");

const PageContentHistorySchema = new mongoose.Schema({
  pageContentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PageContent",
    required: true,
  },
  pageId: {
    type: String,
    required: true,
  },
  sectionKey: {
    type: String,
    required: true,
  },
  previousContent: {
    type: String,
    required: true,
  },
  newContent: {
    type: String,
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  changedByName: {
    type: String,
    required: true,
  },
  changeDate: {
    type: Date,
    default: Date.now,
  },
  changeReason: {
    type: String,
  },
});

// Index for efficient history lookups
PageContentHistorySchema.index({ pageId: 1, changeDate: -1 });
PageContentHistorySchema.index({ pageContentId: 1, changeDate: -1 });

module.exports = mongoose.model("PageContentHistory", PageContentHistorySchema);