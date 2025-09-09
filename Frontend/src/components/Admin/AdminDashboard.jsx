import React, { useState } from "react";
import CreateMentor from "./Create-Mentor";
import AdminMentorList from "./Mentor-List/AdminMentorList";
import MatchRequestsTable from "./Match-Requests/MatchRequestsTable";

const AdminDashboard = (props) => {
  // use state to refresh mentor list component when mentor is added from create-mentor form
  const [refreshMentors, setRefreshMentors] = useState(false);

  // Toggling the Create Mentor form
  const [showForm, setShowForm] = useState(false);
  
  // Toggle for showing different sections
  const [activeSection, setActiveSection] = useState("mentors"); // "mentors" or "matches"

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col mt-8 px-4 md:px-16 pb-8 bg-white dark:bg-gray-900 min-h-screen">
        {/* Important Dates Button
        <div className="mb-6">
          <a 
            href="/important-dates"
            className="bg-[#ff0000] hover:bg-[#f19494] text-white font-bold py-3 px-8 rounded-md text-lg uppercase shadow-md transition-colors"
          >
            Important Dates
          </a>
        </div> */}

        {/* Section Navigation */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveSection("mentors")}
            className={`px-6 py-3 rounded-md font-semibold transition-colors ${
              activeSection === "mentors" 
                ? "bg-[#1b0a5f] text-white" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Manage Mentors
          </button>
          <button
            onClick={() => setActiveSection("matches")}
            className={`px-6 py-3 rounded-md font-semibold transition-colors ${
              activeSection === "matches" 
                ? "bg-[#1b0a5f] text-white" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Track Match Requests
          </button>
        </div>

        {/* Mentors Section */}
        {activeSection === "mentors" && (
          <div className="w-full max-w-7xl">
            {/* Toggle button for showing/hiding the form */}
            <div className="text-center mb-4">
              <button
                onClick={handleToggleForm}
                className="btn bg-[#1b0a5f] text-white mb-4 hover:bg-[#6c50e1] rounded-md px-6 py-3 text-lg transition-colors"
              >
                {showForm ? "Hide Create Mentor Form" : "Create New Mentor"}
              </button>
            </div>

            {showForm && (
              <div className="mb-8">
                <CreateMentor
                  setRefreshMentors={setRefreshMentors}
                  token={props.token}
                />
              </div>
            )}

            <AdminMentorList
              refreshMentors={refreshMentors}
              setRefreshMentors={setRefreshMentors}
              token={props.token}
            />
          </div>
        )}

        {/* Match Requests Section */}
        {activeSection === "matches" && (
          <div className="w-full max-w-7xl">
            <MatchRequestsTable token={props.token} />
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;