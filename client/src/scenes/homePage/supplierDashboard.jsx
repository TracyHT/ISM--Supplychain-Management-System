import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const SupplierDashboard = () => {
  // Replace with real data when available
  const totalAdded = 10;
  const totalSold = 50;

  return (
    <>
      <Box mb="2rem">
        <Typography variant="h5" mb="0.5rem">
          Your Products
        </Typography>
        <Typography>Total Products Added: {totalAdded}</Typography>
        <Typography>Products Sold: {totalSold}</Typography>
      </Box>
      <Box display="flex" gap={4}>
        <Link to="/addProduct">
          <Button variant="outlined" size="large" sx={supplierButtonStyle}>
            Add Your Product
          </Button>
        </Link>
        <Link to="/myproduct">
          <Button variant="outlined" size="large" sx={supplierButtonStyle}>
            View My Products
          </Button>
        </Link>
      </Box>
    </>
  );
};

const supplierButtonStyle = {
  fontSize: "1.25rem",
  padding: "12px 24px",
  color: "#834bff",
  borderColor: "#834bff",
  "&:hover": {
    color: "#fff",
    backgroundColor: "#834bff",
    borderColor: "#834bff",
  },
};

export default SupplierDashboard;
