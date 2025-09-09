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
    try {
      const response = await fetch(API_VIEW_MENTORS);
      const data = await response.json();
      setMentors(data.mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  }

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
        <h1 className="text-4xl text-center py-4 uppercase text-gray-900 dark:text-white">
          Mentor List
        </h1>
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
