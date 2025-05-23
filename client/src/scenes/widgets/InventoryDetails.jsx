import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  TextField,
  useTheme,
  Grid,
  Tooltip,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import placeholderImg from "../../assets/placeholderImg.png";

const InventoryDetails = ({ productId }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { token, user } = useSelector((state) => ({
    token: state.token,
    user: state.user,
  }));
  const { role, _id: loggedInUserId } = user || {};

  const [isEditing, setIsEditing] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:6001/inventory/${productId}/inventory`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          setProductDetails(data);
          setFormState(data);
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
  }, [productId, token]);

  const handleChange = (field, value) => {
    if (field === "sold") {
      const newSold = Number(value) || 0;
      const originalSold = Number(productDetails.sold) || 0;
      const originalQuantity = Number(productDetails.quantity) || 0;

      // Calculate difference in sold amount
      const soldDiff = newSold - originalSold;

      // Calculate new quantity based on original quantity
      let newQuantity = originalQuantity - (newSold - originalSold);
      if (newQuantity < 0) {
        // Prevent negative quantity
        newQuantity = 0;
        // Adjust newSold to max possible value
        const maxSold = originalSold + originalQuantity;
        setFormState((prev) => ({
          ...prev,
          sold: maxSold,
          quantity: 0,
        }));
        alert("Sold amount cannot exceed available stock.");
        return;
      }

      setFormState((prev) => ({
        ...prev,
        sold: newSold,
        quantity: newQuantity,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:6001/inventory/${productId}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formState),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        alert("Product updated successfully");
        setIsEditing(false);
        setProductDetails(formState);
      } else {
        alert("Error updating product: " + data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update product.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormState(productDetails);
  };

  if (!productDetails || !user) {
    return <Typography color="white">Loading...</Typography>;
  }

  const {
    name,
    description,
    price,
    quantity,
    minQuantity,
    reorderPoint,
    sellingPrice = 0,
    category,
    imgUrl,
  } = formState;

  const detailFields = [
    { label: "Price", key: "price", editable: true },
    { label: "Selling Price", key: "sellingPrice", editable: true },
    { label: "Available Stock", key: "quantity", editable: false },
    { label: "Sold", key: "sold", editable: true },
    { label: "Reorder Point", key: "reorderPoint", editable: true },
  ];

  const isLowStock = Number(quantity) < Number(reorderPoint);

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
      {/* Image */}
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
          alt="Product"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      </Box>

      {/* Details */}
      <WidgetWrapper
        sx={{
          maxWidth: isNonMobileScreens ? "450px" : "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          padding: "1.5rem",
        }}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box
            sx={{
              backgroundColor: theme.palette.neutral.mediumMain,
              padding: "0.3rem 1rem",
              fontSize: isNonMobileScreens ? "0.8rem" : "0.65rem",
              borderRadius: "2rem",
              width: "fit-content",
              mb: "0.5rem",
            }}
          >
            {category}
          </Box>

          <Typography variant="h2">{name}</Typography>
          <Typography variant="subtitle1">{description}</Typography>
        </Box>

        {/* Product Grid Details */}
        <Grid container spacing={2}>
          {detailFields.map(({ label, key, editable }) => (
            <Grid item xs={12} md={6} key={key}>
              <Box display="flex" flexDirection="column" mb="1rem">
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography color="text.secondary" variant="subtitle1">
                    {label}
                  </Typography>
                  {key === "quantity" && isLowStock && (
                    <Tooltip title="Stock is below reorder point">
                      <Warning
                        sx={{
                          color: theme.palette.warning.main,
                          fontSize: "1.2rem",
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
                {isEditing && editable ? (
                  <TextField
                    type="number"
                    value={formState[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    size="small"
                  />
                ) : (
                  <Typography variant="h4" fontSize="1.2rem">
                    {formState[key] || "0"}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Edit / Save Buttons */}
        <Box display="flex" justifyContent="flex-end" gap="1rem">
          {isEditing ? (
            <>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </>
          ) : (
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </Box>
      </WidgetWrapper>
    </Box>
  );
};

export default InventoryDetails;
