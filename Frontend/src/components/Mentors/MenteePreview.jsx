// Mentor Dashboard Page - Shows matched mentee
import React, { useEffect, useState } from "react";
import { API_MENTOR_PROFILE_PREVIEW } from "../../constants/endpoints";

const MenteePreview = ({ token }) => {
  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        // Get mentor profile which includes approvedMentees
        const response = await fetch(API_MENTOR_PROFILE_PREVIEW, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch mentor data");

        const data = await response.json();
        console.log("Mentor profile data:", data);

        // Check if mentor has approved mentee details
        if (data.user && data.user.approvedMenteeDetails) {
          setMentee(data.user.approvedMenteeDetails);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        setLoading(false);
      }
    };

    if (token) fetchMenteeData();
  }, [token]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!mentee) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl text-center font-bold text-blue-600 mb-6 border-b pb-2">
          No Matched Mentee Yet
        </h2>
        <p className="text-center text-gray-500">
          Once you accept a mentee request, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl text-center font-bold text-blue-600 mb-6 border-b pb-2">
        Matched Mentee Profile:
      </h2>

      {/* Mentee Info Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 pt-6">
        {/* Name */}
        <div className="text-center">
          <h1
            className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold underline"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}
          >
            {mentee.firstName + " " + mentee.lastName}
          </h1>
        </div>

        {/* School */}
        <div className="flex items-center justify-center pt-4">
          <p className="font-bold text-xl text-gray-700 mr-2">School:</p>
          <span className="text-blue-500 text-xl font-bold">
            {mentee.school}
          </span>
        </div>

        {/* Interests */}
        <div className="flex flex-col items-center text-center py-4">
          <p className="font-bold text-xl text-gray-700 mb-1">Interests:</p>
          <ul className="list-disc list-inside text-left text-gray-900 text-lg space-y-1">
            {mentee.interests &&
              mentee.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
          </ul>
        </div>

        {/* Answer to Question */}
        <div className="flex flex-col items-center text-center py-4 bg-blue-50 rounded-md p-4">
          <p className="font-bold text-xl text-gray-700 mb-1">Their Answer:</p>
          <p className="text-gray-900 text-lg italic">{mentee.answer}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-100 p-4 rounded-md text-center">
          <p className="font-bold text-xl text-gray-700 mb-2">Contact Info:</p>
          <p className="text-gray-900">Email: {mentee.email}</p>
        </div>
      </div>
    </div>
  );
};

export default MenteePreview;
