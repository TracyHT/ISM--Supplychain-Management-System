import express from "express";
import {
  createOrder,
  getOrdersByProductId,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
} from "../controllers/orders.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);

router.get("/product/:productId", verifyToken, getOrdersByProductId);

router.get("/:orderId", getOrderById);

router.patch("/:orderId/status", verifyToken, updateOrderStatus);

router.delete("/orders/:orderId", verifyToken, deleteOrder);

export default router;
