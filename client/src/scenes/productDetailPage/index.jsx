import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import Navbar from "../navbar";
import ProductDetailWidget from "../widgets/ProductDetailWidget";
import { setProduct } from "../../state"; // Ensure correct import path

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add useNavigate hook for the back button
  const { productId } = useParams();
  const token = useSelector((state) => state.token);
  const products = useSelector((state) => state.products.products);

  // Find the product in the state using productId
  const currentProduct = products.find((product) => product._id === productId);

  const getProduct = async () => {
    const response = await fetch(
      `http://localhost:6001/products/${productId}/product`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setProduct({ product: data }));
  };

  useEffect(() => {
    getProduct();
  }, [productId]); // Fetch product data whenever productId changes

  return (
    <Box>
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: 12, pb: 8 }}>
        {/* Back button */}
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

        {/* Product detail widget */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto", // Center the widget
          }}
        >
          {currentProduct && (
            <ProductDetailWidget
              productId={currentProduct._id}
              productUserId={currentProduct.userId}
              name={currentProduct.name}
              description={currentProduct.description}
              price={currentProduct.price}
              quantity={currentProduct.quantity}
              minQuantity={currentProduct.minQuantity}
              reorderPoint={currentProduct.reorderPoint}
              maxQuantity={currentProduct.maxQuantity}
              status={currentProduct.status}
              category={currentProduct.category}
              bookings={currentProduct.bookings}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetail;
