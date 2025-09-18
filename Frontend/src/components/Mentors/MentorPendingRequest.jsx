import React, { useState, useEffect } from "react";
import {
  API_VIEW_PENDING_REQUESTS,
  API_MENTOR_DECISION,
  API_MENTOR_PROFILE_PREVIEW,
} from "../../constants/endpoints";

const MentorPendingRequest = (props) => {
  const [requests, setRequests] = useState([]);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [mentorQuestion, setMentorQuestion] = useState("");

  useEffect(() => {
    if (props.token) {
      fetchMentorProfile();
      fetchRequests();
    }
  }, [props.token]);

  const fetchMentorProfile = async () => {
    try {
      const response = await fetch(API_MENTOR_PROFILE_PREVIEW, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.questionToAsk) {
          setMentorQuestion(data.user.questionToAsk);
        }
      }
    } catch (error) {
      console.error("Error fetching mentor profile:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      console.log("Fetching from URL:", API_VIEW_PENDING_REQUESTS);

      // headers
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", props.token);

      // request options
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      // send request
      const response = await fetch(
        API_VIEW_PENDING_REQUESTS,
        requestOptions
      );

      // Check if response is ok
      if (!response.ok) {
        console.error(
          "Response not OK:",
          response.status,
          response.statusText
        );
        return;
      }

      // Try to parse JSON
      const data = await response.json();
      console.log("Pending requests data:", data);

      // check if we got requests back
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  // Toggle card expansion
  const toggleCardExpansion = (requestId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedCards(newExpanded);
  };

  // Accept a mentee request
  const handleAccept = async (requestId) => {
    try {
      // headers
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", props.token);

      // body
      let body = JSON.stringify({
        approved: true,
      });

      // request options
      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: body,
      };

      // send request
      const response = await fetch(
        `${API_MENTOR_DECISION}/${requestId}`,
        requestOptions
      );
      const data = await response.json();
      console.log("Accept response:", data);

      if (response.ok) {
        alert("Match confirmed successfully!");
        // remove the request from the list
        setRequests(requests.filter((req) => req._id !== requestId));
        // Call the callback to refresh parent data
        if (props.onMatchUpdate) {
          props.onMatchUpdate();
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error accepting mentee:", error);
      alert("Error accepting request");
    }
  };

  // Reject a mentee request
  const handleReject = async (requestId) => {
    try {
      // headers
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", props.token);

      // body
      let body = JSON.stringify({
        approved: false,
      });

      // request options
      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: body,
      };

      // send request
      const response = await fetch(
        `${API_MENTOR_DECISION}/${requestId}`,
        requestOptions
      );
      const data = await response.json();
      console.log("Reject response:", data);

      if (response.ok) {
        alert("Match declined.");
        // remove the request from the list
        setRequests(requests.filter((req) => req._id !== requestId));
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error rejecting mentee:", error);
      alert("Error rejecting request");
    }
  };

  return (
    <>
      <div className="w-full md:w-[95%] px-4 pb-4">
        <ul className="list rounded-box shadow-md">
          {/* Header */}
          <li className="p-4 pb-2 text-lg opacity-90 tracking-wide font-semibold text-white bg-[#1b0a5f] dark:bg-gray-800 rounded-box shadow-md text-center">
            Pending Requests ({requests.length})
          </li>

          {/* Show message if no requests */}
          {requests.length === 0 ? (
            <li className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700">
              No pending requests at the moment
            </li>
          ) : (
            // Map through requests
            requests.map((request) => (
              <li
                key={request._id}
                className="list-row flex flex-col bg-white dark:bg-gray-700 border-t dark:border-gray-600"
              >
                {/* Main row content */}
                <div className="flex items-center gap-4 px-4 py-3">
                  {/* Profile Picture */}
                  <div>
                    <img
                      className="size-10 rounded-box"
                      src={`https://api.dicebear.com/7.x/initials/svg?radius=50&seed=${request.menteeId.firstName}-${request.menteeId.lastName}`}
                      alt={`${request.menteeId.firstName} ${request.menteeId.lastName}`}
                    />
                  </div>

                  {/* Mentee Basic Info */}
                  <div className="list-col-grow flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {request.menteeId.firstName} {request.menteeId.lastName}
                    </div>
                    <div className="text-xs uppercase font-semibold opacity-80 text-gray-700 dark:text-gray-300">
                      {request.menteeId.school}
                    </div>
                  </div>

                  {/* Expand/Collapse Button with text */}
                  <div className="flex flex-col items-center">
                    <button
                      className="btn btn-square btn-ghost text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                      onClick={() => toggleCardExpansion(request._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`size-[1.4em] transform transition-transform ${
                          expandedCards.has(request._id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {expandedCards.has(request._id) ? 'Less' : 'More'}
                    </span>
                  </div>

                  {/*  Accept Button with text */}
                  <div className="flex flex-col items-center">
                    <button
                      className="btn btn-square btn-ghost text-success hover:bg-success/10"
                      onClick={() => handleAccept(request._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-[1.4em]"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accept</span>
                  </div>

                  {/* Reject Button with text */}
                  <div className="flex flex-col items-center">
                    <button
                      className="btn btn-square btn-ghost text-error hover:bg-error/10"
                      onClick={() => handleReject(request._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-[1.4em]"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Decline</span>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedCards.has(request._id) && (
                  <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Left Column - Fellow Info */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Fellow Information:
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Name:</strong> {request.menteeId.firstName} {request.menteeId.lastName}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>School:</strong> {request.menteeId.school}
                          </p>
                          {/* <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            <strong>Note:</strong> Contact information will be available after accepting the match
                          </p> */}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            <strong>Interests:</strong>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {request.menteeId.interests?.map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Answers */}
                      <div className="space-y-3">
                        {request.answerId && (
                          <>
                            <div>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Your Question:
                              </p>
                              <div className="bg-white dark:bg-gray-700 p-3 rounded-md border dark:border-gray-600">
                                <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-1">
                                  "{mentorQuestion || request.answerId.mentorQuestion || 'Question not available'}"
                                </p>
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  <strong>Answer:</strong> {request.answerId.menteeAnswer}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Program Question:
                              </p>
                              <div className="bg-white dark:bg-gray-700 p-3 rounded-md border dark:border-gray-600">
                                <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-1">
                                  "How do you want to grow through participating in the Bennington Rising program?"
                                </p>
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  <strong>Answer:</strong> {request.answerId.programAnswer}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default MentorPendingRequest;