import React from "react";
import { useState, useEffect } from "react";
import { API_REGISTER } from "../../../constants/endpoints";

const SignUp = (props) => {
  // State variables for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [school, setSchool] = useState("");
  const [ageCheck, setAgeCheck] = useState(false);
  // const [project, setProject] = useState("");

  // Interest selection related states
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestError, setInterestError] = useState("");

  // Available interests from the mentee model
  const availableInterests = [
    "Music",
    "Technology",
    "Sports",
    "Outdoor activities",
    "Books and writing",
    "Art",
    "Exercising",
    "Food",
    "Gaming",
    "Pets and animals",
    "Gardening",
    "Cars",
    "Politics",
  ];

  // Handle when user clicks on an interest checkbox
  const handleInterestSelection = (interest) => {
    // Check if interest is already selected
    if (selectedInterests.includes(interest)) {
      // Remove from selected list if already checked
      const updatedInterests = selectedInterests.filter(
        (item) => item !== interest
      );
      setSelectedInterests(updatedInterests);
      setInterestError("");
      return;
    }

    // Don't allow more than 4 interests
    if (selectedInterests.length >= 4) {
      setInterestError("You can only select 4 interests");
      return;
    }

    // add selected interest to list
    setSelectedInterests([...selectedInterests, interest]);
    setInterestError("");
  };

  // Form submission handler
  function handleSubmit(e) {
    e.preventDefault();

    // ! select only 4 interests
    if (selectedInterests.length !== 4) {
      setInterestError("You need to select 4 interests");
      return;
    }

    registerMentee();
  }

  // Register new mentee
  const registerMentee = async () => {
    try {
      const requestBody = {
        firstName,
        lastName,
        email,
        password,
        userType: "Mentee",
        guardianEmail,
        school,
        ageCheck,
        interests: selectedInterests,
      };

      console.log("Signup request:", requestBody);

      const response = await fetch(API_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Signup Response:", data);

      // Handle response
      if (data.token) {
        props.updateToken(data.token);
        window.location.href = "/mentee";
        alert(`You were successfully registered! Welcome, ${firstName}!`);
      } else {
        alert(
          data.message ||
            "Registration failed. Please make sure required fields are filled out and try again."
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center p-4">
        <div className="bg-sky-100 w-full max-w-[34.375rem] p-8 rounded-sm flex flex-col justify-center items-center shadow-2xl text-black">
          {" "}
          <h2 className="text-center font-bold text-3xl">FELLOW SIGN UP</h2>
          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            {/* First Name */}
            <label className="pb-2 uppercase" htmlFor="firstName">
              First Name:
            </label>
            <input
              className="bg-white border-2 border-gray-300 rounded-md p-2 mb-4"
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            {/* Last Name */}
            <label className="pb-2 uppercase" htmlFor="lastName">
              Last Name:
            </label>
            <input
              className="bg-white border-2 border-gray-300 rounded-md p-2 mb-4"
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            {/* Email */}
            <label className="pb-2 uppercase" htmlFor="email">
              Your Email:
            </label>
            <input
              className="bg-white border-2 border-gray-300 rounded-md p-2 mb-4"
              type="email"
              name="email"
              id="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <label className="pb-2 uppercase" htmlFor="password">
              Password:
            </label>
            <input
              className="bg-white border-2 border-gray-300 rounded-md p-2 mb-4"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Guardian Email */}
            <label className="pb-2 uppercase" htmlFor="guardianEmail">
              Guardian Email:
            </label>
            <input
              className="bg-white border-2 border-gray-300 rounded-md p-2 mb-4"
              type="email"
              name="guardianEmail"
              id="guardianEmail"
              placeholder="Guardian Email"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
              required
            />

            {/* School Selection */}
            <label className="pb-2 uppercase" htmlFor="school">
              School:
            </label>
            <select
              className="bg-white border-2 border-gray-300 rounded-md p-2 mb-4"
              name="school"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            >
              <option value="">Please select your school</option>
              <option value="Grace Christian School">
                Grace Christian School
              </option>
              <option value="Mount Anthony Middle High School">
                Mount Anthony Middle High School
              </option>
              <option value="Mount Anthony Union High School">
                Mount Anthony Union High School
              </option>
            </select>

            {/* DaisyUI Collapsible for Interest Selection */}
            <div className="mb-4">
              <label className="pb-2 uppercase block">
                Select Interests (Choose exactly 4):
              </label>

              {/* Collapsible interests */}
              <div className="collapse collapse-arrow border border-base-300 bg-white rounded-md">
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-md font-medium">
                  {selectedInterests.length === 0
                    ? "Click to select your interests"
                    : `Selected: ${selectedInterests.length}/4 interests`}
                </div>
                <div className="collapse-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {availableInterests.map((interest) => (
                      <div key={interest} className="form-control">
                        <label className="cursor-pointer label py-1 justify-start gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm"
                            checked={selectedInterests.includes(interest)}
                            onChange={() => handleInterestSelection(interest)}
                          />
                          <span className="label-text text-xs">{interest}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display selected interests */}
              {selectedInterests.length > 0 && (
                <div className="mt-2 p-2 bg-blue-100 rounded-md">
                  <p className="font-semibold text-sm">
                    Your selected interests:
                  </p>
                  <ul className="list-disc pl-5">
                    {selectedInterests.map((interest) => (
                      <li key={interest} className="text-xs mt-1">
                        {interest}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Error message for interest selection */}
              {interestError && (
                <p className="text-red-500 text-xs mt-1">{interestError}</p>
              )}
            </div>

            {/* Age Check */}
            <div className="flex items-center mb-4">
              <input
                className="mr-2 h-4 w-4"
                type="checkbox"
                name="ageCheck"
                id="ageCheck"
                checked={ageCheck}
                onChange={(e) => setAgeCheck(e.target.checked)}
                required
              />
              <label htmlFor="ageCheck">
                I confirm that I am over 13 years old
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="bg-blue-950 rounded-sm text-white py-2 hover:bg-blue-950/50 hover:border-2 hover:border-blue-950"
              type="submit"
            >
              SIGN UP AS A FELLOW
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
