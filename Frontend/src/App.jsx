import "./App.css";
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MentorsPage from "./pages/MentorPage"; // Mentor import path
import MenteePage from "./pages/MenteePage"; // Added Mentee import
import Navbar from "./components/public-views/Navbar";
import Footer from "./components/public-views/Footer";
import Auth from "./components/auth/Auth";
import MainIndex from "./components/MainIndex";
import MentorDashboard from "./components/Mentors/MentorDashboard";
import MenteeDashboard from "./components/Mentees/MenteeDashboard";
import MentorProfile from "./components/Mentors/MentorProfile";
import MentorMatchList from "./components/Mentors/MentorMatchList";
import MentorPendingRequest from "./components/Mentors/MentorPendingRequest";
import MenteePreview from "./components/Mentors/MenteePreview";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminMentorList from "./components/Admin/Mentor-List/AdminMentorList";
import Login from "./components/auth/login-section/login";
import Logout from "./components/auth/Logout";
import ParentConsentForm from "./components/Consent/ParentConsentForm";
import ConsentSubmitted from "./components/Consent/ConsentSubmitted";
import GenericConsentPage from "./components/Consent/GenericConsentPage";

function App() {
  // State variable for token and initialize to the value of the token stored in local storage
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Update token function to update token state variable and store the token in the local storage
  function updateToken(newToken) {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      // Clear everything when logging out
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // useEffect hook that will run when the component mounts
  // useEffect should check if token is stored in local storage and update the token state variable if a token is stored
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <>
      <Navbar token={token} />
      <Routes>
        <Route path="/" element={<HomePage token={token} />} />
        <Route path="/mentors" element={<MentorsPage token={token} />} />
        <Route path="/mentees" element={<MenteePage token={token} />} />
        {/* Added route for mentees */}
        <Route
          path="/mentorMatchList"
          element={<MentorMatchList token={token} />}
        />
        <Route
          path="/updateProfile"
          element={<MentorProfile token={token} />}
        />
        <Route path="/mentor" element={<MentorDashboard token={token} />} />
        <Route path="/mentee" element={<MenteeDashboard token={token} />} />
        <Route path="/admin" element={<AdminDashboard token={token} />} />
        <Route path="/logout" element={<Logout setToken={updateToken} />} />
        <Route
          path="/adminMentorList"
          element={<AdminMentorList token={token} />}
        />
        <Route
          path="/mentorPendingRequest"
          element={<MentorPendingRequest token={token} />}
        />
        <Route
          path="/menteePreview"
          element={<MenteePreview token={token} />}
        />
        <Route path="/signup" element={<Auth updateToken={updateToken} />} />
        <Route
          path="/login"
          element={<Login token={token} updateToken={updateToken} />}
        />
        <Route
          path="/consent/:matchRequestId"
          element={<ParentConsentForm />}
        />
        <Route path="/consent-submitted" element={<ConsentSubmitted />} />
        <Route path="/consent-info" element={<GenericConsentPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
