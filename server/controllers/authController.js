const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================================================
// REGISTER
// ======================================================
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        message:
          "Name, email, password and company name are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({
      email,
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "A company with this email already exists",
      });
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      email,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create Admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      companyId: company._id,
    });

    // Response
    return res.status(201).json({
      message:
        "Company and Admin registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },

      company: {
        id: company._id,
        name: company.name,
        email: company.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// LOGIN
// ======================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // ==================================================
    // DEBUG
    // ==================================================
    console.log("");
    console.log("=================================");
    console.log("========== LOGIN DEBUG ==========");
    console.log("=================================");

    console.log("User ID:", user._id);
    console.log("User Name:", user.name);
    console.log("User Email:", user.email);
    console.log("User Role:", user.role);
    console.log("User CompanyId:", user.companyId);

    console.log("=================================");
    console.log("");

    // Check companyId
    if (!user.companyId) {
      return res.status(400).json({
        message:
          "User does not have a companyId",
      });
    }

    // ==================================================
    // CREATE JWT
    // ==================================================
    const token = jwt.sign(
      {
        id: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==================================================
    // LOGIN RESPONSE
    // ==================================================
    const loginResponse = {
      message: "Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    };

    console.log("========== RESPONSE USER ==========");
    console.log(loginResponse.user);
    console.log(
      "RESPONSE COMPANY ID:",
      loginResponse.user.companyId
    );
    console.log("===================================");

    return res.status(200).json(loginResponse);

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================
module.exports = {
  register,
  login,
};