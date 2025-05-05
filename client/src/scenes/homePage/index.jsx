import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Navbar from "../navbar";
import Sidebar from "../../components/Sidebar";
import UserWidget from "../widgets/UserWidget";
import ProductsWidget from "../widgets/ProductsWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, role } = useSelector((state) => state.user);
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
            marginTop: "64px", // Offset for fixed navbar height
            marginLeft: isNonMobileScreens ? "250px" : 0,
          }}
        >
          <Box
            width="100%"
            padding="2rem 6%"
            display={isNonMobileScreens ? "flex" : "block"}
            gap="5rem"
          >
            <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
              <UserWidget userId={_id} picturePath={picturePath} />
            </Box>
            {role === "supplier" && (
              <Box
                flexBasis={isNonMobileScreens ? "42%" : undefined}
                mt={isNonMobileScreens ? undefined : "2rem"}
              >
                <Link to="/myproduct">
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      fontSize: "1.25rem",
                      padding: "12px 24px",
                      color: "#834bff",
                      borderColor: "#834bff",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#834bff",
                        borderColor: "#834bff",
                      },
                    }}
                  >
                    Add your Product
                  </Button>
                </Link>
                <ProductsWidget userId={_id} isProfile={true} />
              </Box>
            )}
            {role === "employee" && (
              <Box
                flexBasis={isNonMobileScreens ? "42%" : undefined}
                mt={isNonMobileScreens ? undefined : "2rem"}
              >
                <Box display="flex" gap={5}>
                  <Link to="/marketplace">
                    <Button variant="outlined" size="large" color="primary">
                      View Marketplace
                    </Button>
                  </Link>
                </Box>
                <ProductsWidget userId={_id} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
