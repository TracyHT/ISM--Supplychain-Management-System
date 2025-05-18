import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../state";

const BookedUserWidget = ({ orderId }) => {
  const { token } = useSelector((state) => state);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [userError, setUserError] = useState(false);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const dispatch = useDispatch();

  // Fetch order info
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      console.log("Fetching order with ID:", orderId);
      try {
        const res = await fetch(`http://localhost:6001/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setOrder(data);
        } else {
          console.error("Failed to load order:", data.message);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  // Fetch user info based on order.employeeId
  useEffect(() => {
    const fetchUser = async () => {
      if (!order?.employeeId) return;
      try {
        const res = await fetch(
          `http://localhost:6001/users/${order.employeeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.warn("Failed to load user:", data.message);
          setUserError(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserError(true);
      }
    };
    fetchUser();
  }, [order?.employeeId, token]);

  const handleConfirm = async () => {
    try {
      const res = await fetch(
        `http://localhost:6001/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "confirmed" }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Order confirmed!");
        setUser(user);
        setConfirming(true);
        setOrder((prev) => ({ ...prev, status: "confirmed" }));
      } else {
        alert(data.message || "Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("An error occurred while confirming the order.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading || !order) return <CircularProgress color="inherit" size={24} />;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: "1rem",
        padding: "1rem",
        color: "text.primary",
        gap: "0.8rem",
      }}
    >
      {/* User Info */}
      <Typography fontWeight="bold" fontSize="1.1rem" mb="0.5rem">
        {console.log("User data:", user)}
        {user
          ? `${user.firstName} ${user.lastName} (${user.email})`
          : userError
          ? "User not found"
          : "Loading user..."}
      </Typography>

      <Divider sx={{ my: "0.5rem", borderColor: theme.palette.neutral.main }} />

      {/* Order Info */}

      <Box display="flex" justifyContent="space-between">
        <Typography variant="body" color="gray">
          Quantity:
        </Typography>
        <Typography variant="body">{order.quantity}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Typography variant="body" color="gray">
          Price/Unit:
        </Typography>
        <Typography variant="body">${order.pricePerUnit.toFixed(2)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Typography variant="body" color="gray">
          Total:
        </Typography>
        <Typography variant="body" fontWeight="bold">
          ${Number(order.quantity * order.pricePerUnit).toFixed(2)}
        </Typography>
      </Box>

      <Box
        mt={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Chip
          label={order.status}
          color={order.status === "confirmed" ? "success" : "warning"}
          sx={{ fontWeight: "bold" }}
        />
        {order.status !== "confirmed" && (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleConfirm}
            disabled={confirming}
            sx={{ ml: "auto" }}
          >
            {confirming ? "Confirming..." : "Confirm"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default BookedUserWidget;
