import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import QuickStatsWidget from "../widgets/QuickStatWidget";
// import SalesTrendWidget from "../../components/widgets/SalesTrendWidget"; // Thêm widget
const EmployeeDashboard = () => {
  const [metrics, setMetrics] = useState({ totalProducts: 0, lowStock: 0 });

  useEffect(() => {
    // Mock API call to fetch metrics (replace with actual API call)
    const fetchMetrics = async () => {
      setMetrics({ totalProducts: 150, lowStock: 5 });
    };
    fetchMetrics();
  }, []);

  return (
    <Box>
      {/* Employee Metrics */}
      <QuickStatsWidget
        data={[
          { label: "Total Products", value: metrics.totalProducts },
          { label: "Low Stock Products", value: metrics.lowStock },
        ]}
      />

      {/* Sales Trend Widget */}
      {/* <SalesTrendWidget /> */}

      {/* Employee Quick Actions */}
      <Box display="flex" gap={5} mt="2rem">
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
    </Box>
  );
};

export default EmployeeDashboard;
