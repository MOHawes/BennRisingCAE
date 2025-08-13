import React, { useState } from "react";
import {
  API_MENTOR_PROFILE,
  API_GET_UPLOAD_URL,
} from "../../constants/endpoints";

const MentorProfileEdit = (props) => {
  const [updatedFirstName, setUpdatedFirstName] = useState("");
  const [updatedLastName, setUpdatedLastName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedBio, setUpdatedBio] = useState("");
  // Update Question
  const [updatedQuestionToAsk, setUpdatedQuestionToAsk] = useState("");
  // s3 image handling for two photos
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [isUploading1, setIsUploading1] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);
  const [uploadStatus1, setUploadStatus1] = useState("");
  const [uploadStatus2, setUploadStatus2] = useState("");
  const [profilePhotoUrl1, setProfilePhotoUrl1] = useState("");
  const [profilePhotoUrl2, setProfilePhotoUrl2] = useState("");
  // Interests section
  const [selectedInterests, setSelectedInterests] = useState(
    props.mentor.interests || []
  );
  const [interestError, setInterestError] = useState("");
  // interests for selection form
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

  // Handle image selection for photo 1
  const handleImageSelect1 = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage1(file);

      // image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview1(reader.result);
      };
      reader.readAsDataURL(file);

      // Reset uploadstatus message
      setUploadStatus1("");
    }
  };

  // Handle image selection for photo 2
  const handleImageSelect2 = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage2(file);

      // image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview2(reader.result);
      };
      reader.readAsDataURL(file);

      // Reset uploadstatus message
      setUploadStatus2("");
    }
  };

  // Upload image to S3 (generic function)
  const uploadImage = async (
    selectedImage,
    setIsUploading,
    setUploadStatus,
    setProfilePhotoUrl,
    photoNumber
  ) => {
    if (!selectedImage) {
      setUploadStatus(
        `Please select an image for team member ${photoNumber} first`
      );
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus("Getting upload URL...");

      // Get signed URL from backend
      const response = await fetch(API_GET_UPLOAD_URL, {
        headers: {
          Authorization: props.token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const uploadUrl = await response.json();
      setUploadStatus("Uploading to S3...");

      // Upload to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedImage,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to S3");
      }

      // Get URL back from s3 and split
      const imageUrl = uploadUrl.split("?")[0];
      setProfilePhotoUrl(imageUrl);
      setUploadStatus("Upload successful!");

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("Upload failed: " + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleInterestSelection = (interest) => {
    // Check if the interest has already been selected
    if (selectedInterests.includes(interest)) {
      const updatedInterests = selectedInterests.filter(
        (item) => item !== interest
      );
      setSelectedInterests(updatedInterests);
      setInterestError("");
      return;
    }

    // make sure 4 interest are selected
    if (selectedInterests.length >= 4) {
      setInterestError("You can only select 4 interests");
      return;
    }

    // Add new interest to new array that overwrites old (...)
    setSelectedInterests([...selectedInterests, interest]);
    setInterestError("");
  };

  // form submit
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
      myHeaders.append("Authorization", props.token);
      console.log(props.token);

      // req.body with only updated fields
      const body = {};

      if (updatedFirstName) body.firstName = updatedFirstName;
      if (updatedLastName) body.lastName = updatedLastName;
      if (updatedEmail) body.email = updatedEmail;
      if (updatedBio) body.bio = updatedBio;
      if (updatedQuestionToAsk) body.questionToAsk = updatedQuestionToAsk;
      if (profilePhotoUrl1) body.profilePhoto1 = profilePhotoUrl1;
      if (profilePhotoUrl2) body.profilePhoto2 = profilePhotoUrl2;

      console.log("Selected interests:", selectedInterests);
      // Only update if 4 interests selected
      if (selectedInterests.length === 4) {
        body.interests = selectedInterests;
      }

      // Only submit update form if at least one field has been updated
      if (Object.keys(body).length === 0) {
        alert("Please update at least one field");
        return;
      }

      // Set up the request
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: props.token,
        },
        body: JSON.stringify(body),
      };

      // Send request
      const response = await fetch(API_MENTOR_PROFILE, requestOptions);

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      const data = await response.json();

      // clears the form
      setUpdatedFirstName("");
      setUpdatedLastName("");
      setUpdatedEmail("");
      setUpdatedBio("");
      setUpdatedQuestionToAsk("");
      setSelectedImage1(null);
      setSelectedImage2(null);
      setImagePreview1(null);
      setImagePreview2(null);
      setProfilePhotoUrl1("");
      setProfilePhotoUrl2("");
      setSelectedInterests([]);

      // Close form and refresh with new data
      props.setShowForm(false);
      if (props.fetchMentorData) {
        props.fetchMentorData();
      }

      // props passing to set profile as complete
      if (props.onProfileUpdate) {
        const isComplete = true;
        props.onProfileUpdate(isComplete);
      }

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
            <label className="label-text font-bold text-lg text-center mb-2 mt-2">
              Update First Name Here:
            </label>
            <input
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
              value={updatedFirstName}
              onChange={(e) => setUpdatedFirstName(e.target.value)}
              id="firstNameUpdate"
              name="firstName"
              placeholder={props.mentor.firstName || "Type Here"}
              type="text"
            />

            <label className="label-text font-bold text-lg text-center mb-2 mt-2">
              Update Last Name Here:
            </label>
            <input
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
              value={updatedLastName}
              onChange={(e) => setUpdatedLastName(e.target.value)}
              id="lastNameUpdate"
              name="LastName"
              placeholder={props.mentor.lastName || "Type Here"}
              type="text"
            />

            <label className="label-text font-bold text-lg text-center mb-2 mt-2">
              Update Email Here:
            </label>
            <input
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              id="emailUpdate"
              name="email"
              placeholder={props.mentor.email || "Type Here"}
              type="text"
            />

            <label className="label-text font-bold text-lg text-center mb-2 mt-2">
              Update Bio Here:
            </label>
            <input
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
              value={updatedBio}
              onChange={(e) => setUpdatedBio(e.target.value)}
              id="bioUpdate"
              name="bio"
              placeholder={props.mentor.bio || "Type Here"}
              type="text"
            />

            <label className="label-text font-bold text-lg text-center mt-2 mb-2">
              Update Question To Ask Here:
            </label>
            <input
              value={updatedQuestionToAsk}
              onChange={(e) => setUpdatedQuestionToAsk(e.target.value)}
              id="questionToAskUpdate"
              name="questionToAsk"
              placeholder={props.mentor.questionToAsk || "Type Here"}
              type="text"
              className="input input-bordered bg-white text-black w-full max-w-xl mb-2 mt-2"
            />

            {/* collapsible interest section */}
            <div className="w-full max-w-xl mb-4 mt-4">
              <label className="label-text font-bold text-lg text-center mb-2 block">
                Update Interests (Choose exactly 4):
              </label>
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
              {/* Display selected interests outside of collapsible section so they are viewable when collapsed */}
              {selectedInterests.length > 0 && (
                <div className="mt-2 p-2 bg-blue-100 rounded-md">
                  <p className="font-semibold">Your selected interests:</p>
                  <ul className="list-disc pl-5">
                    {selectedInterests.map((interest) => (
                      <li key={interest}>{interest}</li>
                    ))}
                  </ul>
                </div>
              )}
              {interestError && (
                <p className="text-red-500 mt-1">{interestError}</p>
              )}
            </div>

            {/* Profile Photos Upload Section - Two Photos */}
            <div className="w-full max-w-xl">
              <label className="label-text font-bold text-lg text-center mb-4 mt-4 block">
                Upload Team Member Photos:
              </label>

              <div className="flex flex-col md:flex-row gap-6 justify-center">
                {/* Team Member 1 Photo */}
                <div className="flex flex-col items-center">
                  <p className="text-md font-semibold mb-2">Team Member 1</p>
                  {/* Show image preview (circle) */}
                  {imagePreview1 && (
                    <div className="mb-4">
                      <img
                        src={imagePreview1}
                        alt="Team Member 1 Preview"
                        className="w-32 h-32 object-cover rounded-full"
                      />
                    </div>
                  )}

                  {/* file selection */}
                  <input
                    className="file-input file-input-bordered w-full max-w-xs mb-4"
                    onChange={handleImageSelect1}
                    id="profilePhotoUpdate1"
                    name="profilePhoto1"
                    type="file"
                    accept="image/*"
                  />

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() =>
                      uploadImage(
                        selectedImage1,
                        setIsUploading1,
                        setUploadStatus1,
                        setProfilePhotoUrl1,
                        1
                      )
                    }
                    disabled={!selectedImage1 || isUploading1}
                    className="btn btn-primary mb-2"
                  >
                    {isUploading1 ? "Uploading..." : "Upload Photo 1"}
                  </button>

                  {/* Status message */}
                  {uploadStatus1 && (
                    <p
                      className={`text-sm ${
                        uploadStatus1.includes("failed")
                          ? "text-red-500"
                          : uploadStatus1.includes("successful")
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                    >
                      {uploadStatus1}
                    </p>
                  )}
                </div>

                {/* Team Member 2 Photo */}
                <div className="flex flex-col items-center">
                  <p className="text-md font-semibold mb-2">Team Member 2</p>
                  {/* Show image preview (circle) */}
                  {imagePreview2 && (
                    <div className="mb-4">
                      <img
                        src={imagePreview2}
                        alt="Team Member 2 Preview"
                        className="w-32 h-32 object-cover rounded-full"
                      />
                    </div>
                  )}

                  {/* file selection */}
                  <input
                    className="file-input file-input-bordered w-full max-w-xs mb-4"
                    onChange={handleImageSelect2}
                    id="profilePhotoUpdate2"
                    name="profilePhoto2"
                    type="file"
                    accept="image/*"
                  />

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() =>
                      uploadImage(
                        selectedImage2,
                        setIsUploading2,
                        setUploadStatus2,
                        setProfilePhotoUrl2,
                        2
                      )
                    }
                    disabled={!selectedImage2 || isUploading2}
                    className="btn btn-primary mb-2"
                  >
                    {isUploading2 ? "Uploading..." : "Upload Photo 2"}
                  </button>

                  {/* Status message */}
                  {uploadStatus2 && (
                    <p
                      className={`text-sm ${
                        uploadStatus2.includes("failed")
                          ? "text-red-500"
                          : uploadStatus2.includes("successful")
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                    >
                      {uploadStatus2}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <button
                type="button"
                className="btn btn-soft btn-primary text-lg mt-6"
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

export default MentorProfileEdit;
