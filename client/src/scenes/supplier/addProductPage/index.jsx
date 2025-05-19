import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import { Box, useMediaQuery, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddProductWidget from "../../widgets/AddProductWidget";

const AddProductPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { picturePath } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar></Navbar>
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
        <Box
          width={"100%"}
          padding={"2rem 6%"}
          display={isNonMobileScreens ? "flex" : "block"}
          gap="1rem"
          justifyContent="center"
          alignContent="center"
        >
          <AddProductWidget picturePath={picturePath}></AddProductWidget>
        </Box>
      </Container>
    </Box>
  );
};

export default AddProductPage;
