// Mentor Profile
import React, { useEffect, useState } from "react";
import { API_MENTOR_PROFILE_PREVIEW } from "../../constants/endpoints.js";
import MentorProfileEdit from "./MentorProfileEdit.jsx";

const MentorProfile = ({ token, onProfileUpdate }) => {
  const [mentor, setMentor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageError1, setImageError1] = useState(false);
  const [imageError2, setImageError2] = useState(false);

  const fetchMentorData = async () => {
    try {
      const response = await fetch(API_MENTOR_PROFILE_PREVIEW, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch mentor data");

      const data = await response.json();
      console.log("Mentor data:", data);
      setMentor(data.user || data);

      // Check if the profile is complete - now requires both photos
      const requiredFields = [
        "firstName",
        "lastName",
        "profilePhoto1",
        "profilePhoto2",
        "bio",
        "email",
        "interests",
      ];
      const isComplete = requiredFields.every((field) => data.user[field]);
      onProfileUpdate(isComplete);

      // Reset image errors when we get updated data
      setImageError1(false);
      setImageError2(false);
    } catch (error) {
      console.error("Error fetching mentor data:", error);
    }
  };

  useEffect(() => {
    if (token) fetchMentorData();
  }, [token]);

  // Handle image loading errors
  const handleImageError1 = () => {
    console.log("Image 1 failed to load");
    setImageError1(true);
  };

  const handleImageError2 = () => {
    console.log("Image 2 failed to load");
    setImageError2(true);
  };

  if (!mentor)
    return (
      <div className="text-center mt-10 text-gray-900 dark:text-white">
        Loading...
      </div>
    );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title + update profile button button on same level */}
      <div className="flex justify-between items-center border-b border-blue-500 dark:border-blue-400 pb-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
          My Profile:
        </h2>
        <button
          className="btn btn-soft btn-primary text-lg px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md py-2"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Update"}
        </button>
      </div>

      {/* Conditionally shows the edit/update form */}
      {showForm && (
        <div className="mb-6">
          <MentorProfileEdit
            fetchMentorData={fetchMentorData}
            mentor={mentor}
            setMentor={setMentor}
            setShowForm={setShowForm}
            token={token}
            onProfileUpdate={onProfileUpdate}
          />
        </div>
      )}

      {/* Mentor Info Card */}
      <div className="bg-sky-50 dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
        {/* Team Members Names with & */}
        <div className="text-center">
          <h1
            className="text-gray-900 dark:text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center underline"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}
          >
            {mentor.firstName} & {mentor.lastName}
          </h1>
        </div>
        <div className="flex items-center justify-center">
          {/* Project Category */}
          <p className="font-bold text-xl text-gray-700 dark:text-gray-300 mr-2">
            Project Category:
          </p>
          <span className="text-blue-500 dark:text-blue-400 text-xl font-bold">
            {mentor.projectCategory}
          </span>
        </div>

        {/* Profile Photos - Two side by side */}
        <div className="flex justify-center items-center px-4 pt-6 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Team Member 1
            </p>
            <img
              src={
                imageError1 || !mentor.profilePhoto1
                  ? "/images/blank-profile-picture-973460_1280.png"
                  : mentor.profilePhoto1
              }
              alt={`${mentor.firstName} - Team Member 1`}
              className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-md"
              onError={handleImageError1}
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Team Member 2
            </p>
            <img
              src={
                imageError2 || !mentor.profilePhoto2
                  ? "/images/blank-profile-picture-973460_1280.png"
                  : mentor.profilePhoto2
              }
              alt={`${mentor.lastName} - Team Member 2`}
              className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-md"
              onError={handleImageError2}
            />
          </div>
        </div>

        {/* Interest List */}
        <div className="flex flex-col items-center text-center py-4">
          <p className="font-bold text-xl text-gray-700 dark:text-gray-300 mb-1">
            Interests:
          </p>
          <ul className="list-disc list-inside text-left text-gray-900 dark:text-white text-lg space-y-1">
            {mentor.interests && mentor.interests.length > 0 ? (
              mentor.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))
            ) : (
              <li>No interests listed</li>
            )}
          </ul>
        </div>

        {/* Mentor questionToAsk */}
        <div className="flex flex-col items-center text-center py-4">
          <p className="font-bold text-xl text-gray-700 dark:text-gray-300 mb-1">
            Question:
          </p>
          <span className="text-gray-900 dark:text-white text-xl italic">
            {mentor.questionToAsk || "No question set"}
          </span>
        </div>

        {/* Mentor's email */}
        <div className="bg-sky-100 dark:bg-gray-700 p-4 rounded-md text-center">
          <p className="italic text-gray-500 dark:text-gray-400 text-sm mb-1">
            Only visible to you
          </p>
          <div className="flex items-center justify-center">
            <p className="font-bold text-xl text-gray-700 dark:text-gray-300 mr-2">
              Email:
            </p>
            <span className="text-blue-500 dark:text-blue-400 text-xl font-bold">
              {mentor.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
