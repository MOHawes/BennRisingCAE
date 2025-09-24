import React, { useState, useRef } from "react";

const ContentSection = ({ sectionKey, label, type, content, onChange, hasChanges }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const textAreaRef = useRef(null);

  // Simple rich text editor commands
  const formatText = (command, value = null) => {
    if (type !== "html") return;
    
    // For textarea-based editing, we'll insert HTML tags
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = "";
    switch (command) {
      case "bold":
        newText = `<strong>${selectedText}</strong>`;
        break;
      case "italic":
        newText = `<em>${selectedText}</em>`;
        break;
      case "underline":
        newText = `<u>${selectedText}</u>`;
        break;
      case "link":
        const url = prompt("Enter URL:", "https://");
        if (url) {
          newText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText || "link text"}</a>`;
        }
        break;
      case "ul":
        newText = `<ul>\n  <li>${selectedText || "Item"}</li>\n</ul>`;
        break;
      case "ol":
        newText = `<ol>\n  <li>${selectedText || "Item"}</li>\n</ol>`;
        break;
      case "paragraph":
        newText = `<p>${selectedText || "Paragraph text"}</p>`;
        break;
      case "heading":
        newText = `<h3>${selectedText || "Heading"}</h3>`;
        break;
      default:
        return;
    }

    if (newText) {
      const newContent = content.substring(0, start) + newText + content.substring(end);
      onChange(newContent);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.selectionStart = start + newText.length;
        textarea.selectionEnd = start + newText.length;
        textarea.focus();
      }, 0);
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${
      hasChanges ? "border-orange-400 dark:border-orange-600" : "border-gray-200 dark:border-gray-700"
    }`}>
      <div 
        className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
          {hasChanges && (
            <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">Modified</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {type === "html" ? "Rich Text" : "Plain Text"}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white dark:bg-gray-800">
          {type === "html" && (
            <div className="mb-3 flex flex-wrap gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => formatText("bold")}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => formatText("italic")}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                onClick={() => formatText("underline")}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Underline"
              >
                <u>U</u>
              </button>
              <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => formatText("heading")}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Heading"
              >
                H
              </button>
              <button
                onClick={() => formatText("paragraph")}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Paragraph"
              >
                P
              </button>
              <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => formatText("ul")}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Unordered List"
              >
                • List
              </button>
              <button
                onClick={() => formatText("ol")}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Ordered List"
              >
                1. List
              </button>
              <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => formatText("link")}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                title="Insert Link"
              >
                🔗 Link
              </button>
            </div>
          )}

          <textarea
            ref={textAreaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              type === "html" ? "font-mono text-sm" : ""
            }`}
            rows={type === "html" ? 10 : 3}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />

          {type === "html" && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <p>HTML tags supported. Common tags: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;h1&gt;-&lt;h6&gt;</p>
            </div>
          )}

          {/* Preview for HTML content */}
          {type === "html" && content && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</h4>
              <div 
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentSection;