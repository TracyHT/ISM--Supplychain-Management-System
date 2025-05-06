import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import { Box, useMediaQuery } from "@mui/material";
import AddProductWidget from "../../widgets/AddProductWidget";

const AddProductPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar></Navbar>
      <Box
        width={"100%"}
        padding={"2rem 6%"}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent={"space-between"}
      >
        <AddProductWidget picturePath={picturePath}></AddProductWidget>
      </Box>
    </Box>
  );
};

export default AddProductPage;
