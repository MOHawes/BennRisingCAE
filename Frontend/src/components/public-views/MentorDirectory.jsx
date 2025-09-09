// Mentor Directory (carousel)
import React from "react";
import CardPreview from "./CardPreview";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import { useState, useEffect } from "react";

// Import Swiper styles
import "swiper/css";
import {
  API_VIEW_MENTORS,
  API_MENTEE_PROFILE_PREVIEW,
} from "../../constants/endpoints";

const MentorDirectory = (props) => {
  // State to hold mentor data
  const [mentorData, setMentorData] = useState([]);
  const [requestedMentorId, setRequestedMentorId] = useState(null); // Track which mentor was requested
  const [matchedMentor, setMatchedMentor] = useState(null); // Track the matched mentor object
  const [userType, setUserType] = useState(null); // Track user type

  // Get user type from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserType(user.userType);
    }
  }, [props.token]);

  // function for fetching mentor data
  async function fetchMentorData() {
    //headers
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    myHeaders.append("Authorization", props.token); // pass token from props
    // request options
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    // send request
    let response = await fetch(API_VIEW_MENTORS, requestOptions);
    // response object
    let data = await response.json();
    //set the state variable to the data
    console.log("Mentor data with team status:", data.mentors);

    setMentorData(data.mentors);
  }

  // Function to check if mentee has already requested a mentor
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

  // this will refresh mentor data when page regains focus
  // so if a team gets full in another tab, it will update here
  useEffect(() => {
    const handleFocus = () => {
      console.log("Page regained focus, refreshing mentor data...");
      fetchMentorData();
      if (userType === "Mentee" && mentorData.length > 0) {
        checkExistingRequest();
      }
    };

    window.addEventListener("focus", handleFocus);

    // cleanup function to remove event listener
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [userType, mentorData]);

  // Handle successful match request
  const handleMatchRequestSuccess = (mentorId) => {
    setRequestedMentorId(mentorId);
    // refresh mentor data to update team full status
    setTimeout(() => {
      fetchMentorData();
    }, 1000); // wait a second then refresh to show updated status
  };

  // If mentee has a matched team, show only that team's card
  if (userType === "Mentee" && matchedMentor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your Matched Team!</h2>
          <div className="flex justify-center">
            <CardPreview
              firstName={matchedMentor.firstName}
              lastName={matchedMentor.lastName}
              profilePhoto1={matchedMentor.profilePhoto1}
              profilePhoto2={matchedMentor.profilePhoto2}
              interests={matchedMentor.interests}
              projectCategory={matchedMentor.projectCategory}
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
      </div>
    );
  }

  // Regular carousel display for non-matched mentees or other user types
  return (
    <>
      {/* Swiper Carousel */}
      <Swiper
        direction="vertical"
        spaceBetween={20}
        slidesPerView={2}
        mousewheel={true}
        pagination={{
          clickable: true,
        }}
        className="h-[1150px] w-full"
      >
        {mentorData.map((mentor) => {
          // Check if this mentor already has a match
          // A mentor has a match if they have any approved mentees or isTeamFull is true
          const mentorHasMatch =
            mentor.isTeamFull ||
            (mentor.approvedMentees && mentor.approvedMentees.length > 0);

          return (
            <SwiperSlide
              key={mentor.id}
              className={`flex items-center justify-center h-[500px] ${
                // Only dim if user is mentee AND has active request to different mentor
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
                interests={mentor.interests}
                projectCategory={mentor.projectCategory}
                questionToAsk={mentor.questionToAsk}
                mentorId={mentor.id}
                token={props.token}
                isRequested={requestedMentorId === mentor.id}
                hasActiveRequest={!!requestedMentorId}
                onRequestSuccess={handleMatchRequestSuccess}
                mentorHasMatch={mentorHasMatch} // Pass if team is full
                isMentee={userType === "Mentee"}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default MentorDirectory;