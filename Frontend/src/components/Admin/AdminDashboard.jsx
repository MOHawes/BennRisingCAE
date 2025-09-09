import React, { useState } from "react";
import CreateMentor from "./Create-Mentor";
import AdminMentorList from "./Mentor-List/AdminMentorList";
import AdminFellowsList from "./Fellows-List/AdminFellowsList"; // Add this import

const AdminDashboard = (props) => {
  // use state to refresh mentor list component when mentor is added from create-mentor form
  const [refreshMentors, setRefreshMentors] = useState(false);

  // Toggling the Create Mentor form
  const [showForm, setShowForm] = useState(false);

  // State for switching between different admin views
  const [activeView, setActiveView] = useState("mentors"); // "mentors", "fellows", "create"

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setActiveView("create");
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "create":
        return (
          <CreateMentor
            setRefreshMentors={setRefreshMentors}
            token={props.token}
          />
        );
      case "fellows":
        return <AdminFellowsList token={props.token} />;
      case "mentors":
      default:
        return (
          <AdminMentorList
            refreshMentors={refreshMentors}
            setRefreshMentors={setRefreshMentors}
            token={props.token}
          />
        );
    }
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col mt-8 px-16 pb-8">
        {/* Navigation Tabs */}
        <div className="w-full max-w-6xl mb-6">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <button
              onClick={() => {
                setActiveView("mentors");
                setShowForm(false);
              }}
              className={`px-6 py-3 text-lg font-medium rounded-md transition-colors ${
                activeView === "mentors"
                  ? "bg-[#1b0a5f] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Team Coordinators ({refreshMentors ? "Refreshing..." : "View All"})
            </button>

            <button
              onClick={() => {
                setActiveView("fellows");
                setShowForm(false);
              }}
              className={`px-6 py-3 text-lg font-medium rounded-md transition-colors ${
                activeView === "fellows"
                  ? "bg-[#1b0a5f] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Team Fellows (View All)
            </button>

            <button
              onClick={handleToggleForm}
              className={`px-6 py-3 text-lg font-medium rounded-md transition-colors ${
                activeView === "create" || showForm
                  ? "bg-[#eab246] text-[#1b0a5f]"
                  : "bg-[#1b0a5f] text-white hover:bg-[#6c50e1]"
              }`}
            >
              {showForm ? "Hide Create Form" : "Create New Team"}
            </button>
          </div>

          {/* Active view indicator */}
          <div className="text-center text-gray-600 mb-4">
            <span className="text-sm">
              Currently viewing: {" "}
              <span className="font-semibold capitalize">
                {activeView === "mentors" ? "Team Coordinators" : 
                 activeView === "fellows" ? "Team Fellows" : 
                 "Create New Team"}
              </span>
            </span>
          </div>
        </div>

        {/* Render the active view */}
        <div className="w-full">
          {renderActiveView()}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;