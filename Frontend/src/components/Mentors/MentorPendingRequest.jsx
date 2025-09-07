import React, { useState, useEffect } from "react";
import {
  API_VIEW_PENDING_REQUESTS,
  API_MENTOR_DECISION,
} from "../../constants/endpoints";

const MentorPendingRequest = (props) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (props.token) {
      const fetchRequests = async () => {
        try {
          console.log("Fetching from URL:", API_VIEW_PENDING_REQUESTS); // Debug log

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

      fetchRequests();
    }
  }, [props.token]);

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
          <li className="p-4 pb-2 text-lg opacity-90 tracking-wide font-semibold text-white bg-[#1b0a5f] rounded-box shadow-md text-center">
            Pending Requests ({requests.length})
          </li>

          {/* Show message if no requests */}
          {requests.length === 0 ? (
            <li className="p-4 text-center text-gray-500">
              No pending requests at the moment
            </li>
          ) : (
            // Map through requests
            requests.map((request) => (
              <li
                key={request._id}
                className="list-row flex items-center gap-4 px-4 py-3 border-t"
              >
                {/* Profile Picture */}
                <div>
                  <img
                    className="size-10 rounded-box"
                    src={`https://api.dicebear.com/7.x/initials/svg?radius=50&seed=${request.menteeId.firstName}-${request.menteeId.lastName}`}
                    alt={`${request.menteeId.firstName} ${request.menteeId.lastName}`}
                  />
                </div>

                {/* Mentee Info */}
                <div className="list-col-grow flex-1">
                  <div className="font-semibold">
                    {request.menteeId.firstName} {request.menteeId.lastName}
                  </div>
                  <div className="text-xs uppercase font-semibold opacity-80">
                    {request.menteeId.school}
                  </div>
                  <div className="text-xs uppercase font-semibold opacity-80">
                    Interests: {request.menteeId.interests?.join(", ")}
                  </div>
                  {/* Show the answer if it exists */}
                  {request.answerId && request.answerId.menteeAnswer && (
                    <div className="text-sm mt-1 italic">
                      Answer: {request.answerId.menteeAnswer}
                    </div>
                  )}
                </div>

                {/*  Accept Button */}
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

                {/* Reject Button */}
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
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default MentorPendingRequest;
