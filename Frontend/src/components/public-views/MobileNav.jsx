import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { navMenu } from "../../constants/data";

const MobileNav = ({ token, userInfo }) => {
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };

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
    <div className="flex flex-col gap-4 items-center justify-center md:hidden  p-4  uppercase">
      <button onClick={handleNav}>
        {nav ? (
          <AiOutlineClose
            className="text-white absolute top-5.5 right-5.5 z-30"
            size={32}
          />
        ) : (
          <FaBars
            className="absolute top-5.5 right-5.5 z-30 text-white"
            size={32}
          />
        )}
      </button>
      <div
        className={
          nav
            ? "flex flex-col items-center justify-center fixed bg-[#1b0a5f] top-0 left-0 w-full h-full z-20"
            : "hidden"
        }
      >
        <h2 className="text-white text-4xl text-center py-12">
          Benn Rising Mentorship Program
        </h2>

        {/* Welcome message for mobile */}
        {token && userInfo && (
          <p className="text-[#eab246] text-xl font-medium normal-case mb-4">
            {getWelcomeMessage()}
          </p>
        )}

        <ul className="w-full flex flex-col items-center justify-center gap-4 text-white text-2xl font-semibold">
          {navMenu.map((menu) => (
            <a
              key={menu.name}
              className="py-8 w-full hover:opacity-30 text-center"
              href={menu.href}
            >
              <li>{menu.name}</li>
            </a>
          ))}

          {/* Add profile and auth links for mobile */}
          {token ? (
            <>
              <a
                className="py-8 w-full hover:opacity-30 text-center"
                href={getProfileLink()}
              >
                <li>My Profile</li>
              </a>
              <a
                className="py-8 w-full hover:opacity-30 text-center"
                href="/logout"
              >
                <li>Logout</li>
              </a>
            </>
          ) : (
            <>
              <a
                className="py-8 w-full hover:opacity-30 text-center"
                href="/signup"
              >
                <li>Sign Up</li>
              </a>
              <a
                className="py-8 w-full hover:opacity-30 text-center"
                href="/login"
              >
                <li>Login</li>
              </a>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileNav;
