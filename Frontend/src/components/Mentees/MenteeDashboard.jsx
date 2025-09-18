// Mentee Dashboard
import React, { useState, useEffect } from "react";
import MentorProfile from "../Mentors/MentorProfile";
import {
  API_MENTEE_PROFILE_PREVIEW,
  API_VIEW_MENTORS,
} from "../../constants/endpoints";
import MentorDirectory from "../public-views/MentorDirectory";
import MenteeProfile from "./MenteeProfile";
import MentorPreview from "./MentorPreview";

const MenteeDashboard = (props) => {
  const [mentor, setMentor] = useState({});
  const [showMentorPreview, setShowMentorPreview] = useState(false);
  const [mentee, setMentee] = useState({});
  const toggleMentorPreview = () => {
    setShowMentorPreview(!showMentorPreview);
  };

  async function getMentee() {
    //Headers
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", props.token);
    //Request
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    //Send Request
    let response = await fetch(API_MENTEE_PROFILE_PREVIEW, requestOptions);
    let menteeData = await response.json();
    setMentee(menteeData.user);
  }

  async function getMentor() {
    //Headers
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", props.token);
    //Request Options
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    //Send Request
    let response = await fetch(API_VIEW_MENTORS, requestOptions);

    //Response Object
    let data = await response.json();
    console.log(data);
    setMentor(data);
  }

  useEffect(() => {
    getMentor();
    getMentee();
  }, []);

  // Function to handle mentor selection
  const handleSubmit = (mentor) => {
    // Perform any action with the selected mentor
    console.log("Selected Mentor:", mentor);
  };

  return (
    <>
      <div className="container min-h-screen h-full p-4 mx-auto bg-gray-50 dark:bg-gray-900">
        <div className="bg-[#1b0a5f] dark:bg-gray-800 text-white flex flex-col md:flex-row items-center justify-center md:justify-between p-4 rounded-md shadow-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center uppercase w-full">
            {`${mentee?.firstName}'s Dashboard` || "Loading..."}
          </h1>
        </div>

        {/* Important Dates Button */}
        <div className="flex justify-center mt-4 mb-4">
          <a
            href="/important-dates"
            className="bg-[#ff0000] hover:bg-[#f19494] dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md text-lg uppercase shadow-md transition-colors"
          >
            Important Dates
          </a>
        </div>

        {/* Two-column layout starts here */}
        <div className="flex flex-col md:flex-row gap-6 mt-6 px-4">
          {/* Left Column: Mentor Directory */}
          <div className="w-full md:w-1/2 relative">
            {/* Heading and MentorDirectory box */}
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6 border-b pb-2 pt-6 text-center">
              Browse Mentors
            </h2>
            <div className="bg-sky-50 dark:bg-gray-800 p-4 rounded-md shadow-lg">
              <MentorDirectory token={props.token} />
            </div>
          </div>

          {/* Right Column: Mentee Info + Matched Mentor Preview */}
          <div className="w-full md:w-1/2 space-y-4">
            <MenteeProfile token={props.token} />
            {/* Show or Hide Matched Mentor */}
            <div className="space-y-4 flex flex-col items-center pb-4">
              <button
                className="btn mt-2 btn-soft btn-primary text-base sm:text-xl px-4 sm:px-8 py-2 sm:py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md"
                onClick={toggleMentorPreview}
              >
                {showMentorPreview
                  ? "Hide Matched Mentor"
                  : "View Matched Mentor"}
              </button>

              {showMentorPreview && (
                <div className="p-4 mt-4 rounded-md w-full h-[60%] md:w-[90%] shadow-lg bg-sky-50 dark:bg-gray-800">
                  <MentorPreview token={props.token} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenteeDashboard;
