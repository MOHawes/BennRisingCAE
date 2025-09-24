import React, { useState, useEffect } from "react";
import { API } from "../../../constants/endpoints";

const ContentHistory = ({ pageId, token, onRevert }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    fetchHistory();
  }, [pageId]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/content/${pageId}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = async (historyId) => {
    if (!window.confirm("Are you sure you want to revert to this version? This will create a new history entry.")) {
      return;
    }

    try {
      const response = await fetch(`${API}/content/${pageId}/revert/${historyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to revert");
      }

      const data = await response.json();
      alert(data.message);
      
      // Refresh history and trigger parent refresh
      await fetchHistory();
      if (onRevert) {
        onRevert();
      }
    } catch (error) {
      console.error("Error reverting content:", error);
      alert("Failed to revert content. Please try again.");
    }
  };

  const toggleExpanded = (historyId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(historyId)) {
      newExpanded.delete(historyId);
    } else {
      newExpanded.add(historyId);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          <strong>Content History:</strong> Shows all changes made to this page. You can view what changed and revert to previous versions.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No history found for this page.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const isExpanded = expandedItems.has(item._id);
            return (
              <div
                key={item._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div
                  className="bg-gray-50 dark:bg-gray-700 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => toggleExpanded(item._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.sectionKey.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Changed by {item.changedByName || "Unknown"} on {formatDate(item.changeDate)}
                      </p>
                      {item.changeReason && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                          Reason: {item.changeReason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevert(item._id);
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Revert
                      </button>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          isExpanded ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Previous Content:
                        </h5>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                          {item.previousContent === "[New Section]" ? (
                            <span className="text-gray-500 dark:text-gray-400 italic">{item.previousContent}</span>
                          ) : (
                            <div dangerouslySetInnerHTML={{ __html: item.previousContent }} />
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                          New Content:
                        </h5>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                          {item.newContent === "[Section Deleted]" ? (
                            <span className="text-gray-500 dark:text-gray-400 italic">{item.newContent}</span>
                          ) : (
                            <div dangerouslySetInnerHTML={{ __html: item.newContent }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentHistory;