import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  PieChart,
  Pie,
  Cell,
  Bar,
  LabelList,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  PendingActions as PendingActionsIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import QuickStatsWidget from "../widgets/QuickStatWidget";

const mockStats = [
  { label: "Total Inventory", value: 120, icon: <InventoryIcon /> },
  { label: "Delivered", value: 95, icon: <LocalShippingIcon /> },
  { label: "Pending", value: 25, icon: <PendingActionsIcon /> },
  { label: "Revenue", value: "$12,000", icon: <AttachMoneyIcon /> },
];

const chartData = [
  { name: "Jan", quantity: 400 },
  { name: "Feb", quantity: 300 },
  { name: "Mar", quantity: 200 },
  { name: "Apr", quantity: 278 },
  { name: "May", quantity: 189 },
];

const recentOrders = [
  {
    id: 1,
    name: "ORD001",
    status: "Delivered",
    date: "2025-05-10",
    quantity: 2,
    amount: "$500",
  },
  {
    id: 2,
    name: "ORD002",
    status: "Pending",
    date: "2025-05-09",
    quantity: 2,
    amount: "$300",
  },
  {
    name: 3,
    orderId: "ORD003",
    status: "Canceled",
    date: "2025-05-08",
    quantity: 2,
    amount: "$200",
  },
];

const EmployeeDashboard = () => {
  const theme = useTheme();

  const orderStatusData = [
    { name: "Delivered", value: 95, color: theme.palette.teal[500] },
    { name: "Pending", value: 25, color: theme.palette.teal[700] },
    { name: "Canceled", value: 10, color: theme.palette.grey[500] },
  ];

  return (
    <Box>
      {/* Quick Stats */}
      <Box width="100%" mb={4}>
        <QuickStatsWidget data={mockStats} />
      </Box>

      {/* Charts Section */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        {/* Orders by Status Pie Chart */}
        <Box flex={1} minWidth={300}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Orders by Status
          </Typography>
          <Paper elevation={2} sx={{ p: 2, height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={4}
                  fill={theme.palette.primary.main}
                  label
                  stroke="none"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    padding: "0.5rem",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                  itemStyle={{ color: theme.palette.text.primary }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    paddingTop: "2rem",
                  }}
                  iconType="circle"
                  textStyle={{
                    color: theme.palette.text.primary,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
        {/* Inventory Chart */}
        <Box minWidth={300} width="65%">
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Inventory Overview
          </Typography>
          <Paper elevation={2} sx={{ p: 2, height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barCategoryGap="15%"
              >
                <CartesianGrid
                  stroke={theme.palette.grey[600]}
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    padding: "0.5rem",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                  itemStyle={{ color: theme.palette.text.primary }}
                />
                <Bar
                  dataKey="quantity"
                  fill={theme.palette.teal[700]}
                  radius={[4, 4, 0, 0]}
                  activeBar={{
                    fill: theme.palette.primary.main,
                    stroke: theme.palette.primary[700],
                    strokeWidth: 2,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>

      {/* Recent Orders Section */}
      <Box mt={4} width="100%">
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Recent Orders
        </Typography>
        <Paper elevation={2} sx={{ p: 2, overflowX: "auto" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Product Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.name}>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;
