import React, { useState, useEffect } from "react";
import { API } from "../../constants/endpoints";

const EditableText = ({ 
  pageId, 
  sectionKey, 
  defaultContent, 
  isAdmin = false, 
  token = null,
  className = "",
  tag = "div",
  contentType = "text"
}) => {
  const [content, setContent] = useState(defaultContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch content from server on mount
  useEffect(() => {
    fetchContent();
  }, [pageId, sectionKey]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API}/content/${pageId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const section = data.sections?.find(s => s.sectionKey === sectionKey);
        if (section) {
          setContent(section.content);
        }
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleEdit = () => {
    setEditContent(content || defaultContent);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API}/content/${pageId}/${sectionKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          content: editContent,
          contentType: contentType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      const data = await response.json();
      setContent(editContent);
      setIsEditing(false);
      alert("Content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditContent("");
    setIsEditing(false);
  };

  // Render the appropriate HTML tag
  const Tag = tag;

  // If not admin or not editing, just render the content
  if (!isAdmin || !isEditing) {
    return (
      <div className={`relative group ${isAdmin ? 'editable-text-wrapper' : ''}`}>
        {contentType === "html" ? (
          <Tag 
            className={className}
            dangerouslySetInnerHTML={{ __html: content || defaultContent }}
          />
        ) : (
          <Tag className={className}>
            {content || defaultContent}
          </Tag>
        )}
        
        {isAdmin && (
          <button
            onClick={handleEdit}
            className="absolute top-0 right-0 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded shadow-lg"
            title="Edit this content"
          >
            Edit
          </button>
        )}
      </div>
    );
  }

  // Render edit mode
  return (
    <div className="editable-text-editing border-2 border-blue-500 rounded p-4 bg-white dark:bg-gray-800 shadow-lg">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Editing: {sectionKey.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </label>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          rows={contentType === "html" ? 10 : 4}
        />
        {contentType === "html" && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            HTML tags supported: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;
          </p>
        )}
      </div>
      
      {contentType === "html" && editContent && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview:</h4>
          <div 
            className="prose prose-sm dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: editContent }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:bg-gray-400"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditableText;