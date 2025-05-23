import User from "../models/User.js";
import Inventory from "../models/Inventory.js";

/*CREATE*/
export const createInventoryItem = async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      price,
      quantity,
      reorderPoint,
      category,
    } = req.body;
    const user = await User.findById(userId);
    console.log("inside try");
    const newInventoryItem = new Inventory({
      userId,
      name,
      description,
      price,
      quantity,
      reorderPoint,
      category,
    });
    await newInventoryItem.save();
    console.log("Saved Inventory Item");

    res.status(201).json(newInventoryItem);
  } catch (err) {
    console.error(err.stack);
    res.status(409).json({ message: err.message });
  }
};

/*READ*/
export const getFeedItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";
    let sort = req.query.sort || "quantity";
    let category = req.query.category || "All";
    let name = req.query.name || "";

    // Fetch distinct themes from the database
    const categoryOptions = await Inventory.distinct("category");
    // If theme is "All", include all theme options, otherwise split the provided theme string
    category === "All"
      ? (category = [...categoryOptions])
      : (category = req.query.category.split(","));

    // Split and parse the sort parameter
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    // Construct the filter object for MongoDB query
    let filter = {
      category: { $in: category },
    };
    // Add name filter if name is provided
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Query items with search, theme filter, sorting, pagination
    const products = await Inventory.find(filter)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    // Count total matching documents for pagination
    const total = await Inventory.countDocuments(filter);

    // Prepare response object
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      category: categoryOptions,
      products,
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getItemDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const item = await Inventory.findOne({ _id: productId });
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getUserInventory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch distinct themes from the database
    const categoryOptions = await Inventory.distinct("category");

    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";
    let sort = req.query.sort || "quantity";
    let category = req.query.category || "All";
    let name = req.query.name || "";

    // If theme is "All", include all theme options, otherwise split the provided theme string
    category === "All"
      ? (category = [...categoryOptions])
      : (category = req.query.category.split(","));

    // Split and parse the sort parameter
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    // Construct the filter object for MongoDB query
    let filter = {
      category: { $in: category },
      userId: userId, // Filter products by userId
    };

    // Add location filter if location is provided
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Query products with search, theme filter, sorting, pagination
    const products = await Inventory.find(filter)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    // Count total matching documents for pagination
    const total = await Inventory.countDocuments(filter);

    // Prepare response object
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      category: categoryOptions,
      products,
    };

    // Send response
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/*DELETE*/
export const deleteItem = async (req, res) => {
  try {
    const { productId, userId } = req.params;
    // Find the product by ID
    const item = await Inventory.findById(productId);

    // Check if the product exists
    if (!item) {
      return res.status(404).json({ message: "Inventory Item not found" });
    }

    // Check if the user is the owner of the product
    if (item.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this product" });
    }

    // Delete the product
    await Inventory.findByIdAndDelete(productId);

    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { productId } = req.params; // Extract product ID from request parameters
    const updates = req.body; // Extract updated product details from request body

    // Find the product by ID
    const item = await Inventory.findById(productId);

    // Check if the product exists
    if (!item) {
      return res.status(404).json({ message: "product not found" });
    }

    // Check if the logged-in user is the owner of the product

    // Update product details with the provided updates
    Object.assign(item, updates);

    // Save the updated product
    await item.save();

    res.status(200).json({ message: "Product details updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "error here" });
  }
};
