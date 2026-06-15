const User = require("../models/User");

/**
 * @desc    Get all users with search, filter, and pagination
 * @route   GET /api/users
 * @access  Admin only
 */
const getAllUsers = async (req, res, next) => {
  try {
    const {
      search = "",
      role = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["user", "admin"].includes(role)) {
      query.role = role;
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    // Compute stats
    const [adminCount, userCount] = await Promise.all([
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total: totalUsers,
          page: parseInt(page),
          pages: Math.ceil(totalUsers / parseInt(limit)),
          limit: parseInt(limit),
        },
        stats: {
          total: await User.countDocuments(),
          admins: adminCount,
          users: userCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user's role
 * @route   PUT /api/users/:id/role
 * @access  Admin only
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'.",
      });
    }

    // Prevent admin from demoting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to '${role}' successfully.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Admin only
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `User '${user.name}' has been deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single user by ID
 * @route   GET /api/users/:id
 * @access  Admin only
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser, getUserById };