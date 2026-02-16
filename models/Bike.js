import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      default: 1,
      required: true
    },

    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Bike", bikeSchema);
