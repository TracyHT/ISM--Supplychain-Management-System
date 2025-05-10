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
  const location = useLocation();
  const { role, _id } = useSelector((state) => state.user);
  const alt = theme.palette.background.alt;

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
      path: `/profile/${_id}`,
      visible: true,
    },
  ];

  const drawerContent = (
    <Box sx={{ width: 250, height: "100%", bgcolor: alt }}>
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
    <Drawer
      variant={isNonMobileScreens ? "permanent" : "temporary"}
      open={isNonMobileScreens ? true : open}
      onClose={!isNonMobileScreens ? onClose : undefined}
      PaperProps={{
        sx: {
          width: 250,
          boxSizing: "border-box",
          bgcolor: alt,
          paddingTop: "2px",
          top: isNonMobileScreens ? "64px" : "0px",
          height: "100%",
          borderRight: `1px solid ${theme.palette.divider}`,
          zIndex: isNonMobileScreens ? 900 : 1200,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
