import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { navMenu } from "../../constants/data";

const MobileNav = ({ token, userInfo }) => {
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };

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

  const getProfileButtonText = () => {
    if (!userInfo) return "My Profile";
    if (userInfo.userType === "Admin") return "Admin Dashboard";
    return "My Profile";
  };

  const getWelcomeMessage = () => {
    if (!userInfo) return "";
    if (userInfo.userType === "Mentor") {
      return `Welcome, Team ${userInfo.lastName}!`;
    }
    return `Welcome, ${userInfo.firstName}!`;
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center md:hidden p-4 uppercase">
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
            ? "flex flex-col items-center fixed bg-[#1b0a5f] top-0 left-0 w-full h-full z-20 overflow-y-auto"
            : "hidden"
        }
      >
        <div className="w-full max-w-lg mx-auto py-8 px-4">
          <h2 className="text-white text-3xl text-center mb-6">
            Benn Rising Mentorship Program
          </h2>

          {token && userInfo && (
            <p className="text-[#eab246] text-lg font-medium normal-case mb-6 text-center">
              {getWelcomeMessage()}
            </p>
          )}

          <ul className="w-full flex flex-col items-center gap-2 text-white text-xl font-semibold">
            {navMenu.map((menu) => (
              <li key={menu.name} className="w-full">
                <a
                  className="block py-4 w-full hover:bg-white hover:bg-opacity-10 text-center transition-colors"
                  href={menu.href}
                  onClick={() => setNav(false)}
                >
                  {menu.name}
                </a>
              </li>
            ))}

            {/* Divider */}
            <li className="w-full my-2">
              <hr className="border-t border-white opacity-20" />
            </li>

            {token ? (
              <>
                <li className="w-full">
                  <a
                    className="block py-4 w-full hover:bg-white hover:bg-opacity-10 text-center transition-colors"
                    href={getProfileLink()}
                    onClick={() => setNav(false)}
                  >
                    {getProfileButtonText()}
                  </a>
                </li>
                <li className="w-full">
                  <a
                    className="block py-4 w-full hover:bg-white hover:bg-opacity-10 text-center transition-colors"
                    href="/logout"
                    onClick={() => setNav(false)}
                  >
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="w-full">
                  <a
                    className="block py-4 w-full bg-[#eab246] hover:bg-[#d4a03d] text-white text-center transition-colors rounded-md"
                    href="/signup"
                    onClick={() => setNav(false)}
                  >
                    Sign Up
                  </a>
                </li>
                <li className="w-full">
                  <a
                    className="block py-4 w-full bg-[#eab246] hover:bg-[#d4a03d] text-white text-center transition-colors rounded-md"
                    href="/login"
                    onClick={() => setNav(false)}
                  >
                    Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
