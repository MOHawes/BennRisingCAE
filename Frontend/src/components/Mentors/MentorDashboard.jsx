import React, { useState, useEffect } from "react";
import MenteePreview from "./MenteePreview";
import MentorNavbar from "./MentorNavbar";
import MentorPendingRequest from "./MentorPendingRequest";
import {
  API_MENTOR_PROFILE_PREVIEW,
  API_VIEW_MENTOR_MATCH,
} from "../../constants/endpoints";
import MentorProfile from "./MentorProfile";

const MentorDashboard = (props) => {
  const [mentorName, setMentorName] = useState("");
  const [mentor, setMentor] = useState({});
  const [profileComplete, setProfileComplete] = useState(false);
  const [hasMatchedMentee, setHasMatchedMentee] = useState(false);

  const fetchMentorInfo = async () => {
    try {
      const res = await fetch(API_MENTOR_PROFILE_PREVIEW, {
        headers: {
          Authorization: `${props.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data && data.user) {
        setMentor(data.user);

        // Check if mentor has a matched mentee
        if (data.user.approvedMentees && data.user.approvedMentees.length > 0) {
          setHasMatchedMentee(true);
        } else {
          setHasMatchedMentee(false);
        }

        // Check if all required fields are present to determine profile completeness
        const requiredFields = [
          "firstName",
          "lastName",
          "profilePhoto",
          "bio",
          "email",
          "questionToAsk",
        ];
        const isComplete = requiredFields.every((field) => data.user[field]);
        setProfileComplete(isComplete); // Set profile completeness
      }
    } catch (error) {
      console.error("Error fetching mentor info:", error);
    }
  };

  useEffect(() => {
    if (props.token) {
      fetchMentorInfo();
    }
  }, [props.token]);

  useEffect(() => {
    // Log the profileComplete value when it changes
    console.log("Profile complete state:", profileComplete);
  }, [profileComplete]);

  // Function to refresh data when a match is accepted or rejected
  const handleMatchUpdate = () => {
    console.log("Match updated, refreshing mentor data...");
    fetchMentorInfo(); // This will refresh the mentor data including approvedMentees
  };

  return (
    <>
      {/* <MentorNavbar /> */}
      <div className="container h-full p-4 mx-auto">
        <div className="bg-[#1b0a5f] text-white flex flex-col items-center justify-center p-4 rounded-md">
          <h1 className="text-2xl font-bold text-center uppercase w-full">
            {mentor.firstName && mentor.lastName
              ? `${mentor.firstName} & ${mentor.lastName}'s Dashboard`
              : "Loading..."}
          </h1>
        </div>

        {/* Important Dates Button */}
        <div className="flex justify-center mt-4 mb-4">
          <a
            href="/important-dates"
            className="bg-[#ff0000] hover:bg-[#f19494] text-white font-bold py-3 px-8 rounded-md text-lg uppercase shadow-md transition-colors"
          >
            Important Dates
          </a>
        </div>

        {/* Password Reset Notification */}
        {mentor.firstName && (
          <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 rounded-md shadow">
            <p>
              💡 <strong>Tip:</strong> If your password was reset by an admin,
              please update it from your profile settings for security.
            </p>
          </div>
        )}

        {/* Notification Banner */}
        {!profileComplete && (
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow">
            <p>
              👋 Welcome! It looks like your profile is not fully complete.
              Please take a moment to finish setting it up so fellows can find
              you!
            </p>
          </div>
        )}
      </div>
      {/* TWO COLUMN LAYOUT */}
      <div className="container mx-auto p-4 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 space-y-4 flex flex-col items-center pt-6">

            {/* View Pending Requests - Pass the refresh callback */}
            <MentorPendingRequest
              token={props.token}
              onMatchUpdate={handleMatchUpdate}
            />

            {/* Show matched mentee automatically if there is one */}
            {hasMatchedMentee && (
              <div className="p-4 mt-4 rounded-md w-full md:w-[95%] shadow bg-sky-50">

                <MenteePreview token={props.token} />
              </div>
            )}
          </div>
          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/2 space-y-4">
            {/* Mentors Profile */}
            <MentorProfile
              token={props.token}
              // mentor={mentor}
              onProfileUpdate={setProfileComplete}
              // profileComplete={profileComplete}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorDashboard;
