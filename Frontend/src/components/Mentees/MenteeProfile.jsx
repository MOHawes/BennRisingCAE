// Mentee Profile
import React, { useEffect, useState } from "react";
import { API_MENTEE_PROFILE_PREVIEW } from "../../constants/endpoints.js";
import MenteeProfileEdit from "./MenteeProfileEdit.jsx";

const MenteeProfile = ({ token }) => {
  const [mentee, setMentee] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchMenteeData = async () => {
    try {
      const response = await fetch(API_MENTEE_PROFILE_PREVIEW, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch fellow data");

      const data = await response.json();
      console.log(data);

      // Adjust this depending on the shape of your backend response
      setMentee(data.user || data);
    } catch (error) {
      console.error("Error fetching fellow data:", error);
    }
  };

  useEffect(() => {
    if (token) fetchMenteeData();
  }, [token]);

  if (!mentee) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Title + update profile button button on same level */}
      <div className="flex justify-between items-center border-b border-blue-500 pb-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
          My Profile:
        </h2>
        <button
          className="btn btn-soft btn-primary text-lg px-6"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Update Profile"}
        </button>
      </div>
      
      {/* Conditionally shows the edit/update form */}
      {showForm && (
        <div className="mb-6">
          <MenteeProfileEdit
            mentee={mentee}
            setMentee={setMentee}
            setShowForm={setShowForm}
            token={token}
            fetchMenteeData={fetchMenteeData}
          />
        </div>
      )}

      {/* Mentee Info Card */}
      <div className="bg-sky-50 rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
        {/* Mentee's first and last name */}
        <div className="text-center">
          <h1
            className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center underline"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}
          >
            {mentee.firstName + " " + mentee.lastName}
          </h1>
        </div>
        
        {/* Interest List */}
        <div className="flex flex-col items-center text-center py-4">
          <p className="font-bold text-xl text-gray-700 mb-1">Interests:</p>
          <ul className="list-disc list-inside text-left text-gray-900 text-lg space-y-1">
            {mentee.interests && mentee.interests.length > 0 ? (
              mentee.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))
            ) : (
              <li>No interests listed</li>
            )}
          </ul>
        </div>
        
        {/* Mentee's email */}
        <div className="bg-sky-100 p-4 rounded-md text-center">
          <p className="italic text-gray-500 text-sm mb-1">
            Only visible to you
          </p>
          <div className="flex items-center justify-center">
            <p className="font-bold text-xl text-gray-700 mr-2">Email:</p>
            <span className="text-blue-500 text-xl font-bold">
              {mentee.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeProfile;