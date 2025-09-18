import React, { useState, useEffect } from "react";
import {
  API_VIEW_MENTEES,
  API_ADMIN_MATCH_REQUESTS,
} from "../../../constants/endpoints";
import { API } from "../../../constants/endpoints";

const AdminFellowsList = (props) => {
  const [fellows, setFellows] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchFellows();
  }, []);

  async function fetchFellows() {
    setIsRefreshing(true);
    try {
      // First, get all mentees
      const response = await fetch(API_VIEW_MENTEES, {
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
      });

      const data = await response.json();
      const menteesList = data.mentees || [];

      // Get match requests to find consent data
      const matchResponse = await fetch(API_ADMIN_MATCH_REQUESTS, {
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
      });

      if (matchResponse.ok) {
        const matchData = await matchResponse.json();

        // Create a map for quick lookup by mentee ID
        const consentMap = {};

        // Process each match request
        matchData.requests.forEach((request) => {
          if (request.guardianInfo && request.mentee?.id) {
            // Store the guardian info keyed by mentee ID
            consentMap[request.mentee.id] = {
              guardianName: request.guardianInfo.name,
              guardianEmail: request.guardianInfo.email,
              guardianPhone: request.guardianInfo.phone,
              emergencyContact: request.guardianInfo.emergencyContact,
              consentDate: request.guardianConsentAt,
              status: request.status,
              mentorName: request.mentor?.name,
            };
          }
        });

        // Merge consent data with fellows
        const fellowsWithConsent = menteesList.map((mentee) => {
          const consent = consentMap[mentee.id] || consentMap[mentee._id];
          return {
            ...mentee,
            consentData: consent || null,
          };
        });

        setFellows(fellowsWithConsent);
      } else {
        // If match requests fail, just show fellows without consent data
        setFellows(menteesList);
      }

      setLastRefreshed(new Date());
    } catch (error) {
      console.error("ERROR:", error);
      alert("Failed to fetch fellows.");
    } finally {
      setIsRefreshing(false);
    }
  }

  // Reset fellow password
  const handleResetPassword = async (fellowId, fellowName) => {
    if (
      !window.confirm(
        `Are you sure you want to reset the password for ${fellowName}? The new password will be: 0000`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/admin/mentee/reset-password/${fellowId}`,
        {
          method: "PUT",
          headers: {
            Authorization: props.token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      alert(data.message);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(error.message || "Failed to reset password");
    }
  };

  const getLastRefreshedText = () => {
    if (!lastRefreshed) return "";
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastRefreshed) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  const toggleRowExpansion = (fellowId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(fellowId)) {
      newExpanded.delete(fellowId);
    } else {
      newExpanded.add(fellowId);
    }
    setExpandedRows(newExpanded);
  };

  // Functions for expand/collapse all
  const expandAll = () => {
    const allFellowIds = new Set(fellows.map((fellow) => fellow.id));
    setExpandedRows(allFellowIds);
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  const getMatchStatus = (fellow) => {
    // Check for matched status
    if (fellow.approvedMentors && fellow.approvedMentors.length > 0) {
      return {
        status: "Matched",
        color: "bg-green-500",
        icon: "✓",
        description: "Matched with team",
      };
    }
    // Check for pending request
    else if (fellow.requestedMentors && fellow.requestedMentors.length > 0) {
      // Check if we have consent data
      if (fellow.consentData && fellow.consentData.guardianName) {
        return {
          status: "Pending Team",
          color: "bg-blue-500",
          icon: "⏳",
          description: "Awaiting team decision",
        };
      } else {
        return {
          status: "Pending Consent",
          color: "bg-yellow-500",
          icon: "📋",
          description: "Awaiting guardian consent",
        };
      }
    }
    // No request made
    else {
      return {
        status: "Not Matched",
        color: "bg-gray-500",
        icon: "—",
        description: "No active request",
      };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl text-center py-4 uppercase text-gray-900 dark:text-white">
          Fellows List
        </h1>
        <div className="flex items-center gap-4">
          {/* Expand/Collapse All Buttons */}
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm"
            >
              Collapse All
            </button>
          </div>

          <button
            onClick={fetchFellows}
            disabled={isRefreshing}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              isRefreshing
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#1b0a5f] hover:bg-[#6c50e1] text-white"
            }`}
          >
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
              <th className="px-3 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                Fellow Name
              </th>
              <th className="px-3 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                Email
              </th>
              <th className="px-3 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                School
              </th>
              <th className="px-2 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold text-sm">
                Project
              </th>
              <th className="px-3 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold text-sm">
                Guardian Email
              </th>
              <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold min-w-[120px]">
                Status
              </th>
              <th className="px-3 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                Actions
              </th>
              <th className="px-3 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold text-sm">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {fellows.map((fellow) => {
              const matchStatus = getMatchStatus(fellow);
              return (
                <React.Fragment key={fellow.id}>
                  <tr className="hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-3 py-3 border-2 font-bold border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                      {fellow.firstName} {fellow.lastName}
                    </td>
                    <td className="px-3 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                      {fellow.email}
                    </td>
                    <td className="px-3 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                      {fellow.school}
                    </td>
                    <td className="px-2 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                      <div className="max-w-[100px]">
                        <p
                          className="truncate text-sm"
                          title={fellow.project || "No answer provided"}
                        >
                          {fellow.project || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-[150px]">
                        <p className="truncate" title={fellow.guardianEmail}>
                          {fellow.guardianEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-center">
                      <span
                        className={`px-2 py-1 ${matchStatus.color} text-white rounded-md text-sm`}
                      >
                        {matchStatus.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-center">
                      <button
                        onClick={() =>
                          handleResetPassword(
                            fellow.id,
                            `${fellow.firstName} ${fellow.lastName}`
                          )
                        }
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium text-sm"
                      >
                        Reset Password
                      </button>
                    </td>
                    <td className="px-3 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-center">
                      <button
                        onClick={() => toggleRowExpansion(fellow.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                      >
                        {expandedRows.has(fellow.id) ? "Hide" : "Show"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row with consent form data */}
                  {expandedRows.has(fellow.id) && (
                    <tr className="bg-gray-50 dark:bg-gray-900">
                      <td
                        colSpan="8"
                        className="px-4 py-4 border-2 border-[#1b0a5f] dark:border-gray-600"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Fellow Details */}
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg border-b dark:border-gray-700 pb-2">
                              Fellow Information
                            </h4>
                            <div className="space-y-2">
                              <p className="text-gray-900 dark:text-gray-100">
                                <strong>Full Name:</strong> {fellow.firstName}{" "}
                                {fellow.lastName}
                              </p>
                              <p className="text-gray-900 dark:text-gray-100">
                                <strong>Email:</strong> {fellow.email}
                              </p>
                              <p className="text-gray-900 dark:text-gray-100">
                                <strong>School:</strong> {fellow.school}
                              </p>
                              <p className="text-gray-900 dark:text-gray-100">
                                <strong>Interests:</strong>{" "}
                                {fellow.interests
                                  ? fellow.interests.join(", ")
                                  : "None listed"}
                              </p>
                              <p className="text-gray-900 dark:text-gray-100">
                                <strong>Project Interest:</strong>{" "}
                                {fellow.project || "Not provided"}
                              </p>
                              <p className="text-gray-900 dark:text-gray-100">
                                <strong>Guardian Email:</strong>{" "}
                                {fellow.guardianEmail}
                              </p>
                            </div>
                          </div>

                          {/* Consent Form Data */}
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg border-b dark:border-gray-700 pb-2">
                              Parent Consent Information
                            </h4>
                            {fellow.consentData ? (
                              <div className="space-y-2">
                                <p className="text-gray-900 dark:text-gray-100">
                                  <strong>Guardian Name:</strong>{" "}
                                  {fellow.consentData.guardianName ||
                                    "Not provided"}
                                </p>
                                <p className="text-gray-900 dark:text-gray-100">
                                  <strong>Guardian Email:</strong>{" "}
                                  {fellow.consentData.guardianEmail ||
                                    "Not provided"}
                                </p>
                                <p className="text-gray-900 dark:text-gray-100">
                                  <strong>Guardian Phone:</strong>{" "}
                                  {fellow.consentData.guardianPhone ||
                                    "Not provided"}
                                </p>

                                {fellow.consentData.emergencyContact && (
                                  <div className="mt-4 pt-3 border-t dark:border-gray-700">
                                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                      Emergency Contact:
                                    </h5>
                                    <p className="text-gray-900 dark:text-gray-100">
                                      <strong>Name:</strong>{" "}
                                      {fellow.consentData.emergencyContact
                                        .name || "Not provided"}
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100">
                                      <strong>Phone:</strong>{" "}
                                      {fellow.consentData.emergencyContact
                                        .phone || "Not provided"}
                                    </p>
                                    <p className="text-gray-900 dark:text-gray-100">
                                      <strong>Relationship:</strong>{" "}
                                      {fellow.consentData.emergencyContact
                                        .relation || "Not provided"}
                                    </p>
                                  </div>
                                )}

                                <div className="mt-4 pt-3 border-t dark:border-gray-700">
                                  <p className="text-gray-900 dark:text-gray-100">
                                    <strong>Consent Status:</strong>
                                    <span className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm">
                                      Approved
                                    </span>
                                  </p>
                                  <p className="text-gray-900 dark:text-gray-100">
                                    <strong>Consent Date:</strong>{" "}
                                    {fellow.consentData.consentDate
                                      ? new Date(
                                          fellow.consentData.consentDate
                                        ).toLocaleDateString()
                                      : "Not available"}
                                  </p>
                                  <p className="text-gray-900 dark:text-gray-100">
                                    <strong>Matched with:</strong>{" "}
                                    {fellow.consentData.mentorName || "N/A"}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <div className="text-gray-400 dark:text-gray-500 mb-2">
                                  <svg
                                    className="w-12 h-12 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                  No consent form data available
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                  Consent form may not have been submitted yet
                                  or fellow may have registered before consent
                                  tracking was implemented.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {fellows.length === 0 && !isRefreshing && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No fellows found.
          </div>
        )}

        {isRefreshing && (
          <div className="text-center py-4">
            <div className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-500">Refreshing fellows list...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFellowsList;
