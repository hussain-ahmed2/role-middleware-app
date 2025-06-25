import mongoose from "mongoose";
import Cart from "./Cart.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Cart.deleteOne({ userId: doc._id });
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
