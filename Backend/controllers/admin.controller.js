// Add these routes to admin.controller.js

// PUT /admin/mentee/reset-password/:id
router.put(
  "/mentee/reset-password/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const menteeId = req.params.id;
      console.log("Resetting password for mentee ID: ", menteeId);

      // Reset password to "0000"
      const defaultPassword = "0000";
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

      // Update the mentee's password
      const updatedMentee = await Mentee.findByIdAndUpdate(
        menteeId,
        { password: hashedPassword },
        { new: true }
      );

      // Error if update was unsuccessful
      if (!updatedMentee) {
        return res
          .status(404)
          .json({ message: "Mentee not found or error resetting password" });
      }

      // Success response
      res.status(200).json({
        message: `Password reset successfully for ${updatedMentee.firstName} ${updatedMentee.lastName}. New password is: ${defaultPassword}`,
        menteeId: updatedMentee._id.toString(),
        newPassword: defaultPassword,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// PUT /admin/admin/reset-password/:id
router.put(
  "/admin/reset-password/:id",
  validateSession,
  validateAdmin,
  async (req, res) => {
    try {
      const adminId = req.params.id;
      const requestingAdminId = req.user._id.toString();

      // Prevent admins from resetting their own password
      if (adminId === requestingAdminId) {
        return res.status(400).json({
          message:
            "You cannot reset your own password. Please contact another admin.",
        });
      }

      console.log("Resetting password for admin ID: ", adminId);

      // Reset password to "Admin0000"
      const defaultPassword = "Admin0000";
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

      // Update the admin's password
      const updatedAdmin = await Admin.findByIdAndUpdate(
        adminId,
        { password: hashedPassword },
        { new: true }
      );

      // Error if update was unsuccessful
      if (!updatedAdmin) {
        return res
          .status(404)
          .json({ message: "Admin not found or error resetting password" });
      }

      // Success response
      res.status(200).json({
        message: `Password reset successfully for ${updatedAdmin.firstName} ${updatedAdmin.lastName}. New password is: ${defaultPassword}`,
        adminId: updatedAdmin._id.toString(),
        newPassword: defaultPassword,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /admin/list-admins - Get all admin accounts
router.get("/list-admins", validateSession, validateAdmin, async (req, res) => {
  try {
    const admins = await Admin.find({}, "firstName lastName email _id");

    res.status(200).json({
      message: "Admin list retrieved successfully",
      admins: admins.map((admin) => ({
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        userType: "Admin",
      })),
    });
  } catch (error) {
    console.error("Error fetching admin list:", error);
    res.status(500).json({ message: error.message });
  }
});
