import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  TextField,
  useTheme,
  Grid,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import { setProduct } from "../../state";
import BookedUserWidget from "./BookedUserWidget";
import placeholderImg from "../../assets/placeholderImg.png";
import { memo } from "react";

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

  const [isEditing, setIsEditing] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(0); // Initialize to 0, update in useEffect
  const [productDetails, setProductDetails] = useState(null);
  const [formState, setFormState] = useState({});

  // Fetch product details and set selectedQuantity
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:6001/products/${productId}/product`
        );
        const data = await response.json();

        if (response.status === 200) {
          setProductDetails(data);
          const newFormState = {
            ...data,
            name: data.name || "",
            description: data.description || "",
            price: data.price || 0,
            quantity: data.quantity || 0,
            minQuantity: data.minQuantity || 0,

            maxQuantity: data.maxQuantity || 0,
            status: data.status || defaultStatus || "",
            category: data.category || "",
            bookings: data.bookings || {},
            orders: data.orders || [],
            imgUrl: data.imgUrl || "",
          };
          setFormState(newFormState);
          setSelectedQuantity(Number(newFormState.minQuantity) || 1); // Set default to minQuantity
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
  }, [productId, defaultStatus]);

  // Update selectedQuantity when minQuantity changes
  useEffect(() => {
    if (formState.minQuantity !== undefined) {
      setSelectedQuantity(Number(formState.minQuantity) || 1);
    }
  }, [formState.minQuantity]);

  // Handle form input changes
  const handleChange = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle save action
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:6001/products/${productId}/update`,
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
        dispatch(setProduct({ product: formState }));
      } else {
        alert("Error updating product: " + data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update product.");
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setIsEditing(false);
    setFormState(productDetails);
  };

  // Handle order placement and booking (Employee)
  const handleOrder = async () => {
    if (
      selectedQuantity < formState.minQuantity ||
      selectedQuantity > formState.quantity
    ) {
      alert(
        `Please select a valid quantity between ${formState.minQuantity} and ${formState.quantity}`
      );
      return;
    }

    try {
      const orderResponse = await fetch("http://localhost:6001/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: selectedQuantity,
          pricePerUnit: formState.price,
        }),
      });

      if (orderResponse.status !== 201) {
        const errorData = await orderResponse.json();
        alert(errorData.message);
        return;
      }

      const orderData = await orderResponse.json();

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
            orderId: orderData.order._id,
          }),
        }
      );

      if (bookResponse.status !== 200) {
        const errorData = await bookResponse.json();
        alert("Order placed, but failed to book product: " + errorData.message);
        return;
      }

      const updatedProduct = await bookResponse.json();
      setProductDetails(updatedProduct);
      setFormState(updatedProduct);
      dispatch(setProduct({ product: updatedProduct }));
      setSelectedQuantity(Number(updatedProduct.minQuantity) || 1); // Reset to minQuantity after booking

      alert("Order placed and product booked successfully!");
    } catch (error) {
      console.error("Error during order and booking process:", error);
      alert("An error occurred while processing your request.");
    }
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
    maxQuantity,
    status,
    category,
    bookings = {},
    orders = [],
    imgUrl,
  } = formState;

  const orderCount = orders.length;

  // Define fields with visibility and editability rules
  const detailFields = [
    {
      label: "Available Stock",
      key: "quantity",
      editable: role === "supplier",
      visible: true,
    },
    {
      label: "Minimum Quantity",
      key: "minQuantity",
      editable: role === "supplier",
      visible: true,
    },
    {
      label: "Maximum Quantity",
      key: "maxQuantity",
      editable: role === "supplier",
      visible: true,
    },
  ];

  const ProductDetailItem = memo(
    ({ label, value, field, editable, isNonMobileScreens }) => {
      console.log(`Rendering ProductDetailItem for ${field}`); // For debugging
      return (
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
          {isEditing && editable && role === "supplier" ? (
            <TextField
              type="number"
              value={formState[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              size="small"
              sx={{ width: "150px" }}
            />
          ) : (
            <Typography
              color="text.primary"
              variant="h4"
              fontSize={isNonMobileScreens ? "1.2rem" : "1rem"}
              fontWeight="medium"
            >
              {value || "0"}
            </Typography>
          )}
        </Box>
      );
    }
  );

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
          {isEditing && role === "supplier" ? (
            <>
              <TextField
                label="Name"
                value={formState.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                size="small"
              />
              <TextField
                label="Description"
                value={formState.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                size="small"
                multiline
                rows={3}
              />
            </>
          ) : (
            <>
              <Typography variant="h2" color="text.primary" fontWeight="medium">
                {name || "Product"}
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                {description}
              </Typography>
            </>
          )}
        </Box>

        {/* Price */}
        {isEditing && role === "supplier" ? (
          <TextField
            label="Price"
            type="number"
            value={formState.price || ""}
            onChange={(e) => handleChange("price", e.target.value)}
            size="small"
          />
        ) : (
          <Typography variant="h3" color="text.primary" fontWeight="medium">
            ${price}
          </Typography>
        )}

        {/* Product Details Grid */}
        <Grid container spacing={2}>
          {detailFields
            .filter(({ visible }) => visible)
            .map(({ label, key, editable }) => (
              <Grid item xs={12} md={6} key={key}>
                <ProductDetailItem
                  label={label}
                  value={formState[key]}
                  field={key}
                  editable={editable}
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
              inputProps={{ min: minQuantity, max: quantity || Infinity }}
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

        {/* Supplier Actions */}
        {role === "supplier" && (
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
        )}
      </WidgetWrapper>

      {/* Supplier Orders Section */}
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
