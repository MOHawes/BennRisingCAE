import React, { useState, useEffect } from "react";
import { API } from "../../../constants/endpoints";

const AdminManagement = ({ token }) => {
  const [admins, setAdmins] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

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
      setIsLoadingAdmins(true);
      setFetchError(false);

      const response = await fetch(`${API}/admin/list-admins`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(
            "Admin list endpoint not found. This feature may not be implemented yet."
          );
          setFetchError(true);
          // Set current user as the only admin for now
          const currentUser = JSON.parse(localStorage.getItem("user"));
          if (currentUser) {
            setAdmins([
              {
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
              },
            ]);
          }
          return;
        }
        throw new Error("Failed to fetch admins");
      }

      const data = await response.json();
      setAdmins(data.admins || []);
      setFetchError(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setFetchError(true);
      // Set current user as the only admin for fallback
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        setAdmins([
          {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
          },
        ]);
      }
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdmins();
    }
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
        if (response.status === 404) {
          alert(
            "Admin creation endpoint not found. This feature may not be implemented yet."
          );
          return;
        }
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

  // Handle password change for current admin
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setPasswordMessage({ type: "", text: "" });

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 4 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password must be different from current password",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API}/admin/change-password`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Close form after 2 seconds
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordMessage({ type: "", text: "" });
      }, 2000);
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset admin password
  const handleResetPassword = async (adminId, adminName) => {
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    if (adminId === currentUserId) {
      // Show password change form instead
      setShowPasswordForm(true);
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
        if (response.status === 404) {
          alert(
            "Password reset endpoint not found. This feature may not be implemented yet."
          );
          return;
        }
        throw new Error(data.message || "Failed to reset password");
      }

      alert(data.message);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(error.message);
    }
  };

  // Show loading state while fetching admins
  if (isLoadingAdmins) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b0a5f]"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading admin accounts...
          </span>
        </div>
      </div>
    );
  }

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

      {/* Error message */}
      {fetchError && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Unable to fetch full admin list from server.
            Showing current admin account only. You can still create new admins
            and reset passwords.
          </p>
        </div>
      )}

      {/* Password Change Form Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Change Your Password
            </h3>

            {passwordMessage.text && (
              <div
                className={`mb-4 p-3 rounded-md text-sm ${
                  passwordMessage.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  minLength="4"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum 4 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#1b0a5f] hover:bg-[#6c50e1] text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordMessage({ type: "", text: "" });
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                  className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum 4 characters
              </p>
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
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
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
                      className={`px-3 py-1 rounded-md text-white ${
                        isCurrentUser
                          ? "bg-[#1b0a5f] hover:bg-[#6c50e1]"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                      title={
                        isCurrentUser
                          ? "Change your password"
                          : "Reset password to Admin0000"
                      }
                    >
                      {isCurrentUser ? "Change Password" : "Reset Password"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {admins.length === 0 && !fetchError && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No admin accounts found
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
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
