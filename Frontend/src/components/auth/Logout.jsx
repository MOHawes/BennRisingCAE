import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = (props) => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      // Remove token from local storage
      localStorage.removeItem("token");
      // Remove user info too
      localStorage.removeItem("user");
      props.setToken(null);

      // Show success message
      setShowMessage(true);

      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      // Redirect to homepage after 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      console.warn("No token found in localStorage.");
      // Still redirect even if no token
      navigate("/");
    }
  }, [props.setToken, navigate]);

  return (
    <>
      {/* Success Message */}
      {showMessage && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${
            showMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="px-6 py-3 rounded-md shadow-lg text-white bg-green-600">
            You have been logged out successfully!
          </div>
        </div>
      )}

      <div className="flex items-center justify-center h-[80vh]">
        <h1 className="text-center text-xl text-gray-700">Logging out...</h1>
      </div>
    </>
  );
};

export default Logout;
