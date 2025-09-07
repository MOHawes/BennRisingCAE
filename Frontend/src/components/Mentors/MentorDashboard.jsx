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
  const [showMenteePreview, setShowMenteePreview] = useState(false);
  const [mentorName, setMentorName] = useState("");
  const [mentor, setMentor] = useState({});
  const [profileComplete, setProfileComplete] = useState(false);

  const togglePreview = () => {
    setShowMenteePreview(!showMenteePreview);
  };

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

          // Check if all required fields are present to determine profile completeness
          const requiredFields = ["firstName", "lastName", "profilePhoto", "bio", "email", "questionToAsk"];
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
    console.log('Profile complete state:', profileComplete);
  }, [profileComplete]);

  return (
    <>
      {/* <MentorNavbar /> */}
      <div className="container h-full p-4 mx-auto">
  <div className="bg-[#1b0a5f] text-white flex flex-col items-center justify-center p-4 rounded-md">
    <h1 className="text-2xl font-bold text-center uppercase w-full">
      {mentor.firstName && mentor.lastName
        ? `${mentor.firstName}'s Dashboard`
        : "Loading..."}
    </h1>
  </div>
        {/* Notification Banner */}
        {!profileComplete && (
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow">
            <p>
              👋 Welcome! It looks like your profile is not fully complete.
              Please take a moment to finish setting it up so mentees can find
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
            {/* View Pending Requests */}
            <MentorPendingRequest token={props.token} />
            {/* Toggle Mentee Preview Button */}
            <button
              className="btn mt-2 btn-soft btn-primary text-xl px-8 py-4 pt-4"
              onClick={togglePreview}
            >
              {showMenteePreview
                ? "Hide Matched Fellow "
                : "View Matched Fellow"}
            </button>
            {showMenteePreview && (
              <div className="p-4 mt-4 rounded-md w-full md:w-[90%] shadow bg-sky-50">
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

