import { Box, Button, Typography, useMediaQuery } from "@mui/material";
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
const ProductDetailWidget = ({
  productId,
  productUserId,
  name,
  description,
  price,
  quantity,
  minQuantity,
  reorderPoint,
  maxQuantity,
  status,
  category,
  bookings,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { token, user } = useSelector((state) => ({
    token: state.token,
    user: state.user,
  }));
  const { role, _id: loggedInUserId } = user;
  const isBooked = Boolean(bookings[loggedInUserId]);
  const bookingCount = Object.keys(bookings).length;
  const userIds = Object.keys(bookings);

  // Handle product booking/cancellation
  const handleBooking = async () => {
    try {
      const response = await fetch(
        `http://localhost:6001/products/${productId}/booking`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );

      if (response.status === 400) {
        const data = await response.json();
        alert(data.message);
        return;
      }

      const updatedProduct = await response.json();
      dispatch(setProduct({ product: updatedProduct }));
    } catch (error) {
      console.error("Error updating product booking:", error);
      alert("An error occurred while updating the booking.");
    }
  };

  // Navigate to payment page
  const handlePayment = () => navigate("/pay");

  // Product details to display
  const productDetails = [
    { label: "Description", value: description },
    { label: "Price", value: price },
    { label: "Quantity", value: quantity },
    ...(minQuantity != null
      ? [
          { label: "Minimum Quantity", value: minQuantity },
          { label: "Reorder Point", value: reorderPoint },
          { label: "Maximum Quantity", value: maxQuantity },
        ]
      : []),
    { label: "Category", value: category },
  ];

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
            {name}
          </Typography>
        </Box>

        {/* Product Details */}
        <Box>
          {productDetails.map(({ label, value }) => (
            <ProductDetailRow
              key={label}
              label={label}
              value={value}
              isNonMobileScreens={isNonMobileScreens}
            />
          ))}
        </Box>

        {/* Employee Actions */}
        {role === "employee" && status === "Marketplace" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              mt: "2rem",
            }}
          >
            <Button
              onClick={handleBooking}
              variant={isBooked ? "contained" : "outlined"}
              color={isBooked ? "error" : "primary"}
              sx={{
                fontWeight: "bold",
                padding: "0.8rem 2rem",
                borderRadius: "1.5rem",
              }}
            >
              {isBooked ? "Cancel Product" : "Order Product"}
            </Button>
            <Button
              onClick={handlePayment}
              variant="contained"
              color="success"
              sx={{
                fontWeight: "bold",
                padding: "0.8rem 2rem",
                borderRadius: "1.5rem",
              }}
            >
              Pay
            </Button>
          </Box>
        )}

        {/* Supplier Booking Info */}
        {role === "supplier" && status === "Marketplace" && (
          <Box
            sx={{
              borderRadius: "2rem",
              padding: "1rem",
              backgroundColor: "#2a2a2a",
              mt: "1.5rem",
            }}
          >
            <Typography color="white" variant="subtitle1" ml="0.3rem">
              Orders for this Product:
            </Typography>
            <Typography
              ml="0.5rem"
              color="white"
              variant="h6"
              fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
              fontWeight="bold"
            >
              {bookingCount}
            </Typography>
          </Box>
        )}
      </WidgetWrapper>

      {/* Booked Users Section (Supplier Only) */}
      {role === "supplier" && userIds.length > 0 && (
        <Box sx={{ width: isNonMobileScreens ? "400px" : "100%" }}>
          <Typography
            textAlign="center"
            fontSize={isNonMobileScreens ? "2rem" : "1.5rem"}
            color="#834bff"
            fontWeight="bold"
            mb="1rem"
          >
            Ordered this Product
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {userIds.map((userId) => (
              <BookedUserWidget key={userId} userId={userId} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailWidget;
