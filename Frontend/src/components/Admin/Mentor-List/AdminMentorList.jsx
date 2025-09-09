import React, { useState, useEffect } from "react";
import {
  API_ADMIN_DELETE_MENTOR,
  API_ADMIN_UPDATE_MENTOR,
  API_DELETE_MENTOR,
  API_VIEW_MENTORS,
} from "../../../constants/endpoints";
import UpdateMentorForm from "./UpdateMentorForm";

const AdminMentorList = (props) => {
  const [mentors, setMentors] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // for the Update Modal
  const [showModal, setShowModal] = useState(false);
  const [mentorToUpdate, setMentorToUpdate] = useState(null);

  const handleOpenModal = (mentor) => {
    console.log("Opening modal for mentor:", mentor);
    setMentorToUpdate(mentor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMentorToUpdate(null);
  };

  useEffect(() => {
    fetchMentors();
    // after fetch, reset the refresh flag to stop it form triggering
    props.setRefreshMentors(false);
  }, [props.refreshMentors]);

  async function fetchMentors() {
    setIsRefreshing(true);
    try {
      const response = await fetch(API_VIEW_MENTORS);
      const data = await response.json();
      setMentors(data.mentors);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Error fetching mentors:", error);
      alert("Failed to fetch mentors. Please check if the backend server is running.");
    } finally {
      setIsRefreshing(false);
    }
  }

  // Manual refresh function
  const handleRefresh = () => {
    fetchMentors();
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

  //! Handle Update button function
  async function handleUpdate(mentorId, updatedData) {
    if (!mentorToUpdate || !mentorToUpdate.id) {
      console.error("Mentor ID is missing");
      return; // Don't proceed if there's no ID
    }

    try {
      console.log("Update Clicked");
      // Headers
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      // Add an authorization to the headers if you need a token for that route
      myHeaders.append("Authorization", props.token);
      console.log(props.token);
      // Request Body
      let body = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        projectCategory: updatedData.projectCategory,
      };
      //   Request Options
      let requestOption = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(body),
      };

      console.log("Updating mentor with this ID: ", mentorId);

      // Send Request
      let response = await fetch(
        `${API_ADMIN_UPDATE_MENTOR}/${mentorId}`,
        requestOption
      );

      if (!response.ok) {
        // If not, throw an error with status code
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Response Object
      let data = await response.json();
      console.log(data);

      // Re-fetch mentors
      fetchMentors();

      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error("Error occured during update: ", error);
    }
  }

  async function handleDelete(mentorId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this mentor?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_ADMIN_DELETE_MENTOR}/${mentorId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${props.token}`,
          },
        });
        if (response.ok) {
          fetchMentors(); // Refresh the list after deletion
          console.log(`Mentor with ID: ${mentorId} deleted successfully.`);
        } else {
          console.error("Failed to delete mentor.");
        }
      } catch (error) {
        console.error("Error deleting mentor:", error);
      }
    }
  }

  return (
    <>
      <div className="container mx-auto p-4 bg-white dark:bg-gray-900">
        {/* Header with title and refresh button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl text-center py-4 uppercase text-gray-900 dark:text-white">
            Mentor List
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
                  Coordinator #1:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Coordinator #2:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Email:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Project Category:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Interests:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Question:
                </th>
                <th className="px-4 py-2 border-2 border-[#1b0a5f] dark:border-gray-600 text-white dark:text-gray-200 text-center font-semibold">
                  Actions:
                </th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr
                  key={mentor.id}
                  className="hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 border-2 font-bold border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {mentor.firstName}
                  </td>
                  <td className="px-4 py-3 border-2 font-bold border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {mentor.lastName}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {mentor.email}
                  </td>
                  <td className="px-4 py-3 border-2 text-blue-500 dark:text-blue-400 font-bold border-[#1b0a5f] dark:border-gray-600">
                    {mentor.projectCategory || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {mentor.interests.join(", ")}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600 text-gray-900 dark:text-white">
                    {mentor.questionToAsk}
                  </td>
                  <td className="px-4 py-3 border-2 border-[#1b0a5f] dark:border-gray-600">
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-soft btn-primary px-2 py-1 rounded-md transition bg-blue-500 hover:bg-blue-600 text-white text-sm"
                        onClick={() => handleOpenModal(mentor)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-soft px-2 py-1 rounded-md transition bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                        onClick={() =>
                          handleResetPassword(
                            mentor.id,
                            `${mentor.firstName} ${mentor.lastName}`
                          )
                        }
                      >
                        Reset Password
                      </button>
                      <button
                        className="btn btn-soft btn-error px-2 py-1 rounded-md transition bg-red-500 hover:bg-red-600 text-white text-sm"
                        onClick={() => handleDelete(mentor.id)}
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
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading mentors...</span>
            </div>
          )}
          
          {/* Show message when no mentors */}
          {!isRefreshing && mentors.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No mentors found. Try refreshing or check if any mentors have been created.
            </div>
          )}
        </div>
        
        {/* Conditionally render the modal if showModal is true */}
        {showModal && mentorToUpdate && (
          <UpdateMentorForm
            mentorData={mentorToUpdate}
            handleUpdateMentor={handleUpdate}
            handleClose={handleCloseModal} // Pass the close function to the modal
          />
        )}
      </div>
    </>
  );
};

export default AdminMentorList;