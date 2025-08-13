// Mentor Directory (carousel)
import React from "react";
import CardPreview from "./CardPreview";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import { useState, useEffect } from "react";

// Import Swiper styles
import "swiper/css";
import { API_VIEW_MENTORS } from "../../constants/endpoints";

const MentorDirectory = (props) => {
  // State to hold mentor data
  const [mentorData, setMentorData] = useState([]);

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
    console.log(data.mentors);

    setMentorData(data.mentors);
  }
  // useEffect to fetch data when component mounts
  useEffect(() => {
    fetchMentorData();
  }, []);

  useEffect(() => {
    console.log(
      "Mentor IDs:",
      mentorData.map((m) => m.id)
    );
  }, [mentorData]);

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
        {mentorData.map((mentor) => (
          <SwiperSlide
            key={mentor.id}
            className="flex items-center justify-center h-[500px]"
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
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default MentorDirectory;
