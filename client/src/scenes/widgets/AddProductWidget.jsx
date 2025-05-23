import {
  Label,
  Description,
  ProductionQuantityLimits,
  MonetizationOn,
  LineWeight,
  MonitorWeight,
  Scale,
  CategoryOutlined,
  InsertLink,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  useTheme,
  Button,
  useMediaQuery,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../state";
import FlexBetween from "../../components/FlexBetween";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const AddProductWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");
  const [category, setCategory] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [status, setStatus] = useState("");
  const { _id } = useSelector((state) => state.user);
  const Role = useSelector((state) => state.user.role);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleProduct = async () => {
    const formData = new FormData();
    formData.append("userId", _id); // Ensure _id is not undefined
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("minQuantity", minQuantity);
    formData.append("reorderPoint", reorderPoint);
    formData.append("maxQuantity", maxQuantity);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("imgUrl", imgUrl);

    const response = await fetch(`http://localhost:6001/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // Ensure token is valid
      body: formData,
    });

    const products = await response.json();

    // Check if products were successfully returned
    if (response.ok) {
      dispatch(setProducts({ products }));
      setPrice("");
      setCategory("");
      setMaxQuantity("");
      setMinQuantity("");
      setName("");
      setDescription("");
      setReorderPoint("");
      setQuantity("");
      setStatus("");
      setImgUrl("");
      handleSnackbarOpen();
    } else {
      console.error("Product creation failed", products);
    }
  };

  const categories = [
    "Electronics",
    "Clothing and Apparel",
    "Home and Kitchen",
    "Groceries and Food Items",
    "Health and Personal Care",
    "Automotive",
    "Sports and Outdoors",
    "Toys and Games",
  ];

  useEffect(() => {
    if (Role === "employee") {
      setStatus("Registered");
    } else {
      setStatus("Marketplace");
    }
  }, [Role]);

  console.log(name, category, price, quantity);
  return (
    <WidgetWrapper
      width={isNonMobileScreens ? "50%" : "100%"}
      display="flex"
      flexDirection="column"
    >
      <Box
        display={"flex"}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        <Typography variant="h2" color="text.primary" fontWeight="medium">
          Add A New Product
        </Typography>

        <Typography variant="body" color="text.secondary">
          Please fill your product information to the form below.
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        marginBottom="1rem"
        marginTop="1.5rem"
      >
        <Box>
          {" "}
          <Label
            color={Role == "employee" ? "primary" : "#834bff"}
            fontSize="large"
          />
        </Box>
        <TextField
          multiline
          fullWidth
          label="Name of Product"
          onChange={(e) => setName(e.target.value)}
          value={name}
          sx={{ marginLeft: "1rem" }}
        />
      </Box>

      <Box display="flex" alignItems="center" marginBottom="1rem">
        <Box>
          <Description
            color={Role == "supplier" ? "#834bff" : "primary"}
            fontSize="large"
          />
        </Box>
        <TextField
          multiline
          fullWidth
          label="Description of Product"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          sx={{ marginLeft: "1rem" }}
        />
      </Box>

      <Box display="flex" alignItems="center" marginBottom="1rem">
        <Box>
          {" "}
          <ProductionQuantityLimits
            color={Role == "supplier" ? "#834bff" : "primary"}
            fontSize="large"
          />
        </Box>
        <TextField
          multiline
          fullWidth
          label="Quantity"
          placeholder="write down quantity"
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
          sx={{ marginLeft: "1rem" }}
        />
      </Box>

      <Box display="flex" alignItems="center" marginBottom="1rem">
        <Box>
          {" "}
          <MonetizationOn
            color={Role == "supplier" ? "#834bff" : "primary"}
            fontSize="large"
          />
        </Box>
        <TextField
          multiline
          fullWidth
          label="Price"
          placeholder="write down Price"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          sx={{ marginLeft: "1rem" }}
        />
      </Box>

      <Box display="flex" alignItems="center" marginBottom="1rem">
        <Box>
          {" "}
          <InsertLink
            color={Role == "supplier" ? "#834bff" : "primary"}
            fontSize="large"
          />
        </Box>
        <TextField
          multiline
          fullWidth
          label="Image Link"
          placeholder="Link to product image"
          onChange={(e) => setImgUrl(e.target.value)}
          value={imgUrl}
          sx={{ marginLeft: "1rem" }}
        />
      </Box>

      {Role == "employee" && (
        <Box display="flex" alignItems="center" marginBottom="1rem">
          <Box>
            {" "}
            <MonitorWeight
              color={Role == "supplier" ? "#834bff" : "primary"}
              fontSize="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            label="Minimum Quantity"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            sx={{ marginLeft: "1rem" }}
            variant="outlined"
          />
        </Box>
      )}

      {Role == "employee" && (
        <Box display="flex" alignItems="center" marginBottom="1rem">
          <Box>
            {" "}
            <LineWeight
              color={Role == "supplier" ? "#834bff" : "primary"}
              fontSize="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            label="Max  Quantity"
            value={maxQuantity}
            onChange={(e) => setMaxQuantity(e.target.value)}
            sx={{ marginLeft: "1rem" }}
            variant="outlined"
          />
        </Box>
      )}

      {Role == "employee" && (
        <Box display="flex" alignItems="center" marginBottom="1rem">
          <Box>
            {" "}
            <Scale
              color={Role == "supplier" ? "#834bff" : "primary"}
              fontSize="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            label="Reorder Point"
            value={reorderPoint}
            onChange={(e) => setReorderPoint(e.target.value)}
            sx={{ marginLeft: "1rem" }}
            variant="outlined"
          />
        </Box>
      )}

      <Box display="flex" alignItems="center" marginBottom="2rem">
        <Box>
          <CategoryOutlined
            color={Role == "supplier" ? "#834bff" : "primary"}
            fontSize="large"
          />
        </Box>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{
            width: "100%",
            padding: "0.2rem ",
            marginLeft: "1rem",
            color: "white",
          }}
        >
          <MenuItem value="" disabled>
            Select Product Category
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Button
        onClick={handleProduct}
        variant="contained"
        sx={{
          borderRadius: "3rem",
          padding: "1rem",
        }}
      >
        POST Product
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          Product created successfully go to home page
        </MuiAlert>
      </Snackbar>
    </WidgetWrapper>
  );
};

export default AddProductWidget;
