import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import User from "../models/User.js";

// [GET] /orders/:orderId - Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: err.message });
  }
};

// [POST] /orders - Create new order
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, pricePerUnit } = req.body;
    const employeeId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newOrder = new Order({
      productId,
      employeeId,
      quantity,
      pricePerUnit,
      supplierId: product.userId,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: err.message });
  }
};

// [GET] /orders/product/:productId - Get all orders of a product
export const getOrdersByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const orders = await Order.find({ productId })
      .populate("employeeId", "firstName lastName email phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  console.log("updateOrderStatus called");
  console.log("Request body:", req.body);
  console.log("Request params:", req.params);
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log(`Order fetched: ${JSON.stringify(order)}`);

    const product = await Product.findById(order.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(`Product fetched: ${JSON.stringify(product)}`);

    // Update order status
    order.status = status;
    await order.save();
    console.log(`Order status updated to: ${status}`);

    if (status === "confirmed") {
      const { quantity, pricePerUnit } = order;

      console.log(
        `Checking inventory for userId: ${order.employeeId}, product: ${product.name}`
      );

      // 🔄 Flat structure inventory update
      const existingItem = await Inventory.findOne({
        userId: order.employeeId,
        name: product.name,
      });

      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
        console.log(`Updated inventory item: ${product.name}, +${quantity}`);
      } else {
        const newInventoryItem = new Inventory({
          userId: order.employeeId,
          name: product.name,
          description: product.description,
          quantity,
          category: product.category,
          price: pricePerUnit,
          imgUrl: product.imgUrl,
          reorderPoint: 0,
        });
        await newInventoryItem.save();
        console.log(`Added new inventory item: ${product.name}`);
      }

      // 🔄 Reduce product quantity
      product.quantity -= quantity;
      await product.save();
      console.log(
        `Product stock updated: ${product.name}, new quantity: ${product.quantity}`
      );

      // 🔄 Update supplier balance
      const supplier = await User.findById(product.userId);
      const employee = await User.findById(product.employeeId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      supplier.balance += pricePerUnit * quantity;
      employee.balance -= pricePerUnit * quantity;
      await supplier.save();
      await employee.save();
      console.log(
        `Supplier balance updated: ${supplier.name}, new balance: ${supplier.balance}`
      );
      console.log(
        `Employee balance updated: ${employee.name}, new balance: ${employee.balance}`
      );
    }

    res.status(200).json({ message: `Order ${status}`, order });
  } catch (err) {
    console.error("Error during updateOrderStatus:", err);
    res.status(500).json({
      message: "Failed to update order",
      error: err.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: err.message });
  }
};
