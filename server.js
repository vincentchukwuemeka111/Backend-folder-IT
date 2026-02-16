import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js"
import adminroute from "./routes/admin.js"
import createbank from "./routes/accBalance.js"
import paymentRoutes from "./routes/payment.js";
import postbikeRoutes from "./routes/postBike.js";


dotenv.config();

const app = express();

const db = process.env.MONGODB_URI

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Routes
app.use("/users", userRoutes);
app.use("/admin", adminroute);
app.use("/admin", createbank);
app.use("/payment", paymentRoutes);
app.use("/bikes", postbikeRoutes);

// mongodb connection
mongoose.connect(db)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB error ❌", err));

// server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
