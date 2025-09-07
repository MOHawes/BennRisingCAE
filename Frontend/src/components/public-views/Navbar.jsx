import React, { useState, useEffect } from "react";
import { navMenu } from "../../constants/data";
import MobileNav from "./MobileNav";

function Navigationbar(props) {
  const { token } = props;
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");

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
          // For mentees and admins, show First Last
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
              <div className="ml-4 flex items-center space-x-4">
                {/* Welcome message when logged in */}
                {token && userName && (
                  <span className="text-[#eab246] text-sm normal-case">
                    Welcome, {userName}!
                  </span>
                )}

                {!token ? (
                  <>
                    <button className="bg-[#eab246] hover:bg-[#d4a03d] text-white uppercase px-6 py-2 rounded-md">
                      <a href="/signup">Sign Up</a>
                    </button>
                    <button className="bg-[#eab246] hover:bg-[#d4a03d] text-white uppercase px-6 py-2 rounded-md">
                      <a href="/login">Login</a>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-[#6c50e1] hover:bg-[#5a42c0] text-white uppercase px-6 py-2 rounded-md">
                      <a href={getProfileLink()}>My Profile</a>
                    </button>
                    <button className="bg-[#eab246] hover:bg-[#d4a03d] text-white uppercase px-6 py-2 rounded-md">
                      <a href="/logout">Logout</a>
                    </button>
                  </>
                )}
              </div>
            </ul>
          </div>
        </div>
        <MobileNav />
      </div>
    </>
  );
}

export default Navigationbar;
