import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();

// Admin Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new admin user
    const newAdmin = new Admin({
      name,
      email,
      password, // plaintext for now
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully", Admin: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Admin Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if user is actually an admin
    if (admin.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    // Check password (plaintext for now)
    if (admin.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Admin signed in successfully", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
