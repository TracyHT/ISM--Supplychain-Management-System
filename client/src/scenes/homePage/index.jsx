import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import EmployeeDashboard from "./EmployeeDashboard";
import SupplierDashboard from "./SupplierDashboard";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { role, firstName } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box>
      <Navbar toggleSidebar={toggleSidebar} />
      <Box display="flex">
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        <Box
          sx={{
            flexGrow: 1,
            marginTop: "100px",
            marginLeft: isNonMobileScreens ? "200px" : 0,
            padding: "2rem 6%",
          }}
        >
          <Box
            mb="2rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h1"
              color="text.primary"
              mb="1rem"
              fontWeight={"medium"}
            >
              Welcome, {firstName}!
            </Typography>
            {role === "supplier" && (
              <Link to="/addProduct">
                <Button variant="outlined" size="large">
                  Add Your Product
                </Button>
              </Link>
            )}
          </Box>

          {/* Role-based dashboard */}
          {role === "employee" && <EmployeeDashboard />}
          {role === "supplier" && <SupplierDashboard />}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
