import {
  ManageAccountsOutlined,
  PhoneOutlined,
  EmailOutlined,
  AccountCircle,
  Fingerprint,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const Role = useSelector((state) => state.user.role);
  const loggedInUserId = useSelector((state) => state.user._id); // Assuming you have a way to get the logged-in user's ID
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

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

  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setEditMode(true); // Enable edit mode
  };

  const handleSave = async () => {
    // Send updated user details to backend for saving
    try {
      await fetch(`http://localhost:6001/users/${userId}`, {
        method: "PATCH", // Use PATCH method for partial updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user), // Send updated user object
      });
      setEditMode(false); // Disable edit mode after saving
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value, // Update user state as user types
    });
  };

  const {
    firstName,
    lastName,
    role,
    email,
    supplierId,
    phoneNumber,
    employeeId,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={
          Role === "employee" ? () => navigate(`/employee/${userId}`) : ""
        }
      >
        <Box>
          {!editMode ? ( // Display editable fields only if not in edit mode and if the logged-in user is viewing their own profile
            <>
              <Typography
                variant="h1"
                color={Text.primary}
                fontWeight="medium"
                sx={{
                  "&:hover": {
                    color: palette.primary.dark,
                    cursor: "pointer",
                  },
                }}
              >
                {firstName} {lastName}
              </Typography>
            </>
          ) : (
            <>
              <TextField
                name="firstName"
                label="First Name"
                value={firstName}
                onChange={handleChange}
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={lastName}
                onChange={handleChange}
              />
            </>
          )}
        </Box>
        {userId === loggedInUserId &&
          !editMode && ( // Display edit button only if the logged-in user is viewing their own profile and if not in edit mode
            <ManageAccountsOutlined onClick={handleEdit} />
          )}
        {editMode && (
          <Button onClick={handleSave} variant="outlined">
            Save
          </Button>
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <AccountCircle fontSize="large" sx={{ color: main }}></AccountCircle>

          <Typography color={medium}>{role}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <PhoneOutlined fontSize="large" sx={{ color: main }} />
          {!editMode ? (
            <Typography color={medium}>{phoneNumber}</Typography>
          ) : (
            <TextField
              name="phoneNumber"
              label="Phone Number"
              value={phoneNumber}
              onChange={handleChange}
            />
          )}
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <EmailOutlined fontSize="large" sx={{ color: main }} />
          {!editMode ? (
            <Typography color={medium}>{email}</Typography>
          ) : (
            <TextField
              name="email"
              label="Email"
              value={email}
              onChange={handleChange}
            />
          )}
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
