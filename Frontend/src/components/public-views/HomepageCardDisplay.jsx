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
  const [matchedMentor, setMatchedMentor] = useState(null); // Track the matched mentor object
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

      // Check if mentee has any approved mentors (matched teams)
      if (
        data.user &&
        data.user.approvedMentors &&
        data.user.approvedMentors.length > 0
      ) {
        setHasParentalConsent(true);
        // Find the matched mentor from the mentor list
        const matchedMentorId = data.user.approvedMentors[0];
        const matchedMentorData = mentorData.find(mentor => mentor.id === matchedMentorId);
        if (matchedMentorData) {
          setMatchedMentor(matchedMentorData);
        }
      }
    } catch (error) {
      console.error("Error checking existing requests:", error);
    }
  }

  // useEffect to fetch data when component mounts
  useEffect(() => {
    fetchMentorData();
  }, [props.token]);

  // Check for matches after mentor data is loaded
  useEffect(() => {
    if (userType === "Mentee" && mentorData.length > 0) {
      checkExistingRequest();
    }
  }, [userType, mentorData]);

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

  // If mentee has a matched team, show only that team's card
  if (userType === "Mentee" && matchedMentor) {
    return (
      <>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Your Matched Team!</h2>
          <p className="text-white text-lg">Congratulations! You've been matched with this team.</p>
        </div>
        
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <CardPreview
              firstName={matchedMentor.firstName}
              lastName={matchedMentor.lastName}
              profilePhoto1={matchedMentor.profilePhoto1}
              profilePhoto2={matchedMentor.profilePhoto2}
              projectCategory={matchedMentor.projectCategory}
              interests={matchedMentor.interests}
              questionToAsk={matchedMentor.questionToAsk}
              mentorId={matchedMentor.id}
              token={props.token}
              isRequested={false}
              hasActiveRequest={false}
              onRequestSuccess={handleMatchRequestSuccess}
              mentorHasMatch={true}
              isMentee={true}
              isMatchedTeam={true}
              showAsMatched={true} // New prop to indicate this should show as matched
            />
          </div>
        </div>
      </>
    );
  }

  // Regular display for non-matched mentees or other user types
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
          // A mentor has a match if they have any approved mentees
          const mentorHasMatch =
            mentor.isTeamFull ||
            (mentor.approvedMentees && mentor.approvedMentees.length > 0);

          return (
            <div
              key={mentor.id}
              className={`flex items-center justify-center p-4 bg-white rounded-lg shadow-md ${
                // Only dim if mentee has active request to different mentor
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