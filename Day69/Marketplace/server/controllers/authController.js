const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

// @desc    Register new user (customer or vendor)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, storeName } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === "vendor" ? "vendor" : "customer",
  });

  // If registering as a vendor, create their Vendor profile too
  if (user.role === "vendor") {
    const vendor = await Vendor.create({
      user: user._id,
      storeName: storeName || `${name}'s Store`,
    });
    user.vendorProfile = vendor._id;
    await user.save();
  }

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id, user.role),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorProfile: user.vendorProfile,
    },
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

module.exports = { registerUser, loginUser, getMe };
