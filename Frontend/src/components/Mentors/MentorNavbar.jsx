import React, { useState, useEffect } from "react";

const MentorNavbar = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <>
      <div>
        <nav className="navbar bg-gray-100 p-4">
          <div className="flex justify-between items-center">
            <a href="/" className="me-auto font-primary font-bold">
              Home page
            </a>
            <button
              onClick={toggleNavbar}
              className="me-2 p-2 bg-gray-200 rounded"
            >
              ☰
            </button>
          </div>
          {!collapsed && (
            <div className="mt-4">
              <ul className="space-y-2">
                <li>
                  <a
                    href="/updateProfile"
                    className="block p-2 hover:bg-gray-200"
                  >
                    Update-Profile
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default MentorNavbar;
