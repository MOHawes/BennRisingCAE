import React, { useState, useEffect } from "react";
import { API } from "../../../constants/endpoints";

const AdminManagement = ({ token }) => {
  const [admins, setAdmins] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for new admin
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API}/admin/list-admins`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch admins");

      const data = await response.json();
      setAdmins(data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      alert("Failed to load admin list");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [token]);

  // Create new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API}/admin/create-admin`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin");
      }

      alert("Admin created successfully!");
      setShowCreateForm(false);
      setNewAdmin({ firstName: "", lastName: "", email: "", password: "" });
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error("Error creating admin:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset admin password
  const handleResetPassword = async (adminId, adminName) => {
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    if (adminId === currentUserId) {
      alert(
        "You cannot reset your own password. Please ask another admin for help."
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to reset the password for ${adminName}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/admin/admin/reset-password/${adminId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      alert(data.message);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(error.message);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Account Management
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-[#1b0a5f] hover:bg-[#6c50e1] text-white px-4 py-2 rounded-md"
        >
          {showCreateForm ? "Cancel" : "Create New Admin"}
        </button>
      </div>

      {/* Create Admin Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Create New Admin Account
          </h3>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={newAdmin.firstName}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, firstName: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={newAdmin.lastName}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, lastName: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength="4"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 4 characters</p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#eab246] hover:bg-[#d4a03d] text-[#1b0a5f] font-bold px-6 py-2 rounded-md"
            >
              {isLoading ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>
      )}

      {/* Admin List */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {admins.map((admin) => {
              const currentUserId = JSON.parse(
                localStorage.getItem("user")
              )?.id;
              const isCurrentUser = admin.id === currentUserId;

              return (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {admin.firstName} {admin.lastName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-gray-500">
                          (You)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() =>
                        handleResetPassword(
                          admin.id,
                          `${admin.firstName} ${admin.lastName}`
                        )
                      }
                      disabled={isCurrentUser}
                      className={`px-3 py-1 rounded-md text-white ${
                        isCurrentUser
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {admins.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No admin accounts found
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Reset passwords are "0000" for mentors/fellows
          and "Admin0000" for admins. Users should change their password after
          logging in with the reset password.
        </p>
      </div>
    </div>
  );
};

export default AdminManagement;
