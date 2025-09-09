import React, { useState, useEffect } from "react";
import { navMenu } from "../../constants/data";
import MobileNav from "./MobileNav";
import { useLocation } from "react-router-dom"; // Import to get current page

function Navigationbar(props) {
  const { token } = props;
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const location = useLocation(); // Get current location to check what page we're on

  // Get user info from localStorage when component mounts
  useEffect(() => {
    if (token) {
      // Try to get user info from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserType(user.userType || "");

        // Set name based on user type
        if (user.userType === "Mentor") {
          // For mentors, show Team Member 1 & Team Member 2
          setUserName(`${user.firstName} & ${user.lastName}`);
        } else {
          // For fellows and admins, show First Last
          setUserName(`${user.firstName} ${user.lastName}`);
        }
      }
    }
  }, [token]);

  // Get profile link based on user type
  const getProfileLink = () => {
    if (userType === "Mentor") return "/mentor";
    if (userType === "Mentee") return "/mentee";
    if (userType === "Admin") return "/admin";
    return "/";
  };

  // Function to check if a menu item is active
  const isActive = (href) => {
    // Check if the current path matches the menu item href
    return location.pathname === href;
  };

  // Function to check if profile/logout buttons should be active
  const isProfileActive = () => {
    // Check if current path matches any of the profile pages
    return (
      location.pathname === "/mentor" ||
      location.pathname === "/mentee" ||
      location.pathname === "/admin"
    );
  };

  const isAuthActive = () => {
    // Check if on signup or login page
    return location.pathname === "/signup" || location.pathname === "/login";
  };

  return (
    <>
      <div className="relative top-0 z-10 w-full bg-[#1b0a5f] border-b-4 border-[#eab246]">
        <div className="container p-4 mx-auto">
          <div className="hidden p-4 text-white uppercase rounded-sm md:block">
            <ul className="flex items-center justify-between">
              {navMenu.map((menu) => (
                <li key={menu.name}>
                  <a
                    className={`hover:text-[#eab246] hover:underline hover:underline-offset-4 pb-2 ${
                      isActive(menu.href) ? "border-b-2 border-white" : ""
                    }`}
                    href={menu.href}
                  >
                    {menu.name}
                  </a>
                </li>
              ))}
              <div className="ml-4 flex items-center space-x-4">
                {/* Welcome message when logged in */}
                {token && userName && (
                  <span className="text-[#eab246] text-sm normal-case">
                    Welcome, {userName}!
                  </span>
                )}

                {!token ? (
                  <>
                    <button
                      className={`bg-[#eab246] hover:bg-[#d4a03d] text-white uppercase px-6 py-2 rounded-md ${
                        location.pathname === "/signup"
                          ? "ring-2 ring-white"
                          : ""
                      }`}
                    >
                      <a href="/signup">Sign Up</a>
                    </button>
                    <button
                      className={`bg-[#eab246] hover:bg-[#d4a03d] text-white uppercase px-6 py-2 rounded-md ${
                        location.pathname === "/login"
                          ? "ring-2 ring-white"
                          : ""
                      }`}
                    >
                      <a href="/login">Login</a>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`bg-[#6c50e1] hover:bg-[#5a42c0] text-white uppercase px-6 py-2 rounded-md ${
                        isProfileActive() ? "ring-2 ring-white" : ""
                      }`}
                    >
                      <a href={getProfileLink()}>My Profile</a>
                    </button>
                    <button
                      className={`bg-[#eab246] hover:bg-[#d4a03d] text-white uppercase px-6 py-2 rounded-md ${
                        location.pathname === "/logout"
                          ? "ring-2 ring-white"
                          : ""
                      }`}
                    >
                      <a href="/logout">Logout</a>
                    </button>
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
        <MobileNav
          token={token}
          userInfo={
            userName
              ? {
                  firstName: userName.split(" ")[0],
                  lastName: userName.split(" ").slice(1).join(" "),
                  userType,
                }
              : null
          }
        />
      </div>
    </>
  );
}

export default Navigationbar;
