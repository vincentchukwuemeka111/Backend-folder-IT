import mongoose from "mongoose";

const BalanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // each user has only one balance
    },
    accountName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true, // each account number must be unique
    },
    accountPassword: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default:0 ,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Balance", BalanceSchema);
