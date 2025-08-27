// Mentor Directory (carousel)
import React from "react";
import CardPreview from "./CardPreview";
import { interests } from "../../constants/data";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import { useState, useEffect } from "react";

// Import Swiper styles
import "swiper/css";
import {
  API_VIEW_MENTORS,
  API_MENTEE_PROFILE_PREVIEW,
} from "../../constants/endpoints";

const HomepageCardDisplay = (props) => {
  // State to hold mentor data
  const [mentorData, setMentorData] = useState([]);
  const [filteredMentorData, setFilteredMentorData] = useState([]); // State for filtered mentors
  const [selectedInterest, setSelectedInterest] = useState(""); // State for selected interest
  const [requestedMentorId, setRequestedMentorId] = useState(null); // Track which mentor was requested
  const [hasParentalConsent, setHasParentalConsent] = useState(false); // Track if mentee has previous consent
  const [userType, setUserType] = useState(null); // Track user type

  // Get user type from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserType(user.userType);
    }
  }, [props.token]);

  // Function for fetching mentor data
  async function fetchMentorData() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (props.token) {
      myHeaders.append("Authorization", props.token); // Pass token from props
    }

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    let response = await fetch(API_VIEW_MENTORS, requestOptions);
    let data = await response.json();
    console.log(data.mentors);

    setMentorData(data.mentors);
    setFilteredMentorData(data.mentors); // Initialize filtered data
  }

  // Function to check if mentee has already requested a mentor and has consent
  async function checkExistingRequest() {
    if (!props.token || userType !== "Mentee") return;

    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", props.token);

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      let response = await fetch(API_MENTEE_PROFILE_PREVIEW, requestOptions);
      let data = await response.json();

      // Check if mentee has requested mentors
      if (
        data.user &&
        data.user.requestedMentors &&
        data.user.requestedMentors.length > 0
      ) {
        // Set the first requested mentor as the active request
        setRequestedMentorId(data.user.requestedMentors[0]);
      }

      // Check if mentee has any approved mentors (which means they had parental consent before)
      // This allows them to request new mentors without consent again
      if (
        data.user &&
        data.user.approvedMentors &&
        data.user.approvedMentors.length > 0
      ) {
        setHasParentalConsent(true);
      }
    } catch (error) {
      console.error("Error checking existing requests:", error);
    }
  }

  // useEffect to fetch data when component mounts
  useEffect(() => {
    fetchMentorData();
    if (userType === "Mentee") {
      checkExistingRequest();
    }
  }, [userType]);

  // Handle interest selection
  const handleInterestChange = (e) => {
    const interest = e.target.value;
    setSelectedInterest(interest);

    if (interest === "") {
      // If no interest is selected, show all mentors
      setFilteredMentorData(mentorData);
    } else {
      // Filter mentors by the selected interest
      const filtered = mentorData.filter((mentor) =>
        mentor.interests.includes(interest)
      );
      setFilteredMentorData(filtered);
    }
  };

  // Handle successful match request
  const handleMatchRequestSuccess = (mentorId) => {
    setRequestedMentorId(mentorId);
  };

  return (
    <>
      {/* Dropdown for filtering by interests */}
      <label className="uppercase">Sort by Interests</label>
      <select
        className="w-full border-4 border-[#1b0a5f] p-2 rounded-md mb-4"
        name="interests"
        id="interests"
        value={selectedInterest}
        onChange={handleInterestChange}
      >
        <option value="">Select an option</option>
        {interests.map((interest, index) => (
          <option key={index} value={interest} className="text-black">
            {interest}
          </option>
        ))}
      </select>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {filteredMentorData.map((mentor) => {
          // Check if this mentor already has a match
          const mentorHasMatch =
            mentor.approvedMentees && mentor.approvedMentees.length > 0;

          return (
            <div
              key={mentor.id}
              className={`flex items-center justify-center p-4 bg-white rounded-lg shadow-md ${
                requestedMentorId &&
                requestedMentorId !== mentor.id &&
                userType === "Mentee"
                  ? "opacity-50"
                  : ""
              }`}
            >
              <CardPreview
                firstName={mentor.firstName}
                lastName={mentor.lastName}
                profilePhoto1={mentor.profilePhoto1}
                profilePhoto2={mentor.profilePhoto2}
                projectCategory={mentor.projectCategory}
                interests={mentor.interests}
                questionToAsk={mentor.questionToAsk}
                mentorId={mentor.id}
                token={props.token}
                isRequested={requestedMentorId === mentor.id}
                hasActiveRequest={!!requestedMentorId}
                onRequestSuccess={handleMatchRequestSuccess}
                mentorHasMatch={mentorHasMatch}
                isMentee={userType === "Mentee"}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HomepageCardDisplay;
