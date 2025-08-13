import React, { useState, useEffect } from "react";
import { navMenu } from "../../constants/data";
import MobileNav from "./MobileNav";

function Navigationbar(props) {
  const { token } = props;
  const [userInfo, setUserInfo] = useState(null);

  // Get user info from localStorage
  useEffect(() => {
    if (token) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          setUserInfo(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem("user");
      }
    } else {
      setUserInfo(null);
    }
  }, [token]);

  // Determine profile link based on user type
  const getProfileLink = () => {
    if (!userInfo) return "/";
    switch (userInfo.userType) {
      case "Mentor":
        return "/mentor";
      case "Mentee":
        return "/mentee";
      case "Admin":
        return "/admin";
      default:
        return "/";
    }
  };

  // Get welcome message based on user type
  const getWelcomeMessage = () => {
    if (!userInfo) return "";
    if (userInfo.userType === "Mentor") {
      return `Welcome, Team ${userInfo.lastName}!`;
    }
    return `Welcome, ${userInfo.firstName}!`;
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
                    className="hover:text-[#eab246] hover:underline hover:underline-offset-4"
                    href={menu.href}
                  >
                    {menu.name}
                  </a>
                </li>
              ))}
              <div className="ml-4 flex items-center gap-4">
                {!token ? (
                  <>
                    <button className="bg-[#eab246] text-white uppercase px-6 py-2 rounded-md">
                      <a href="/signup">Sign Up</a>
                    </button>
                    <button className="bg-[#eab246] text-white uppercase px-6 py-2 rounded-md">
                      <a href="/login">Login</a>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Welcome message */}
                    {userInfo && (
                      <span className="text-[#eab246] font-medium normal-case">
                        {getWelcomeMessage()}
                      </span>
                    )}

                    {/* Profile link */}
                    <button className="bg-[#6c50e1] text-white uppercase px-6 py-2 rounded-md hover:bg-[#8b70f1]">
                      <a href={getProfileLink()}>My Profile</a>
                    </button>

                    {/* Logout button */}
                    <button className="bg-[#eab246] text-white uppercase px-6 py-2 rounded-md">
                      <a href="/logout">Logout</a>
                    </button>
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
        <MobileNav token={token} userInfo={userInfo} />
      </div>
    </>
  );
}

export default Navigationbar;
