import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar";
import UserWidget from "../widgets/UserWidget";

import { Typography } from "@mui/material";
import ProductsWidget from "../widgets/ProductsWidget";
import Sidebar from "../../components/Sidebar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await fetch(`http://localhost:6001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  const { firstName, lastName } = user;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
              <UserWidget userId={userId} picturePath={user.picturePath} />
            </Box>
          </Box>
        </Box>
        {/* <Box
          width="100%"
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="2rem"
          justifyContent="center"
        >
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <UserWidget userId={userId} picturePath={user.picturePath} />
            <Box m="2rem 0" />
          </Box>
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            <Box m="2rem 0" />
            <Box display={"flex"} gap={1.5}>
              <Typography fontSize={"3rem"} color={"primary"}>
                {" "}
                Ordered Products
              </Typography>
            </Box>
            <ProductsWidget userId={userId} isBookedProducts />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default ProfilePage;
