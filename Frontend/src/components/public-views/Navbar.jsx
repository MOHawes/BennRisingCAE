import React, { useState, useEffect } from "react";
import { navMenu } from "../../constants/data";
import MobileNav from "./MobileNav";
import { useLocation } from "react-router-dom";

function Navigationbar(props) {
  const { token } = props;
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserType(user.userType || "");

        if (user.userType === "Mentor") {
          setUserName(`${user.firstName} & ${user.lastName}`);
        } else {
          setUserName(`${user.firstName} ${user.lastName}`);
        }
      }
    }
  }, [token]);

  const getProfileLink = () => {
    if (userType === "Mentor") return "/mentor";
    if (userType === "Mentee") return "/mentee";
    if (userType === "Admin") return "/admin";
    return "/";
  };

  const getProfileButtonText = () => {
    if (userType === "Admin") return "Admin Dashboard";
    return "My Profile";
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  const isProfileActive = () => {
    return (
      location.pathname === "/mentor" ||
      location.pathname === "/mentee" ||
      location.pathname === "/admin"
    );
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
                      <a href={getProfileLink()}>{getProfileButtonText()}</a>
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
