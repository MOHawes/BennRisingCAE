import React, { useState, useEffect } from "react";
import { API } from "../../../constants/endpoints";
import ContentSection from "./ContentSection";
import ContentHistory from "./ContentHistory";

const ContentEditor = ({ token }) => {
  const [selectedPage, setSelectedPage] = useState("homepage");
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [editedSections, setEditedSections] = useState({});

  // Define available pages
  const pages = [
    { id: "homepage", name: "Home Page", sections: [
      { key: "hero_title", label: "Hero Title", type: "text" },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
      { key: "welcome_heading", label: "Welcome Heading", type: "text" },
      { key: "welcome_text", label: "Welcome Text", type: "html" },
      { key: "instructions_heading", label: "Instructions Heading", type: "text" },
      { key: "instructions_content", label: "Instructions Content", type: "html" },
      { key: "project1_heading", label: "What's in your food - Heading", type: "text" },
      { key: "project1_content", label: "What's in your food - Content", type: "html" },
      { key: "project2_heading", label: "Kids for science! - Heading", type: "text" },
      { key: "project2_content", label: "Kids for science! - Content", type: "html" },
    ]},
    { id: "mentors", name: "Team Coordinators Page", sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "intro_text", label: "Introduction Text", type: "html" },
      { key: "program_description", label: "Program Description", type: "html" },
      { key: "training_section", label: "Training Section", type: "html" },
      { key: "links_section", label: "Links Section", type: "html" },
      { key: "contact_section", label: "Contact Section", type: "html" },
    ]},
    { id: "mentees", name: "Team Fellows Page", sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "intro_text", label: "Introduction Text", type: "html" },
      { key: "program_benefits", label: "Program Benefits", type: "html" },
      { key: "links_section", label: "Links Section", type: "html" },
      { key: "contact_section", label: "Questions and Emergencies", type: "html" },
    ]},
    { id: "parents", name: "Parents Page", sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "intro_text", label: "Introduction Text", type: "html" },
      { key: "program_details", label: "Program Details", type: "html" },
      { key: "consent_info", label: "Consent Information", type: "html" },
      { key: "contact_section", label: "Contact Information", type: "html" },
    ]},
    { id: "partners", name: "Partners Page", sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "intro_text", label: "Introduction Text", type: "text" },
      { key: "partners_list", label: "Partners List", type: "html" },
      { key: "contributors_section", label: "Key Contributors", type: "html" },
    ]},
    { id: "important-dates", name: "Important Dates Page", sections: [
      { key: "page_title", label: "Page Title", type: "text" },
      { key: "intro_text", label: "Introduction Text", type: "text" },
      { key: "general_dates", label: "General Program Dates", type: "html" },
      { key: "project1_dates", label: "What's in your food Dates", type: "html" },
      { key: "project2_dates", label: "Kids for Science Dates", type: "html" },
    ]},
  ];

  // Fetch content for selected page
  useEffect(() => {
    if (selectedPage) {
      fetchPageContent();
    }
  }, [selectedPage]);

  const fetchPageContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/content/${selectedPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch page content");
      }

      const data = await response.json();
      setPageContent(data);
      setEditedSections({});
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Error fetching page content:", error);
      // Initialize empty content
      setPageContent({
        pageId: selectedPage,
        sections: [],
        metadata: {},
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle section content change
  const handleSectionChange = (sectionKey, newContent) => {
    setEditedSections(prev => ({
      ...prev,
      [sectionKey]: newContent
    }));
    setUnsavedChanges(true);
  };

  // Get content for a section
  const getSectionContent = (sectionKey) => {
    if (editedSections.hasOwnProperty(sectionKey)) {
      return editedSections[sectionKey];
    }
    
    const section = pageContent?.sections?.find(s => s.sectionKey === sectionKey);
    return section?.content || "";
  };

  // Save all changes
  const handleSaveAll = async () => {
    if (!unsavedChanges || Object.keys(editedSections).length === 0) return;

    setIsSaving(true);
    try {
      const currentPage = pages.find(p => p.id === selectedPage);
      const sections = Object.entries(editedSections).map(([sectionKey, content]) => {
        const sectionDef = currentPage.sections.find(s => s.key === sectionKey);
        return {
          sectionKey,
          content,
          contentType: sectionDef?.type || "text"
        };
      });

      const response = await fetch(`${API}/content/${selectedPage}/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          sections,
          changeReason: "Bulk content update from admin dashboard",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      const data = await response.json();
      alert(data.message);
      
      // Refresh content
      await fetchPageContent();
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle page change with unsaved changes warning
  const handlePageChange = (newPageId) => {
    if (unsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to switch pages?")) {
        return;
      }
    }
    setSelectedPage(newPageId);
  };

  const currentPage = pages.find(p => p.id === selectedPage);

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Content Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            {showHistory ? "Hide History" : "View History"}
          </button>
          <button
            onClick={handleSaveAll}
            disabled={!unsavedChanges || isSaving}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              unsavedChanges
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Saving..." : unsavedChanges ? "Save All Changes" : "No Changes"}
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex flex-wrap">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handlePageChange(page.id)}
                className={`mr-2 mb-2 py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedPage === page.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {page.name}
                {selectedPage === page.id && unsavedChanges && (
                  <span className="ml-2 text-xs text-orange-500">•</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Editor or History View */}
      {showHistory ? (
        <ContentHistory
          pageId={selectedPage}
          token={token}
          onRevert={() => {
            setShowHistory(false);
            fetchPageContent();
          }}
        />
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading content...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Tip:</strong> Edit the content sections below. Changes are saved locally until you click "Save All Changes".
                  Use the rich text editor for HTML content or plain text for simple fields.
                </p>
              </div>

              {currentPage?.sections.map((section) => (
                <ContentSection
                  key={section.key}
                  sectionKey={section.key}
                  label={section.label}
                  type={section.type}
                  content={getSectionContent(section.key)}
                  onChange={(content) => handleSectionChange(section.key, content)}
                  hasChanges={editedSections.hasOwnProperty(section.key)}
                />
              ))}

              {currentPage?.sections.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No sections defined for this page.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContentEditor;