import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
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
            marginLeft: isNonMobileScreens ? "250px" : 0,
            padding: "2rem 6%",
          }}
        >
          {/* Shared Welcome Message */}
          <Box mb="2rem">
            <Typography
              variant="h1"
              color="primary"
              mb="1rem"
              fontWeight={"bold"}
            >
              Welcome, {firstName}!
            </Typography>
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
