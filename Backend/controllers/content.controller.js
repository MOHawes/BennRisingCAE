const router = require("express").Router();
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const PageContent = require("../models/pageContent.model");
const PageContentHistory = require("../models/PageContentHistory.model");

// GET /content/:pageId - Get content for a specific page (public)
router.get("/:pageId", async (req, res) => {
  try {
    const { pageId } = req.params;

    const content = await PageContent.findOne({ 
      pageId: pageId,
      isPublished: true 
    });

    if (!content) {
      // Return default content structure if none exists
      return res.status(200).json({
        pageId: pageId,
        sections: [],
        metadata: {
          pageTitle: "",
          pageDescription: "",
        },
      });
    }

    res.status(200).json({
      pageId: content.pageId,
      sections: content.sections,
      metadata: content.metadata,
    });
  } catch (error) {
    console.error("Error fetching page content:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET /content/admin/all - Get all page contents (admin only)
router.get("/admin/all", validateSession, validateAdmin, async (req, res) => {
  try {
    const contents = await PageContent.find({})
      .populate("sections.lastUpdatedBy", "firstName lastName");

    res.status(200).json({
      message: "All page contents retrieved successfully",
      contents: contents,
    });
  } catch (error) {
    console.error("Error fetching all page contents:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /content/:pageId/:sectionKey - Update specific section (admin only)
router.put("/:pageId/:sectionKey", validateSession, validateAdmin, async (req, res) => {
  try {
    const { pageId, sectionKey } = req.params;
    const { content, contentType, changeReason } = req.body;
    const adminId = req.user._id;
    const adminName = `${req.user.firstName} ${req.user.lastName}`;

    // Find or create page content
    let pageContent = await PageContent.findOne({ pageId });
    
    if (!pageContent) {
      // Create new page content if doesn't exist
      pageContent = new PageContent({
        pageId: pageId,
        sections: [],
        metadata: {
          pageTitle: pageId.charAt(0).toUpperCase() + pageId.slice(1),
          pageDescription: "",
        },
      });
    }

    // Find the section to update
    const sectionIndex = pageContent.sections.findIndex(
      s => s.sectionKey === sectionKey
    );

    let previousContent = "";

    if (sectionIndex !== -1) {
      // Update existing section
      previousContent = pageContent.sections[sectionIndex].content;
      
      pageContent.sections[sectionIndex] = {
        sectionKey: sectionKey,
        content: content,
        contentType: contentType || "text",
        lastUpdatedBy: adminId,
        lastUpdatedAt: new Date(),
      };
    } else {
      // Add new section
      pageContent.sections.push({
        sectionKey: sectionKey,
        content: content,
        contentType: contentType || "text",
        lastUpdatedBy: adminId,
        lastUpdatedAt: new Date(),
      });
    }

    // Increment version
    pageContent.version += 1;

    // Save the updated content
    await pageContent.save();

    // Create history entry
    await PageContentHistory.create({
      pageContentId: pageContent._id,
      pageId: pageId,
      sectionKey: sectionKey,
      previousContent: previousContent || "[New Section]",
      newContent: content,
      changedBy: adminId,
      changedByName: adminName,
      changeReason: changeReason || "Content update",
    });

    res.status(200).json({
      message: "Content updated successfully",
      section: {
        sectionKey: sectionKey,
        content: content,
        lastUpdatedBy: adminName,
        lastUpdatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating page content:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST /content/:pageId/bulk - Update multiple sections at once (admin only)
router.post("/:pageId/bulk", validateSession, validateAdmin, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { sections, metadata, changeReason } = req.body;
    const adminId = req.user._id;
    const adminName = `${req.user.firstName} ${req.user.lastName}`;

    // Find or create page content
    let pageContent = await PageContent.findOne({ pageId });
    
    if (!pageContent) {
      pageContent = new PageContent({
        pageId: pageId,
        sections: [],
        metadata: metadata || {},
      });
    }

    // Track changes for history
    const changes = [];

    // Update sections
    if (sections && Array.isArray(sections)) {
      for (const newSection of sections) {
        const existingIndex = pageContent.sections.findIndex(
          s => s.sectionKey === newSection.sectionKey
        );

        if (existingIndex !== -1) {
          const previousContent = pageContent.sections[existingIndex].content;
          
          if (previousContent !== newSection.content) {
            changes.push({
              sectionKey: newSection.sectionKey,
              previousContent: previousContent,
              newContent: newSection.content,
            });

            pageContent.sections[existingIndex] = {
              ...pageContent.sections[existingIndex],
              content: newSection.content,
              contentType: newSection.contentType || "text",
              lastUpdatedBy: adminId,
              lastUpdatedAt: new Date(),
            };
          }
        } else {
          // New section
          changes.push({
            sectionKey: newSection.sectionKey,
            previousContent: "[New Section]",
            newContent: newSection.content,
          });

          pageContent.sections.push({
            sectionKey: newSection.sectionKey,
            content: newSection.content,
            contentType: newSection.contentType || "text",
            lastUpdatedBy: adminId,
            lastUpdatedAt: new Date(),
          });
        }
      }
    }

    // Update metadata if provided
    if (metadata) {
      pageContent.metadata = { ...pageContent.metadata, ...metadata };
    }

    // Increment version
    pageContent.version += 1;

    // Save the updated content
    await pageContent.save();

    // Create history entries for all changes
    for (const change of changes) {
      await PageContentHistory.create({
        pageContentId: pageContent._id,
        pageId: pageId,
        sectionKey: change.sectionKey,
        previousContent: change.previousContent,
        newContent: change.newContent,
        changedBy: adminId,
        changedByName: adminName,
        changeReason: changeReason || "Bulk content update",
      });
    }

    res.status(200).json({
      message: "Content updated successfully",
      updatedSections: changes.length,
      version: pageContent.version,
    });
  } catch (error) {
    console.error("Error bulk updating page content:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET /content/:pageId/history - Get content history (admin only)
router.get("/:pageId/history", validateSession, validateAdmin, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const history = await PageContentHistory.find({ pageId })
      .sort({ changeDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate("changedBy", "firstName lastName");

    const totalCount = await PageContentHistory.countDocuments({ pageId });

    res.status(200).json({
      message: "History retrieved successfully",
      history: history,
      total: totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Error fetching content history:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST /content/:pageId/revert/:historyId - Revert to previous version (admin only)
router.post("/:pageId/revert/:historyId", validateSession, validateAdmin, async (req, res) => {
  try {
    const { pageId, historyId } = req.params;
    const adminId = req.user._id;
    const adminName = `${req.user.firstName} ${req.user.lastName}`;

    // Get the history entry
    const historyEntry = await PageContentHistory.findById(historyId);
    
    if (!historyEntry || historyEntry.pageId !== pageId) {
      return res.status(404).json({ message: "History entry not found" });
    }

    // Get the page content
    const pageContent = await PageContent.findOne({ pageId });
    
    if (!pageContent) {
      return res.status(404).json({ message: "Page content not found" });
    }

    // Find the section to revert
    const sectionIndex = pageContent.sections.findIndex(
      s => s.sectionKey === historyEntry.sectionKey
    );

    if (sectionIndex === -1) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Store current content before reverting
    const currentContent = pageContent.sections[sectionIndex].content;

    // Revert to previous content
    pageContent.sections[sectionIndex].content = historyEntry.previousContent;
    pageContent.sections[sectionIndex].lastUpdatedBy = adminId;
    pageContent.sections[sectionIndex].lastUpdatedAt = new Date();
    pageContent.version += 1;

    await pageContent.save();

    // Create new history entry for the revert
    await PageContentHistory.create({
      pageContentId: pageContent._id,
      pageId: pageId,
      sectionKey: historyEntry.sectionKey,
      previousContent: currentContent,
      newContent: historyEntry.previousContent,
      changedBy: adminId,
      changedByName: adminName,
      changeReason: `Reverted to version from ${historyEntry.changeDate}`,
    });

    res.status(200).json({
      message: "Content reverted successfully",
      revertedSection: historyEntry.sectionKey,
    });
  } catch (error) {
    console.error("Error reverting content:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /content/:pageId/:sectionKey - Delete a section (admin only)
router.delete("/:pageId/:sectionKey", validateSession, validateAdmin, async (req, res) => {
  try {
    const { pageId, sectionKey } = req.params;
    const adminId = req.user._id;
    const adminName = `${req.user.firstName} ${req.user.lastName}`;

    const pageContent = await PageContent.findOne({ pageId });
    
    if (!pageContent) {
      return res.status(404).json({ message: "Page content not found" });
    }

    const sectionIndex = pageContent.sections.findIndex(
      s => s.sectionKey === sectionKey
    );

    if (sectionIndex === -1) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Store content for history
    const deletedContent = pageContent.sections[sectionIndex].content;

    // Remove the section
    pageContent.sections.splice(sectionIndex, 1);
    pageContent.version += 1;

    await pageContent.save();

    // Create history entry for deletion
    await PageContentHistory.create({
      pageContentId: pageContent._id,
      pageId: pageId,
      sectionKey: sectionKey,
      previousContent: deletedContent,
      newContent: "[Section Deleted]",
      changedBy: adminId,
      changedByName: adminName,
      changeReason: "Section deleted",
    });

    res.status(200).json({
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;