import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bikeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true
    },
    amountPaid: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["PAID", "FAILED"],
      default: "PAID"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
