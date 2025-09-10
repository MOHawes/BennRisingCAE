import React, { useState } from "react";
import CreateMentor from "./Create-Mentor";
import AdminMentorList from "./Mentor-List/AdminMentorList";
import AdminFellowsList from "./Fellows-List/AdminFellowsList";
import MatchRequestsTable from "./Match-Requests/MatchRequestsTable";

const AdminDashboard = (props) => {
  // use state to refresh mentor list component when mentor is added from create-mentor form
  const [refreshMentors, setRefreshMentors] = useState(false);

  // Toggling the Create Mentor form
  const [showForm, setShowForm] = useState(false);

  // State for switching between different admin views
  const [activeView, setActiveView] = useState("mentors"); // "mentors", "fellows", "requests", "create"

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setActiveView("create");
  };

  // Handle going back to mentor list from create form
  const handleBackToList = () => {
    setActiveView("mentors");
    setShowForm(false);
    setRefreshMentors(true); // Force refresh when returning to list
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "create":
        return (
          <CreateMentor
            setRefreshMentors={setRefreshMentors}
            token={props.token}
            onBackToList={handleBackToList}
          />
        );
      case "fellows":
        return <AdminFellowsList token={props.token} />;
      case "requests":
        return <MatchRequestsTable token={props.token} />;
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
          {/* Main tabs */}
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
              Team Coordinators ({refreshMentors ? "Refreshing..." : "View All"}
              )
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
              onClick={() => {
                setActiveView("requests");
                setShowForm(false);
              }}
              className={`px-6 py-3 text-lg font-medium rounded-md transition-colors ${
                activeView === "requests"
                  ? "bg-[#1b0a5f] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Track Match Requests
            </button>
          </div>

          {/* Create button centered below */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleToggleForm}
              className={`px-6 py-3 text-lg font-medium rounded-md transition-colors ${
                activeView === "create"
                  ? "bg-[#eab246] text-[#1b0a5f]"
                  : "bg-[#1b0a5f] text-white hover:bg-[#6c50e1]"
              }`}
            >
              {activeView === "create" ? "Hide Create Form" : "Create New Team"}
            </button>
          </div>

          {/* Active view indicator */}
          <div className="text-center text-gray-600 mb-4">
            <span className="text-sm">
              Currently viewing:{" "}
              <span className="font-semibold capitalize">
                {activeView === "mentors"
                  ? "Team Coordinators"
                  : activeView === "fellows"
                  ? "Team Fellows"
                  : activeView === "requests"
                  ? "Match Requests"
                  : "Create New Team"}
              </span>
            </span>
          </div>
        </div>

        {/* Render active view */}
        <div className="w-full">{renderActiveView()}</div>
      </div>
    </>
  );
};

export default AdminDashboard;
