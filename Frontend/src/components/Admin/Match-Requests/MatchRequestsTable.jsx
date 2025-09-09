import React, { useState, useEffect } from "react";
import { API_ADMIN_MATCH_REQUESTS } from "../../../constants/endpoints";

const MatchRequestsTable = ({ token }) => {
  const [matchRequests, setMatchRequests] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchMatchRequests();
  }, [token]);

  const fetchMatchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ADMIN_MATCH_REQUESTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch match requests");
      }

      const data = await response.json();
      setMatchRequests(data.requests);
      setStatusCounts(data.statusCounts);
    } catch (error) {
      console.error("Error fetching match requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on selected status
  const filteredRequests =
    selectedStatus === "all"
      ? matchRequests
      : matchRequests.filter((request) => request.status === selectedStatus);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending_guardian_consent: "bg-yellow-500 text-white",
      pending_mentor_approval: "bg-blue-500 text-white",
      confirmed: "bg-green-500 text-white",
      declined_by_guardian: "bg-red-500 text-white",
      declined_by_mentor: "bg-red-600 text-white",
      consent_window_expired: "bg-gray-500 text-white",
    };

    const statusLabels = {
      pending_guardian_consent: "Pending Guardian Consent",
      pending_mentor_approval: "Pending Mentor Approval",
      confirmed: "Confirmed Match",
      declined_by_guardian: "Declined by Guardian",
      declined_by_mentor: "Declined by Mentor",
      consent_window_expired: "Consent Window Expired",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusStyles[status] || "bg-gray-400 text-white"
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString()
    );
  };

  // Toggle row expansion
  const toggleRowExpansion = (requestId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading match requests...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Match Requests Tracking
        </h2>
        <button
          onClick={fetchMatchRequests}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedStatus === "all"
              ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
          onClick={() => setSelectedStatus("all")}
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {matchRequests.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedStatus === "pending_guardian_consent"
              ? "bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
          onClick={() => setSelectedStatus("pending_guardian_consent")}
        >
          <div className="text-2xl font-bold text-yellow-600">
            {statusCounts.pending_guardian_consent || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Pending Consent
          </div>
        </div>
        <div
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedStatus === "pending_mentor_approval"
              ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
          onClick={() => setSelectedStatus("pending_mentor_approval")}
        >
          <div className="text-2xl font-bold text-blue-600">
            {statusCounts.pending_mentor_approval || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Pending Mentor
          </div>
        </div>
        <div
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedStatus === "confirmed"
              ? "bg-green-100 dark:bg-green-900 border-2 border-green-500"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
          onClick={() => setSelectedStatus("confirmed")}
        >
          <div className="text-2xl font-bold text-green-600">
            {statusCounts.confirmed || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Confirmed
          </div>
        </div>
        <div
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedStatus === "declined_by_guardian"
              ? "bg-red-100 dark:bg-red-900 border-2 border-red-500"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
          onClick={() => setSelectedStatus("declined_by_guardian")}
        >
          <div className="text-2xl font-bold text-red-600">
            {statusCounts.declined_by_guardian || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Guardian Declined
          </div>
        </div>
        <div
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedStatus === "declined_by_mentor"
              ? "bg-red-100 dark:bg-red-900 border-2 border-red-600"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
          onClick={() => setSelectedStatus("declined_by_mentor")}
        >
          <div className="text-2xl font-bold text-red-700">
            {statusCounts.declined_by_mentor || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mentor Declined
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fellow (Mentee)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Team (Mentor)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Requested At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredRequests.map((request) => (
              <React.Fragment key={request.id}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.mentee.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {request.mentee.school}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.mentor.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {request.mentor.projectCategory}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(request.requestedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleRowExpansion(request.id)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {expandedRows.has(request.id)
                        ? "Hide Details"
                        : "Show Details"}
                    </button>
                  </td>
                </tr>
                {expandedRows.has(request.id) && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Fellow Details:
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Email: {request.mentee.email}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Interests: {request.mentee.interests.join(", ")}
                          </p>
                          {request.answers && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Team Answer:</strong>{" "}
                                {request.answers.mentorAnswer}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Program Answer:</strong>{" "}
                                {request.answers.programAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Timeline:
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <p>Requested: {formatDate(request.requestedAt)}</p>
                            {request.consentDeadline && (
                              <p>
                                Consent Deadline:{" "}
                                {formatDate(request.consentDeadline)}
                              </p>
                            )}
                            {request.guardianConsentAt && (
                              <p>
                                Guardian Consented:{" "}
                                {formatDate(request.guardianConsentAt)}
                              </p>
                            )}
                            {request.mentorDecisionAt && (
                              <p>
                                Mentor Decision:{" "}
                                {formatDate(request.mentorDecisionAt)}
                              </p>
                            )}
                            {request.confirmedAt && (
                              <p>
                                Confirmed: {formatDate(request.confirmedAt)}
                              </p>
                            )}
                            {request.declinedAt && (
                              <p>Declined: {formatDate(request.declinedAt)}</p>
                            )}
                            {request.expiredAt && (
                              <p>Expired: {formatDate(request.expiredAt)}</p>
                            )}
                            <p>Reminders Sent: {request.remindersSent}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No match requests found for the selected status.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchRequestsTable;
