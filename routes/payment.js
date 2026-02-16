import express from "express";
import Bank from "../models/bank.js";
import User from "../models/User.js";
import Bike from "../models/Bike.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/pay", async (req, res) => {
  try {
    const { userId, bikeId, accountNumber, accountPassword } = req.body;

    if (!userId || !bikeId || !accountNumber || !accountPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔐 ObjectId validation (CRITICAL)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (!mongoose.Types.ObjectId.isValid(bikeId)) {
      return res.status(400).json({ message: "Invalid bikeId" });
    }

    // Check user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check bike
    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    if (bike.stock <= 0) {
      return res.status(400).json({ message: "Bike out of stock" });
    }

    // Check bank account
    const bank = await Bank.findOne({ accountNumber, userId });
    if (!bank) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    if (bank.accountPassword !== accountPassword) {
      return res.status(401).json({ message: "Incorrect bank password" });
    }

    if (bank.amount < bike.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct money & reduce stock
    bank.amount -= bike.price;
    bike.stock -= 1;

    await bank.save();
    await bike.save();

    const order = new Order({
      userId,
      bikeId,
      amountPaid: bike.price
    });

    await order.save();

    res.status(200).json({
      message: "Payment successful",
      order,
      remainingBalance: bank.amount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
