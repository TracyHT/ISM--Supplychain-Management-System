import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { Box, Typography, Button, Grid, Chip } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { setProduct } from "../../state";

// Label and value component for consistent formatting
const LabelValue = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
    }}
  >
    <Typography color="text.primary" variant="subtitle1" fontWeight="500">
      {label} :
    </Typography>
    <Typography
      color="text.primary"
      variant="body1"
      fontSize="1.2rem"
      fontWeight="bold"
    >
      {value}
    </Typography>
  </Box>
);

const ProductWidget = ({
  productId,
  productUserId,
  name,
  description,
  price,
  quantity,
  minQuantity,
  reorderPoint,
  maxQuantity,
  category,
  bookings,
  defaultStatus,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const bookingCount = Object.keys(bookings || {}).length;

  const isOwner = loggedInUserId === productUserId;
  const isSupplier = role === "supplier";
  const isEmployee = role === "employee";
  const isInventory = defaultStatus === "Inventory";

  const handleViewDetails = () => navigate(`/products/${productId}/product`);

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:6001/products/${productUserId}/${productId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      dispatch(setProduct({ product: result }));
      navigate("/delete");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <WidgetWrapper>
      <Box mb={1}>
        <Chip
          label={category}
          size="medium"
          sx={{
            bgcolor: "#023d4f",
            color: "text.primary",
            fontSize: "1rem",
            fontWeight: "semibold",
            height: "28px",
            "& .MuiChip-label": { px: 2 },
          }}
        />
      </Box>
      <Box my={3}>
        <Typography color="text.primary" variant="h2" fontWeight="bold">
          {name}
        </Typography>
        <Typography
          color="text.primary"
          variant="h5"
          sx={{ my: 1, opacity: 0.8 }}
        >
          {description}
        </Typography>
      </Box>

      {/* Product Information Section */}
      <Grid container spacing={2}>
        {/* Price */}
        <Grid item xs={12} sm={6}>
          <LabelValue label="Price" value={price} />
        </Grid>

        {/* Quantity */}
        <Grid item xs={12} sm={6}>
          <LabelValue label="Quantity" value={quantity} />
        </Grid>

        {/* Reorder Point - Only if available */}
        {reorderPoint != null && (
          <Grid item xs={12} sm={6}>
            <LabelValue label="Reorder Point" value={reorderPoint} />
          </Grid>
        )}
      </Grid>

      {/* Actions Section */}
      <Box display="flex" justifyContent="space-between" mt="1.5rem" gap={2}>
        {isSupplier && bookingCount > 0 && (
          <Box
            sx={{
              borderRadius: "1rem",
              bgcolor: "#834bff",
              padding: "0.5rem 1rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "0.1rem solid #1E1E1E",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography color="text.primary" variant="subtitle1">
              {bookingCount} Bookings
            </Typography>
          </Box>
        )}

        {isOwner && (
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
          >
            Delete Product
          </Button>
        )}
      </Box>

      {/* Details Button */}
      <Box mt={3}>
        <Button
          variant="contained"
          sx={{
            borderRadius: "6px",
            padding: "0.75rem",
            width: "100%",
            backgroundColor: isSupplier ? "#834bff" : undefined,
          }}
          onClick={handleViewDetails}
        >
          <Typography
            color="text.primary"
            fontSize={isNonMobileScreens ? "1rem" : "0.8rem"}
          >
            DETAILS
          </Typography>
        </Button>
      </Box>
    </WidgetWrapper>
  );
};

export default ProductWidget;
