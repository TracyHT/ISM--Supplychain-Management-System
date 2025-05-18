import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import Navbar from "../../components/Navbar";
import InventoryDetails from "../widgets/InventoryDetails";
import ProductDetails from "../widgets/ProductDetails";

const ProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const isInventoryRoute = location.pathname.includes("/inventory/");

  return (
    <Box>
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: 12, pb: 8 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            mb: 4,
            fontSize: "1rem",
            px: 2,
            py: 1,
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          ← Back
        </Button>

        <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto" }}>
          {isInventoryRoute ? (
            <InventoryDetails productId={productId} />
          ) : (
            <ProductDetails productId={productId} />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetail;
