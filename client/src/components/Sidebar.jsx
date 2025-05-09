import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";

const Sidebar = ({ open, onClose }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();
  const { role } = useSelector((state) => state.user);
  const location = useLocation();
  const { _id } = useSelector((state) => state.user);

  const navItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/home",
      visible: true,
    },
    {
      text: "Marketplace",
      icon: <StoreIcon />,
      path: "/marketplace",
      visible: role === "employee",
    },
    {
      text: "Inventory",
      icon: <InventoryIcon />,
      path: "/inventory",
      visible: role === "employee",
    },
    {
      text: "My Product",
      icon: <ShoppingBagIcon />,
      path: "/myproduct",
      visible: role === "supplier",
    },
    {
      text: "Sale Prediction",
      icon: <ShoppingBagIcon />,
      path: "/prediction",
      visible: role === "employee",
    },
    {
      text: "Profile",
      icon: <PersonIcon />,
      path: "/profile/" + _id,
      visible: true,
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        backgroundColor: theme.palette.background.default,
        height: "100%",
      }}
    >
      <List>
        {navItems.map(
          (item) =>
            item.visible && (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={onClose}
                  sx={{
                    backgroundColor:
                      location.pathname === item.path
                        ? theme.palette.action.selected
                        : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>
    </Box>
  );

  return (
    <Box>
      {isNonMobileScreens ? (
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
              borderRight: `1px solid ${theme.palette.divider}`,
              top: "100px", // Adjusted to match navbar height
              height: "calc(100% - 64px)",
              zIndex: 900, // Below navbar but above content
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
              top: "64px", // Start below navbar
              height: "calc(100% - 64px)",
              zIndex: 1200, // Above navbar and mobile menu
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
