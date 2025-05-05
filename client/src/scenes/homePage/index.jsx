import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../navbar";
import Sidebar from "../../components/Sidebar";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, role, firstName } = useSelector(
    (state) => state.user
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState({ totalProducts: 0, lowStock: 0 });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock API call to fetch metrics (replace with actual API call)
  useEffect(() => {
    const fetchMetrics = async () => {
      // Example: Fetch metrics from your backend
      // const response = await fetch("http://localhost:6001/metrics", { headers: { Authorization: `Bearer ${token}` } });
      // const data = await response.json();
      // setMetrics(data);

      // Mock data for now
      setMetrics({ totalProducts: 150, lowStock: 5 });
    };
    if (role === "employee") {
      fetchMetrics();
    }
  }, [role]);

  return (
    <Box>
      <Navbar toggleSidebar={toggleSidebar} />
      <Box display="flex">
        <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        <Box
          sx={{
            flexGrow: 1,
            marginTop: "64px",
            marginLeft: isNonMobileScreens ? "250px" : 0,
          }}
        >
          <Box
            width="100%"
            padding="2rem 6%"
            display={isNonMobileScreens ? "flex" : "block"}
            gap="5rem"
          >
            <Box
              flexBasis={isNonMobileScreens ? "100%" : undefined} // Adjusted to use full width
              mt={isNonMobileScreens ? undefined : "2rem"}
            >
              <Typography variant="h1" color="primary" mb="1rem">
                Welcome, {firstName}!
              </Typography>

              {role === "employee" && (
                <>
                  {/* Employee Metrics */}
                  <Box mb="2rem">
                    <Typography variant="h5" color="text.primary" mb="0.5rem">
                      Inventory Overview
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Products: {metrics.totalProducts}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Low Stock Products: {metrics.lowStock}
                    </Typography>
                  </Box>

                  {/* Employee Quick Actions */}
                  <Box display="flex" gap={5}>
                    <Link to="/marketplace">
                      <Button variant="outlined" size="large" color="primary">
                        View Marketplace
                      </Button>
                    </Link>
                    <Link to="/inventory">
                      <Button variant="outlined" size="large" color="primary">
                        View Inventory
                      </Button>
                    </Link>
                  </Box>
                </>
              )}

              {role === "supplier" && (
                <>
                  {/* Supplier Metrics */}
                  <Box mb="2rem">
                    <Typography variant="h5" color="text.primary" mb="0.5rem">
                      Your Products
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Products Added: 10 {/* Replace with actual data */}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Products Sold: 50 {/* Replace with actual data */}
                    </Typography>
                  </Box>

                  {/* Supplier Quick Actions */}
                  <Box display="flex" gap={5}>
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
                        View My Products
                      </Button>
                    </Link>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
