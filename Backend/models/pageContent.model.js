const mongoose = require("mongoose");

const PageContentSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    // Examples: "homepage", "mentors", "mentees", "parents", etc.
  },
  sections: [{
    sectionKey: {
      type: String,
      required: true,
      // Examples: "hero_title", "welcome_text", "instructions", etc.
    },
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["text", "html", "markdown"],
      default: "text",
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  metadata: {
    pageTitle: String,
    pageDescription: String,
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  version: {
    type: Number,
    default: 1,
  },
});

// Index for efficient querying
PageContentSchema.index({ pageId: 1, "sections.sectionKey": 1 });

// Update lastModified on save
PageContentSchema.pre("save", function(next) {
  this.metadata.lastModified = new Date();
  next();
});

module.exports = mongoose.model("PageContent", PageContentSchema);