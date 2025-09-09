import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import SignupButton from "../../custom/SignupButton";
import { API_LOGIN } from "../../../constants/endpoints";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // success or error
  const navigate = useNavigate();

  // Function to show message and auto hide
  const showNotification = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);

    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  function handleSubmit(e) {
    e.preventDefault();
    login();
  }

  async function login() {
    try {
      // Headers
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Request Body
      let body = {
        email: email,
        password: password,
      };

      // Request Options
      let requestOption = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      };

      // Send Request
      const response = await fetch(API_LOGIN, requestOption);

      // Response Object
      let data = await response.json();

      // Update Token from the App.jsx file
      console.log(data);

      if (data.token) {
        props.updateToken(data.token);

        // Store user info in localStorage for welcome message
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        //route to userType login
        if (data.user.userType === "Admin") {
          showNotification(
            `Login Successful! as ${data.user.userType}`,
            "success"
          );
          setTimeout(() => {
            navigate("/admin");
          }, 1500); // Navigate after 1.5 seconds
        } else if (data.user.userType === "Mentor") {
          showNotification(
            `Login Successful! as ${data.user.userType}`,
            "success"
          );
          setTimeout(() => {
            navigate("/mentor");
          }, 1500);
        } else if (data.user.userType === "Mentee") {
          showNotification(
            `Login Successful! as ${data.user.userType}`,
            "success"
          );
          setTimeout(() => {
            navigate("/mentee");
          }, 1500);
        }
      } else {
        showNotification(
          "Login Failed! Check your email and password.",
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      showNotification("Something went wrong. Please try again.", "error");
    }
  }

  return (
    <>
      {/* Notification Message */}
      {showMessage && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ${
            showMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`px-6 py-3 rounded-md shadow-lg text-white ${
              messageType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center p-4 h-[80vh]">
        <div className="bg-sky-100 w-full max-w-[34.375rem] max-h-fit rounded-sm shadow-2xl text-black">
          <div className="flex flex-col justify-center p-5 rounded-sm">
            <h2 className="p-4 text-4xl text-center text-black uppercase">
              login
            </h2>
            {/* Form Goes Here */}
            <form
              className="flex flex-col justify-center"
              onSubmit={handleSubmit}
            >
              {/* Form Group for Email */}
              <label className="pb-2 uppercase" htmlFor="email">
                Email:
              </label>
              {/* Add a value and assign it to email (read only), onChange function to update the state */}
              <input
                className="p-2 mb-4 bg-white border-2 border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="loginemail"
                name="email"
                placeholder="Enter Email"
                type="email"
              />
              {/* Form Group End Email */}
              {/* ----------------------------- */}
              {/* Form Group for Password */}
              <label className="pb-2 uppercase" htmlFor="Password">
                Password:
              </label>
              {/* Add a value and assign it to password (read only), onChange function to update the state */}
              <input
                className="p-2 mb-4 bg-white border-2 border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="loginpassword"
                name="password"
                placeholder="Enter Password"
                type="password"
              />
              {/* Form Group End Password */}
              {/* Button Here */}

              <button
                onClick={handleSubmit}
                className="py-2 mb-2 text-white uppercase rounded-sm bg-blue-950 hover:bg-blue-950/50 hover:border-2 hover:border-blue-950"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
