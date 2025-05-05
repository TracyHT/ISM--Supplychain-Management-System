import { useState } from "react";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import ProductsWidget from "../../widgets/ProductsWidget";

const Marketplace = () => {
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
            color="primary"
            mb="2rem"
            fontWeight={"bold"}
          >
            Marketplace
          </Typography>
          <ProductsWidget userId={_id} defaultStatus="Marketplace" />
        </Box>
      </Box>
    </Box>
  );
};

export default Marketplace;
