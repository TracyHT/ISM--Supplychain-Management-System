import { useState } from "react";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import ProductsWidget from "../../widgets/ProductsWidget";

const MyProduct = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box>
      <Navbar toggleSidebar={toggleSidebar} />
      <Box display="flex">
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        <Box
          sx={{
            flexGrow: 1,
            marginTop: "100px",
            marginLeft: isNonMobileScreens ? "250px" : 0,
            padding: "2rem 6%",
          }}
        >
          <Typography
            variant="h1"
            color="#834bff"
            mb="2rem"
            fontWeight={"bold"}
          >
            Your Products
          </Typography>
          <ProductsWidget
            userId={_id}
            isProfile={true}
            defaultStatus="Marketplace"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MyProduct;
