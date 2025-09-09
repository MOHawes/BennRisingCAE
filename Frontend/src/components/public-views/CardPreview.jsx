// Component for mentor card previews (for main page carousel)
import React, { useState } from "react";
import { API_REQUEST_MENTOR } from "../../constants/endpoints";

const CardPreview = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [mentorAnswer, setMentorAnswer] = useState("");
  const [programAnswer, setProgramAnswer] = useState("");

  // Character limits
  const MENTOR_CHAR_LIMIT = 150;
  const PROGRAM_CHAR_LIMIT = 150;

  // handle match request (connect button)
  const handleMatchRequest = async () => {
    if (!mentorAnswer.trim()) {
      alert("Please answer the team's question!");
      return;
    }

    if (!programAnswer.trim()) {
      alert("Please answer the program question!");
      return;
    }

    if (mentorAnswer.length > MENTOR_CHAR_LIMIT) {
      alert(`Team question answer must be ${MENTOR_CHAR_LIMIT} characters or less!`);
      return;
    }

    if (programAnswer.length > PROGRAM_CHAR_LIMIT) {
      alert(`Program question answer must be ${PROGRAM_CHAR_LIMIT} characters or less!`);
      return;
    }

    try {
      const response = await fetch(`${API_REQUEST_MENTOR}/${props.mentorId}`, {
        method: "POST",
        headers: {
          Authorization: `${props.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorAnswer: mentorAnswer,
          programAnswer: programAnswer,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.message}`);
      } else {
        alert(data.message);
        setShowModal(false);
        setMentorAnswer("");
        setProgramAnswer("");
        // Call the success callback if provided
        if (props.onRequestSuccess) {
          props.onRequestSuccess(props.mentorId);
        }
      }
    } catch (error) {
      console.error("Match request failed. ", error);
      alert("Oops! Something went wrong while sending the match request.");
    }
  };

  // Determine button text and style
  const getButtonContent = () => {
    // Only show buttons if user is a mentee
    if (!props.isMentee) {
      return {
        showButton: false,
      };
    }

    // Check if this mentor already has a match
    if (props.mentorHasMatch) {
      return {
        text: "Team Full",
        className:
          "px-6 py-2 rounded-md bg-gray-500 text-white cursor-not-allowed",
        disabled: true,
        showButton: true,
      };
    }

    if (props.isRequested) {
      return {
        text: "Requested",
        className:
          "px-6 py-2 rounded-md bg-green-600 text-white cursor-not-allowed",
        disabled: true,
        showButton: true,
      };
    } else if (props.hasActiveRequest) {
      return {
        text: "Request Team",
        className:
          "px-6 py-2 rounded-md bg-gray-400 text-white cursor-not-allowed",
        disabled: true,
        showButton: true,
      };
    } else {
      return {
        text: "Request Team",
        className:
          "px-6 py-2 rounded-md bg-[#1B0A5F] hover:bg-[#6C50E1] text-lg text-white",
        disabled: false,
        showButton: true,
      };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <>
      <div
        className={`h-full box-border max-w-sm mx-auto bg-[#C6CBFF] card w-96 shadow-sm border-6 border-[#9da2d6] flex flex-col jsutify-between ${
          props.mentorHasMatch && !props.showAsMatched ? "opacity-75" : ""
        }`}
      >
        <figure className="px-6 pt-6">
          {/* Profile Images - Two side by side */}
          <div className="flex gap-2 w-full">
            <img
              src={
                props.profilePhoto1
                  ? props.profilePhoto1
                  : "../../../assets/blank-profile-picture-973460_1280.png"
              }
              alt="Team Member 1"
              className="object-cover w-1/2 h-48 md:h-64 rounded-sm border-2 border-[#9da2d6] shadow-xl"
            />
            <img
              src={
                props.profilePhoto2
                  ? props.profilePhoto2
                  : "../../../assets/blank-profile-picture-973460_1280.png"
              }
              alt="Team Member 2"
              className="object-cover w-1/2 h-48 md:h-64 rounded-sm border-2 border-[#9da2d6] shadow-xl"
            />
          </div>
        </figure>
        {/* Mentor Info */}
        <div className="rounded-b-sm p-4 items-center text-center bg-[#C6CBFF]">
          {/* Team Names - Display both first names with & */}
          <h2 className="text-3xl font-bold text-black ">
            {props.firstName} & {props.lastName}
          </h2>
          {/* Show if team is full */}
          {props.mentorHasMatch && (
            <p className="text-sm text-gray-600 italic mt-1">
              This team is already matched
            </p>
          )}
          {/* Mentor Project */}
          <p className="font-bold text-lg text-gray-700 mb-1">
            Project Category:{" "}
            <span className="text-blue-500 text-sm">
              {props.projectCategory?.toUpperCase()}
            </span>
          </p>
          {/* Mentor interests */}
          <p className="font-bold text-xl text-gray-700 mb-1">
            Interests:{" "}
            <span className="text-gray-900 text-lg font-normal">
              {props.interests.join(", ")}
            </span>
          </p>
          {/* Mentor's Question */}
          <p className="font-bold text-xl text-gray-700">Question: </p>
          <p className="text-gray-900 text-lg italic">{props.questionToAsk}</p>

          {/* Connect button - only show if button should be visible (user is mentee) */}
          {buttonContent.showButton && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => !buttonContent.disabled && setShowModal(true)}
                className={buttonContent.className}
                disabled={buttonContent.disabled}
              >
                {buttonContent.text}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for answering questions */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Application Questions</h2>

            {/* Team's Question */}
            <div className="mb-6">
              <p className="mb-2 font-bold text-gray-800">The team asks:</p>
              <p className="mb-4 italic text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-blue-500">
                {props.questionToAsk}
              </p>

              <textarea
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                rows="3"
                placeholder="Type your answer here..."
                value={mentorAnswer}
                onChange={(e) => setMentorAnswer(e.target.value)}
                maxLength={MENTOR_CHAR_LIMIT}
              ></textarea>
              
              <div className="text-right text-sm text-gray-600">
                {mentorAnswer.length}/{MENTOR_CHAR_LIMIT} characters
              </div>
            </div>

            {/* Program Question */}
            <div className="mb-6">
              <p className="mb-2 font-bold text-gray-800">Program Question:</p>
              <p className="mb-4 italic text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-green-500">
                How do you want to grow through participating in the Bennington Rising program?
              </p>

              <textarea
                className="w-full p-3 border-2 border-gray-300 rounded-md mb-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                rows="3"
                placeholder="Type your answer here..."
                value={programAnswer}
                onChange={(e) => setProgramAnswer(e.target.value)}
                maxLength={PROGRAM_CHAR_LIMIT}
              ></textarea>
              
              <div className="text-right text-sm text-gray-600">
                {programAnswer.length}/{PROGRAM_CHAR_LIMIT} characters
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleMatchRequest}
                className="bg-[#1B0A5F] text-white px-6 py-3 rounded-md hover:bg-[#6C50E1] font-semibold transition-colors"
              >
                Send Request
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setMentorAnswer("");
                  setProgramAnswer("");
                }}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardPreview;