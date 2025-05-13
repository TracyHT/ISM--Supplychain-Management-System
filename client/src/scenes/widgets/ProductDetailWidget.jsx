import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import { setProduct } from "../../state";
import BookedUserWidget from "./BookedUserWidget";

// Reusable component for rendering product detail rows
const ProductDetailRow = ({ label, value, isNonMobileScreens }) => (
  <Box
    sx={{
      borderRadius: "2rem",
      padding: "1rem",
      backgroundColor: "#2a2a2a",
      mb: "1rem",
      display: "flex",
      alignItems: "center",
    }}
  >
    <Typography
      color="white"
      variant="subtitle1"
      width="180px"
      fontWeight="500"
    >
      {label}:
    </Typography>
    <Typography
      color="white"
      variant="h6"
      fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
      fontWeight="bold"
    >
      {value}
    </Typography>
  </Box>
);

// Main ProductDetailWidget component
const ProductDetailWidget = ({ productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { token, user } = useSelector((state) => ({
    token: state.token,
    user: state.user,
  }));
  const { role, _id: loggedInUserId } = user || {}; // Safeguard for undefined user

  // State to hold selected quantity and product data
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [productDetails, setProductDetails] = useState(null); // New state for fetched product

  // Fetch the product details when productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:6001/products/${productId}/product`
        );
        const data = await response.json();

        if (response.status === 200) {
          setProductDetails(data);
        } else {
          alert("Error fetching product details: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("An error occurred while fetching the product.");
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Return loading state if productDetails is null
  if (!productDetails) {
    return <Typography color="white">Loading product details...</Typography>;
  }

  const {
    name,
    description,
    price,
    quantity,
    minQuantity,
    reorderPoint,
    maxQuantity,
    status,
    category,
    bookings = {},
    orders = [],
  } = productDetails;

  const isBooked = Boolean(bookings[loggedInUserId]);
  const orderCount = orders.length;
  const orderIds = orders; // Array of order IDs (strings)

  // Product details to display

  // Handle order placement and booking (Employee)
  const handleOrder = async () => {
    // Validate selected quantity
    if (selectedQuantity < 1 || selectedQuantity > quantity) {
      alert("Please select a valid quantity between 1 and " + quantity);
      return;
    }

    try {
      // Step 1: Create the order
      const orderResponse = await fetch("http://localhost:6001/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: selectedQuantity,
          pricePerUnit: price,
        }),
      });

      if (orderResponse.status !== 201) {
        const errorData = await orderResponse.json();
        alert(errorData.message);
        return;
      }

      const orderData = await orderResponse.json();

      // Step 2: Book the product
      const bookResponse = await fetch(
        `http://localhost:6001/products/${productId}/booking`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            orderId: orderData.order._id, // Pass the newly created order ID
          }),
        }
      );

      if (bookResponse.status !== 200) {
        const errorData = await bookResponse.json();
        alert("Order placed, but failed to book product: " + errorData.message);
        return;
      }

      const updatedProduct = await bookResponse.json();

      console.log("Product booked successfully:", updatedProduct);

      // Step 3: Update Redux store with the updated product
      setProductDetails(updatedProduct);
      dispatch(setProduct({ product: updatedProduct }));

      alert("Order placed and product booked successfully!");
    } catch (error) {
      console.error("Error during order and booking process:", error);
      alert("An error occurred while processing your request.");
    }
  };

  const details = [
    { label: "Description", value: description || "N/A" },
    { label: "Price", value: price || "N/A" },
    { label: "Quantity", value: quantity || "0" },
    ...(minQuantity != null
      ? [
          { label: "Minimum Quantity", value: minQuantity },
          { label: "Reorder Point", value: reorderPoint },
          { label: "Maximum Quantity", value: maxQuantity },
        ]
      : []),
    { label: "Category", value: category || "N/A" },
  ];

  // Return loading state if user is undefined
  if (!user) {
    return <Typography color="white">Loading user data...</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: isNonMobileScreens ? "row" : "column",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      {/* Product Details Section */}
      <WidgetWrapper
        sx={{
          width: isNonMobileScreens ? "800px" : "100%",
          p: "2rem",
          backgroundColor: "#1a1a1a",
          borderRadius: "1.5rem",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Product Name */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: "2rem" }}>
          <Typography
            fontSize={isNonMobileScreens ? "3rem" : "2rem"}
            color={role === "employee" ? "primary" : "#834bff"}
            fontWeight="bold"
            textAlign="center"
          >
            {name || "Product"}
          </Typography>
        </Box>

        {/* Product Details */}
        <Box>
          {details.map(({ label, value }) => (
            <ProductDetailRow
              key={label}
              label={label}
              value={value}
              isNonMobileScreens={isNonMobileScreens}
            />
          ))}
        </Box>

        {/* Employee Actions */}
        {role === "employee" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              mt: "2rem",
            }}
          >
            <TextField
              label="Quantity"
              type="number"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              inputProps={{
                min: 1,
                max: quantity || Infinity,
              }}
              sx={{
                width: "100px",
                backgroundColor: "#2a2a2a",
                borderRadius: "0.5rem",
                padding: "0.5rem",
              }}
            />
            <Button
              onClick={handleOrder}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                padding: "0.8rem 2rem",
                borderRadius: "1.5rem",
              }}
              disabled={!token || !loggedInUserId}
            >
              Order Product
            </Button>
          </Box>
        )}
      </WidgetWrapper>

      {/* Supplier Order Info */}
      {role === "supplier" && (
        <Box
          sx={{
            mt: "1.5rem",
          }}
        >
          <Typography color="white" variant="subtitle1" ml="0.3rem">
            Orders for this Product:
          </Typography>
          <Typography
            ml="0.5rem"
            mb="1rem"
            color="white"
            variant="h6"
            fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
            fontWeight="bold"
          >
            {orderCount}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((orderId) => (
              <BookedUserWidget key={orderId} orderId={orderId} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailWidget;
