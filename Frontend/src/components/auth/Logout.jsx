import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      // Remove token from local storage
      localStorage.removeItem("token");
      // Remove user info from local storage
      localStorage.removeItem("user");
      props.setToken(null);

      // Alert user they have logged out successfully
      alert("You have been logged out successfully!");
    } else {
      console.warn("No token found in localStorage.");
    }

    // Redirect to homepage
    navigate("/");
  }, [props.setToken, navigate]);

  return (
    <h1 className="text-center text-xl text-gray-700 mt-10">Logging out...</h1>
  );
};

export default Logout;
