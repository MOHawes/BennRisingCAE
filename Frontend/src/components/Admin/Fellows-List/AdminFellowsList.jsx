import React, { useState, useEffect } from "react";
import {
  API_VIEW_MENTORS, // We'll need to create a new endpoint for mentees
} from "../../../constants/endpoints";

// We'll need to add this new endpoint to endpoints.js
const API_VIEW_MENTEES = "http://localhost:4000/user/mentee/view-all";

const AdminFellowsList = (props) => {
  const [fellows, setFellows] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  useEffect(() => {
    fetchFellows();
  }, []);

  async function fetchFellows() {
    setIsRefreshing(true);
    try {
      const response = await fetch(API_VIEW_MENTEES, {
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
      });
      const data = await response.json();
      setFellows(data.mentees || []);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Error fetching fellows:", error);
      alert("Failed to fetch fellows. Please check if the backend server is running.");
    } finally {
      setIsRefreshing(false);
    }
  }

  // Manual refresh function
  const handleRefresh = () => {
    fetchFellows();
  };

  // Format last refreshed time
  const getLastRefreshedText = () => {
    if (!lastRefreshed) return "";
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastRefreshed) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return lastRefreshed.toLocaleTimeString();
  };

  async function handleDeleteFellow(fellowId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fellow?"
    );
    if (confirmDelete) {
      try {
        // We'll need to create this endpoint too
        const response = await fetch(`http://localhost:4000/admin/mentee/delete/${fellowId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: props.token,
          },
        });
        if (response.ok) {
          fetchFellows(); // Refresh the list after deletion
          console.log(`Fellow with ID: ${fellowId} deleted successfully.`);
        } else {
          console.error("Failed to delete fellow.");
        }
      } catch (error) {
        console.error("Error deleting fellow:", error);
      }
    }
  }

  return (
    <>
      <div className="container mx-auto p-4 bg-white dark:bg-gray-900">
        {/* Header with title and refresh button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl text-center py-4 uppercase text-gray-900 dark:text-white">
            Fellows List
          </h1>
          
          {/* Refresh section */}
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                isRefreshing
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#1b0a5f] hover:bg-[#6c50e1] text-white"
              }`}
            >
              {/* Refresh icon */}
              <svg
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            
            {/* Last refreshed timestamp */}
            {lastRefreshed && !isRefreshing && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {getLastRefreshedText()}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead className="sticky top-0 bg-[#1b0a5f] dark:bg-gray-700">
              <tr className="text-left text-white dark:text-gray-200">
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Fellow Name:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Email:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  School:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Interests:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Project:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Guardian Email:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Match Status:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Actions:
                </th>
              </tr>
            </thead>
            <tbody>
              {fellows.map((fellow) => (
                <tr
                  key={fellow.id}
                  className="hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 border-2 font-bold border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {fellow.firstName} {fellow.lastName}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {fellow.email}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {fellow.school}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {fellow.interests ? fellow.interests.join(", ") : "N/A"}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    <div className="max-w-xs overflow-hidden">
                      <p className="truncate" title={fellow.project || "No project answer"}>
                        {fellow.project || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {fellow.guardianEmail}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600">
                    {fellow.approvedMentors && fellow.approvedMentors.length > 0 ? (
                      <span className="px-2 py-1 bg-green-500 text-white rounded-md text-sm">
                        Matched
                      </span>
                    ) : fellow.requestedMentors && fellow.requestedMentors.length > 0 ? (
                      <span className="px-2 py-1 bg-yellow-500 text-white rounded-md text-sm">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-500 text-white rounded-md text-sm">
                        No Request
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600">
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-soft px-2 py-1 rounded-md transition bg-blue-500 hover:bg-blue-600 text-white text-sm"
                        onClick={() => {
                          // View details functionality
                          alert(`Fellow Details:\nName: ${fellow.firstName} ${fellow.lastName}\nEmail: ${fellow.email}\nSchool: ${fellow.school}\nInterests: ${fellow.interests ? fellow.interests.join(", ") : "None"}\nProject: ${fellow.project || "No answer"}\nGuardian: ${fellow.guardianEmail}`);
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-soft btn-error px-2 py-1 rounded-md transition bg-red-500 hover:bg-red-600 text-white text-sm"
                        onClick={() => handleDeleteFellow(fellow.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Show loading state when refreshing */}
          {isRefreshing && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b0a5f] dark:border-white"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading fellows...</span>
            </div>
          )}
          
          {/* Show message when no fellows */}
          {!isRefreshing && fellows.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No fellows found. Try refreshing or check if any fellows have registered.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminFellowsList;