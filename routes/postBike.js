import express from "express";
import Bike from "../models/Bike.js";

const router = express.Router();

// POST /bikes/create → create a new bike
router.post("/create", async (req, res) => {
  try {
    const { name, price, stock, image } = req.body;

    // Check required fields
    if (!name || !price || !stock || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new bike
    const newBike = new Bike({
      name,
      price,
      stock,
      image
    });

    await newBike.save();

    res.status(201).json({
      message: "Bike posted successfully",
      bike: newBike
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /bikes → fetch all bikes
router.get("/getallbikes", async (req, res) => {
  try {
    const bikes = await Bike.find(); // fetch all bikes from MongoDB
    res.status(200).json({ bikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
