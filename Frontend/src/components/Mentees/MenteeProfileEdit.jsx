import React, { useState } from "react";
import { API_MENTEE_PROFILE } from "../../constants/endpoints";

const MenteeProfileEdit = ({ token, mentee, setMentee, setShowForm, fetchMenteeData })=> {
  // Form state variables
  const [updatedFirstName, setUpdatedFirstName] = useState("");
  const [updatedLastName, setUpdatedLastName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedGuardianEmail, setUpdatedGuardianEmail] = useState("");
  
  // Interest selection 
  const [selectedInterests, setSelectedInterests] = useState(mentee.interests || []);
  const [interestError, setInterestError] = useState("");

  // interests from the mentee model
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
    // Check if interest has already been selected
    if (selectedInterests.includes(interest)) {
      const updatedInterests = selectedInterests.filter(item => item !== interest);
      setSelectedInterests(updatedInterests);
      setInterestError("");
      return;
    }
    
    // Don't allow more than 4 interests
    if (selectedInterests.length >= 4) {
      setInterestError("You can only select 4 interests");
      return;
    }
    
    // Add new interest to new array that overwrites old
    setSelectedInterests([...selectedInterests, interest]);
    setInterestError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate interests 
    if (selectedInterests.length > 0 && selectedInterests.length !== 4) {
      setInterestError("You need to select exactly 4 interests");
      return;
    }
    
    try {
      console.log("Submit Clicked");
      // Headers
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      
      // Create request body with updated fields
      const body = {};
      
      if (updatedFirstName) body.firstName = updatedFirstName;
      if (updatedLastName) body.lastName = updatedLastName;
      if (updatedEmail) body.email = updatedEmail;
      if (updatedGuardianEmail) body.guardianEmail = updatedGuardianEmail;
      if (selectedInterests.length === 4) body.interests = selectedInterests;
      
      // Only update if at least one field has been changed
      if (Object.keys(body).length === 0) {
        alert("Please update at least one field");
        return;
      }
      
      // Set up request
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(body)
      };
      
      // Send update request
      const response = await fetch(API_MENTEE_PROFILE, requestOptions);
      
      if (!response.ok) {
        throw new Error("Profile update failed");
      }
      
      const data = await response.json();
      
      // Reset form
      setUpdatedFirstName("");
      setUpdatedLastName("");
      setUpdatedEmail("");
      setUpdatedGuardianEmail("");
      
      // Close update form and refresh profile with updated info
      setShowForm(false);
      fetchMenteeData(); 
      
      alert(data.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    }
  }

  return (
    <>
      <form className="w-full max-w-5xl bg-sky-50 p-6 rounded-xl mx-auto shadow-lg flex flex-col justify-center items-center">
        <fieldset className="fieldset w-full space-y-4">
          {/* Form to update Profile */}
          <div className="flex flex-col items-center w-full">
            <label className="label-text font-bold text-lg text-center mb-2 mt-2">Update First Name Here:</label>
            <input
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
              value={updatedFirstName}
              onChange={(e) => setUpdatedFirstName(e.target.value)}
              id="firstNameUpdate"
              name="firstName"
              placeholder={mentee.firstName || "Type Here"}
              type="text"
            />
            
            <label className="label-text font-bold text-lg text-center mb-2 mt-2">Update Last Name Here:</label>
            <input
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
              value={updatedLastName}
              onChange={(e) => setUpdatedLastName(e.target.value)}
              id="lastNameUpdate"
              name="lastName"
              placeholder={mentee.lastName || "Type Here"}
              type="text"
            />
            
            <label className="label-text font-bold text-lg text-center mb-2 mt-2">Update Email Here:</label>
            <input
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              id="emailUpdate"
              name="email"
              placeholder={mentee.email || "Type Here"}
              type="text"
            />
            
            <label className="label-text font-bold text-lg text-center mb-2 mt-2">Update Guardian Email Here:</label>
            <input
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
              value={updatedGuardianEmail}
              onChange={(e) => setUpdatedGuardianEmail(e.target.value)}
              id="guardianEmailUpdate"
              name="guardianEmail"
              placeholder={mentee.guardianEmail || "Type Here"}
              type="text"
            />
            
            {/* DaisyUI Collapsible for Interest Selection */}
            <div className="w-full max-w-xl mb-4 mt-4">
              <label className="label-text font-bold text-lg text-center mb-2 block">
                Update Interests (Choose exactly 4):
              </label>
              
              {/* Collapsible component */}
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
                        <label className="cursor-pointer label justify-start gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={selectedInterests.includes(interest)}
                            onChange={() => handleInterestSelection(interest)}
                          />
                          <span className="label-text">{interest}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Display selected interests */}
              {selectedInterests.length > 0 && (
                <div className="mt-2 p-2 bg-blue-100 rounded-md">
                  <p className="font-semibold">Your selected interests:</p>
                  <ul className="list-disc pl-5">
                    {selectedInterests.map(interest => (
                      <li key={interest}>{interest}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Error message for interest selection */}
              {interestError && (
                <p className="text-red-500 mt-1">{interestError}</p>
              )}
            </div>
            
            <div className="w-full flex justify-center">
              <button
                type="button"
                className="btn btn-soft btn-primary text-lg mt-4"
                onClick={handleSubmit}
              >
                Update Profile
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default MenteeProfileEdit;