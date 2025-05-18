import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  TextField,
  useTheme,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import { setProduct } from "../../state";
import BookedUserWidget from "./BookedUserWidget";
import placeholderImg from "../../assets/placeholderImg.png";

// Main ProductDetailWidget component
const ProductDetails = ({ productId, defaultStatus }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { token, user } = useSelector((state) => ({
    token: state.token,
    user: state.user,
  }));
  const { role, _id: loggedInUserId } = user || {};

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [productDetails, setProductDetails] = useState(null);

  const ProductDetailItem = ({ label, value, isNonMobileScreens }) => (
    <Box
      sx={{
        mb: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography color="text.secondary" variant="subtitle1" width="180px">
        {label}
      </Typography>
      <Typography
        color="text.primary"
        variant="h4"
        fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
        fontWeight="medium"
      >
        {value}
      </Typography>
    </Box>
  );

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
    imgUrl,
  } = productDetails;

  const isBooked = Boolean(bookings[loggedInUserId]);
  const orderCount = orders.length;

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
    { label: "Available Stock", value: quantity || "0" },
    { label: "Minimum Quantity", value: minQuantity },
    { label: "Reorder Point", value: reorderPoint },
    { label: "Maximum Quantity", value: maxQuantity },
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
        gap: "1rem",
        padding: "1.5rem",
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          flexShrink: 0,
          width: isNonMobileScreens ? "400px" : "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={imgUrl || placeholderImg}
          alt="Auth Illustration"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      </Box>

      {/* Product Details Section */}
      <WidgetWrapper
        sx={{
          maxWidth: isNonMobileScreens ? "450px" : "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          padding: "1.5rem",
        }}
      >
        {/* Category, Name, Description */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box
            sx={{
              backgroundColor: theme.palette.neutral.mediumMain,
              padding: "0.3rem 1rem",
              fontSize: isNonMobileScreens ? "0.8rem" : "0.65rem",
              borderRadius: "2rem",
              width: "fit-content",
            }}
          >
            {category}
          </Box>
          <Typography variant="h2" color="text.primary" fontWeight="medium">
            {name || "Product"}
          </Typography>
          <Typography variant="subtitle1" color="text.primary">
            {description}
          </Typography>
        </Box>

        {/* Price */}
        <Typography variant="h3" color="text.primary" fontWeight="medium">
          ${price}
        </Typography>

        {/* Product Details Grid */}
        <Grid container spacing={2}>
          {details.map(({ label, value }) => (
            <Grid item xs={12} md={6} key={label}>
              <ProductDetailItem
                label={label}
                value={value}
                isNonMobileScreens={isNonMobileScreens}
              />
            </Grid>
          ))}
        </Grid>

        {/* Employee Actions */}
        {role === "employee" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              mt: "1.5rem",
            }}
          >
            <TextField
              label="Quantity"
              type="number"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              inputProps={{ min: 1, max: quantity || Infinity }}
              sx={{
                width: "100px",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.5rem",
              }}
            />
            <Button
              onClick={handleOrder}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                padding: "0.5rem 2rem",
                borderRadius: "1.5rem",
              }}
              disabled={!token || !loggedInUserId}
            >
              Order Product
            </Button>
          </Box>
        )}
      </WidgetWrapper>

      {/* Supplier Section */}
      {role === "supplier" && (
        <Box>
          <Typography
            color="text.primary"
            variant="h5"
            ml="0.3rem"
            fontWeight="medium"
          >
            Orders for this Product
          </Typography>
          <Typography
            ml="0.5rem"
            mb="1rem"
            color="text.primary"
            variant="h2"
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

export default ProductDetails;
