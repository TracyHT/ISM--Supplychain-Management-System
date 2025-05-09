import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    max: 100,
  },
  description: {
    type: String,
    max: 500,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reorderPoint: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
  },
});

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;
