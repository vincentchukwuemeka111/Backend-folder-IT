import express from "express";
import Balance from "../models/bank.js";
import User from "../models/User.js";

const router = express.Router();

// Create a bank account for a user
router.post("/createbank", async (req, res) => {
  try {
    const { userId, accountName, accountNumber, accountPassword, amount = 0 } = req.body;

    // Check required fields
    if (!userId || !accountName || !accountNumber || !accountPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has a bank account
    const existingAccount = await Balance.findOne({ userId });
    if (existingAccount) {
      return res.status(400).json({ message: "Bank account already exists for this user" });
    }

    // Check if account number is unique
    const accountExists = await Balance.findOne({ accountNumber });
    if (accountExists) {
      return res.status(400).json({ message: "Account number already taken" });
    }

    // Create new bank account
    const newBalance = new Balance({
      userId,
      accountName,
      accountNumber,
      accountPassword,
      amount,
    });

    await newBalance.save();

    res.status(201).json({ message: "Bank account created successfully", account: newBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});






// Add money to bank account
router.post("/add-money", async (req, res) => {
  try {
    const { accountNumber, accountPassword, amount } = req.body;

    // Validate input
    if (!accountNumber || !accountPassword || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    // Find bank account
    const bankAccount = await Balance.findOne({ accountNumber });

    if (!bankAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    // Check password (plaintext for now)
    if (bankAccount.accountPassword !== accountPassword) {
      return res.status(401).json({ message: "Incorrect account password" });
    }

    // Add money
    bankAccount.amount += Number(amount);
    await bankAccount.save();

    res.status(200).json({
      message: "Money added successfully",
      balance: bankAccount.amount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




// GET /balance/:userId → fetch user bank account
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find bank account
    const bank = await Balance.findOne({ userId });
    if (!bank) return res.status(404).json({ message: "Bank account not found" });

    res.status(200).json({
      message: "Bank account fetched successfully",
      account: {
        accountName: bank.accountName,
        accountNumber: bank.accountNumber,
        balance: bank.amount
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
