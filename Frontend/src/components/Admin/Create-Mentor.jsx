import React, { useState } from "react";

export default function CreateMentor(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Form submitted:", { firstName, lastName, email, password });
    createMentor();
  }

  // Function to handle going back to mentor list
  const handleBackToList = () => {
    // This will trigger the parent component to show the mentor list
    if (props.onBackToList) {
      props.onBackToList();
    }
  };

  async function createMentor() {
    try {
      setIsCreating(true);
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", props.token);

      let body = JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userType: "Mentor",
        projectCategory: projectCategory,
      });

      let requestOption = {
        method: "POST",
        headers: headers,
        body: body,
      };

      // Using the deployed backend URL directly
      let response = await fetch(
        "https://bennrisingcae.onrender.com/admin/mentor/create",
        requestOption
      );

      let data = await response.json();
      console.log(data);

      // Status error if creating mentor fails
      if (!response.ok) {
        alert("Mentor creation failed! " + data.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Show success message
      setShowSuccessMessage(true);

      // Clear form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setProjectCategory("");

      // Refresh list of mentors
      props.setRefreshMentors(true);

      // Hide success message after 3 seconds and optionally go back to list
      setTimeout(() => {
        setShowSuccessMessage(false);
        // Optionally auto-navigate back to list after success
        // handleBackToList();
      }, 3000);
    } catch (error) {
      console.log(error);
      alert("Error creating mentor: " + error.message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Team created successfully!</span>
          </div>
        </div>
      )}

      <div className="bg-[#1b0a5f] dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#eab246] dark:text-yellow-400 uppercase">
            Create a new Team Coordinator account
          </h2>
          <button
            onClick={handleBackToList}
            className="text-white hover:text-[#eab246] dark:hover:text-yellow-400 transition-colors"
            title="Back to Team List"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-700 p-8 space-y-4 rounded-md"
        >
          {/* Team Member 1 */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-[#1b0a5f] dark:text-gray-200"
            >
              Team Member 1:
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First name"
              className="w-full mt-1 p-2 border border-[#6c50e1] dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1] dark:focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          {/* Team Member 2 */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[#1b0a5f] dark:text-gray-200"
            >
              Team Member 2:
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="First name"
              className="w-full mt-1 p-2 border border-[#6c50e1] dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1] dark:focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          {/* Team Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1b0a5f] dark:text-gray-200"
            >
              Team Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full mt-1 p-2 border border-[#6c50e1] dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1] dark:focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#1b0a5f] dark:text-gray-200"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full mt-1 p-2 border border-[#6c50e1] dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1] dark:focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          {/* Project Category - UPDATED */}
          <div>
            <label
              htmlFor="projectCategory"
              className="block text-sm font-medium text-[#1b0a5f] dark:text-gray-200"
            >
              Project Category:
            </label>
            <select
              id="projectCategory"
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-[#6c50e1] dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1] dark:focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            >
              <option value="">Select a category</option>
              <option value="What's in your food">What's in your food</option>
              <option value="Kids for science!">Kids for science!</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className={`w-full font-bold py-2 px-4 rounded-md transition duration-300 ${
              isCreating
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#eab246] text-[#1b0a5f] dark:bg-yellow-500 dark:text-gray-900 uppercase hover:bg-[#6c50e1] hover:text-white dark:hover:bg-blue-600"
            }`}
          >
            {isCreating ? "Creating..." : "Submit"}
          </button>

          {/* return to Team List Button */}
          <button
            type="button"
            onClick={handleBackToList}
            className="w-full bg-gray-600 dark:bg-gray-500 text-white uppercase font-bold py-2 px-4 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-300 mt-3"
          >
            Back to Team List
          </button>
        </form>
      </div>
    </div>
  );
}
