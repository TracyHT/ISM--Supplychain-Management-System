import express from "express";
import {
  createInventoryItem,
  getFeedItems,
  getItemDetails,
  deleteItem,
  updateItem,
  getUserInventory,
} from "../controllers/inventory.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*READ*/
router.get("/", getFeedItems);
router.post("/", verifyToken, createInventoryItem); // Define the create route
// router.get("/:userId/inventory", getUserInventory);
router.get("/:productId/inventory", getItemDetails);

/*UPDATE*/
router.patch("/:productId/update", verifyToken, updateItem); // Define the update route

/* DELETE */
router.delete("/:userId/:productId/delete", verifyToken, deleteItem);

export default router;
