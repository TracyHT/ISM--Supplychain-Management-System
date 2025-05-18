import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  Inventory as InventoryIcon,
  Autorenew as AutorenewIcon,
  PendingActions as PendingActionsIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import QuickStatsWidget from "../widgets/QuickStatWidget";

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
  const { _id } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state);
  const [user, setUser] = useState(null);
  const [totalInventory, setTotalInventory] = useState(0);
  const [inventoryByCategory, setInventoryByCategory] = useState([]);
  const theme = useTheme();

  const orderStatusData = [
    { name: "Delivered", value: 95, color: theme.palette.teal[500] },
    { name: "Pending", value: 25, color: theme.palette.teal[700] },
    { name: "Canceled", value: 10, color: theme.palette.grey[500] },
  ];

  const renderCenterLabel = ({ viewBox }) => {
    const { cx, cy } = viewBox;
    const total = orderStatusData.reduce((sum, item) => sum + item.value, 0);

    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
        <tspan
          x={cx}
          dy="-0.3em"
          fontSize="24"
          fontWeight="bold"
          fill={theme.palette.text.primary}
        >
          {total}
        </tspan>
        <tspan
          x={cx}
          dy="1.8em"
          fontSize="14"
          fill={theme.palette.text.secondary}
        >
          Total Orders
        </tspan>
      </text>
    );
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `http://localhost:6001/inventory/${_id}/inventories`
        );
        const data = await response.json();
        const grouped = data.products.reduce((acc, product) => {
          const category = product.category || "Uncategorized";
          acc[category] = (acc[category] || 0) + product.quantity;
          return acc;
        }, {});
        const chartFormatted = Object.entries(grouped)
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setInventoryByCategory(chartFormatted);
        setTotalInventory(data.products.length);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, [_id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:6001/users/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
        console.log("User data:", data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [_id]);

  const mockStats = [
    {
      label: "TOTAL INVENTORY",
      value: totalInventory,
      icon: <InventoryIcon />,
    },
    { label: "LOW IN STOCK", value: 95, icon: <AutorenewIcon /> },
    { label: "PENDING ORDERS", value: 25, icon: <PendingActionsIcon /> },
    { label: "BALANCE", value: user?.balance, icon: <AttachMoneyIcon /> },
  ];

  return (
    <Box>
      {/* Quick Stats */}
      <Box width="100%" mb={4}>
        <QuickStatsWidget data={mockStats} elevation={2} />
      </Box>

      {/* Charts Section */}
      <Box display="flex" flexWrap="wrap" gap={2}>
        {/* Orders by Status Pie Chart */}
        <Box flex={1} minWidth={300}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Orders by Status
          </Typography>
          <Paper
            elevation={0}
            backgroundColor={theme.palette.background.alt}
            sx={{ p: 2, height: 350 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={70}
                  paddingAngle={4}
                  label
                  stroke="none"
                >
                  <Label
                    content={renderCenterLabel}
                    position="center"
                    fill="FFFFFF"
                  />
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.alt,
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

        {/* Inventory Overview Chart */}
        <Box minWidth={300} width="65%">
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Inventory Overview by Category
          </Typography>
          <Paper
            elevation={0}
            backgroundColor={theme.palette.background.alt}
            sx={{ p: 2, height: 350 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryByCategory}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barCategoryGap="15%"
              >
                <CartesianGrid
                  stroke={theme.palette.neutral.mediumMain}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
                  tick={({ x, y, payload }) => {
                    const maxChars = 10;
                    const label =
                      payload.value.length > maxChars
                        ? payload.value.slice(0, maxChars) + "…"
                        : payload.value;

                    return (
                      <text
                        x={x}
                        y={y + 15}
                        textAnchor="middle"
                        fill="#ccc"
                        fontSize={12}
                        dy={0}
                      >
                        {label}
                      </text>
                    );
                  }}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    padding: "0.5rem",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                  }}
                  itemStyle={{ color: theme.palette.text.primary }}
                  cursor={false}
                />
                <Bar
                  dataKey="quantity"
                  fill={theme.palette.neutral.mediumMain}
                  radius={[4, 4, 0, 0]}
                  activeBar={{
                    fill: theme.palette.primary.main,
                    backgroundColor: theme.palette.background.alt,
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
        <Paper elevation={1} sx={{ p: 2, overflowX: "auto" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Product Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.name}>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.date}</TableCell>
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
