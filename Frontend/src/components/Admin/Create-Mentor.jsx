import React, { useState } from "react";

export default function CreateMentor(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projectCategory, setProjectCategory] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Form submitted:", { firstName, lastName, email, password });
    createMentor();
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setProjectCategory("");
  }

  async function createMentor() {
    try {
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

      let response = await fetch(
        "http://localhost:4000/admin/mentor/create",
        requestOption
      );

      let data = await response.json();
      console.log(data);

      // Status error if creating mentor fails
      if (!response.ok) {
        alert("Mentor creation failed! ", data.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh list of mentors and alert that mentor creation successful
      props.setRefreshMentors(true);
      alert("Mentor created successfully!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#1b0a5f] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#eab246] mb-8 uppercase">
          Create Mentor Team
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white  p-8 space-y-4 rounded-md"
        >
          {/* Team Member 1 */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-[#1b0a5f]"
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
              className="w-full mt-1 p-2 border border-[#6c50e1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1]"
            />
          </div>
          {/* Team Member 2 */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[#1b0a5f]"
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
              className="w-full mt-1 p-2 border border-[#6c50e1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1]"
            />
          </div>
          {/* Team Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1b0a5f]"
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
              className="w-full mt-1 p-2 border border-[#6c50e1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1]"
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#1b0a5f]"
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
              className="w-full mt-1 p-2 border border-[#6c50e1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1]"
            />
          </div>
          {/* Project Category */}
          <div>
            <label
              htmlFor="projectCategory"
              className="block text-sm font-medium text-[#1b0a5f]"
            >
              Project Category:
            </label>
            <select
              id="projectCategory"
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-[#6c50e1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c50e1]"
            >
              <option value="">Select a category</option>
              <option value="video">Video</option>
              <option value="science">Science</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#eab246] text-[#1b0a5f] uppercase font-bold py-2 px-4 rounded-md hover:bg-[#6c50e1] hover:text-white transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
