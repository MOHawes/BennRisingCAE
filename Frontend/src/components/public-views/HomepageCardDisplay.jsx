// Mentor Directory (carousel)
import React from "react";
import CardPreview from "./CardPreview";
import { interests } from "../../constants/data";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import { useState, useEffect } from "react";

// Import Swiper styles
import "swiper/css";
import { API_VIEW_MENTORS } from "../../constants/endpoints";

const HomepageCardDisplay = (props) => {
  // State to hold mentor data
  const [mentorData, setMentorData] = useState([]);
  const [filteredMentorData, setFilteredMentorData] = useState([]); // State for filtered mentors
  const [selectedInterest, setSelectedInterest] = useState(""); // State for selected interest

  // Function for fetching mentor data
  async function fetchMentorData() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", props.token); // Pass token from props

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

  // useEffect to fetch data when component mounts
  useEffect(() => {
    fetchMentorData();
  }, []);

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
        {filteredMentorData.map((mentor) => (
          <div
            key={mentor.id}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md"
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
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default HomepageCardDisplay;
