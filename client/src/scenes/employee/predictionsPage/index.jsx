import { useEffect, useState, useCallback } from "react";
import SalesLineChart from "../../../components/SalesLineChart";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar"; // Import Sidebar
import WidgetWrapper from "../../../components/WidgetWrapper";

const PredictionPage = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [year, setYear] = useState(2023);
  const [loading, setLoading] = useState(true);
  const [activeProducts, setActiveProducts] = useState([
    "Laptop",
    "Coffee_cup",
    "Wireless_Headphones",
    "Gaming_console",
  ]);
  const [viewType, setViewType] = useState("monthly");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const currentYear = new Date().getFullYear();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  // Generate array of available years from 2000 to currentYear + 5
  const availableYears = Array.from(
    { length: currentYear + 6 - 2000 },
    (_, i) => 2000 + i
  );

  const getPredictionsMonthly = useCallback(async () => {
    try {
      setLoading(true); // Start loading
      const monthlySales = {
        Laptop: [],
        Coffee_cup: [],
        Wireless_Headphones: [],
        Gaming_console: [],
      };

      for (let month = 0; month < 12; month++) {
        const response = await fetch(
          `http://localhost:5000/predictMonthly?month=${
            month + 1
          }&year=${year}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        const monthName = new Date(year, month).toLocaleString("default", {
          month: "short",
        });

        monthlySales.Laptop.push({ x: monthName, y: data.P1 });
        monthlySales.Coffee_cup.push({ x: monthName, y: data.P2 });
        monthlySales.Wireless_Headphones.push({ x: monthName, y: data.P3 });
        monthlySales.Gaming_console.push({ x: monthName, y: data.P4 });
      }

      const formattedData = Object.keys(monthlySales).map((product) => ({
        id: product,
        data: monthlySales[product],
      }));

      setMonthlySales(formattedData);
      setLoading(false); // End loading
    } catch (error) {
      console.error("Error fetching predictions", error);
      setLoading(false); // End loading even if there's an error
    }
  }, [year]);

  useEffect(() => {
    getPredictionsMonthly();
  }, [year, getPredictionsMonthly]);

  const handleProductToggle = (event, newProducts) => {
    // Ensure at least one product is always selected
    if (newProducts.length) {
      setActiveProducts(newProducts);
    }
  };

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar
  };

  const filteredSalesData = monthlySales.filter((product) =>
    activeProducts.includes(product.id)
  );

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
          <Container maxWidth="xl" sx={{ mt: 9, mb: 6 }}>
            <WidgetWrapper>
              <Typography
                variant="h1"
                fontWeight="bold"
                mb={3}
                textAlign="center"
                color="primary"
              >
                Sales Prediction Dashboard
              </Typography>

              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" mb={2}>
                        Prediction Year
                      </Typography>
                      <FormControl fullWidth>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={year}
                          onChange={handleYearChange}
                          label="Year"
                        >
                          {availableYears.map((availableYear) => (
                            <MenuItem key={availableYear} value={availableYear}>
                              {availableYear}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" mb={2}>
                        View Settings
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl sx={{ minWidth: 150 }}>
                          <InputLabel>Prediction Type</InputLabel>
                          <Select
                            value={viewType}
                            onChange={handleViewTypeChange}
                            label="Prediction Type"
                            size="small"
                          >
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                          </Select>
                        </FormControl>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" mb={1}>
                            Product Filter
                          </Typography>
                          <ToggleButtonGroup
                            value={activeProducts}
                            onChange={handleProductToggle}
                            size="small"
                            color="primary"
                            aria-label="product filter"
                            fullWidth
                            multiple
                          >
                            <ToggleButton value="Laptop">Laptop</ToggleButton>
                            <ToggleButton value="Coffee_cup">
                              Coffee Cup
                            </ToggleButton>
                            <ToggleButton value="Wireless_Headphones">
                              Headphones
                            </ToggleButton>
                            <ToggleButton value="Gaming_console">
                              Console
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card elevation={3}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  {loading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="450px"
                    >
                      <CircularProgress />
                      <Typography ml={2} variant="body1">
                        Loading prediction data...
                      </Typography>
                    </Box>
                  ) : (
                    <Box height="470px" p={2}>
                      <Typography variant="h5" mb={2} textAlign="center">
                        Predicted Sales for {year}
                      </Typography>
                      <Box height="420px">
                        <SalesLineChart data={filteredSalesData} />
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>

              <Box mt={3} textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={getPredictionsMonthly}
                  disabled={loading}
                >
                  Refresh Predictions
                </Button>
              </Box>
            </WidgetWrapper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default PredictionPage;
