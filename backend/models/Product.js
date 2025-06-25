import mongoose from "mongoose";
import Cart from "./Cart.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Cart.updateMany({}, { $pull: { products: { productId: doc._id } } });
  }
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
