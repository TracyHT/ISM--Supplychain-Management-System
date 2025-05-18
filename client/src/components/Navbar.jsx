import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../components/FlexBetween";

// Reusable component for the search bar
const SearchBar = ({ neutralLight }) => (
  <FlexBetween
    backgroundColor={neutralLight}
    borderRadius="9px"
    gap="3rem"
    padding="0.1rem 1.5rem"
  >
    <InputBase placeholder="Search..." />
    <IconButton>
      <Search />
    </IconButton>
  </FlexBetween>
);

// Reusable component for the mode toggle icon
const ModeToggle = ({ theme, dispatch, dark }) => (
  <IconButton onClick={() => dispatch(setMode())}>
    {theme.palette.mode === "dark" ? (
      <DarkMode sx={{ fontSize: "25px" }} />
    ) : (
      <LightMode sx={{ color: dark, fontSize: "25px" }} />
    )}
  </IconButton>
);

// Reusable component for user dropdown
const UserDropdown = ({ fullName, dispatch, navigate, neutralLight }) => (
  <FormControl variant="standard" value={fullName}>
    <Select
      value={fullName}
      sx={{
        backgroundColor: neutralLight,
        width: "150px",
        borderRadius: "0.25rem",
        p: "0.25rem 1rem",
        "& .MuiSvgIcon-root": {
          pr: "0.25rem",
          width: "3rem",
        },
        "& .MuiSelect-select:focus": {
          backgroundColor: neutralLight,
        },
      }}
      input={<InputBase />}
    >
      <MenuItem value={fullName}>
        <Typography>{fullName}</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          dispatch(setLogout());
          navigate("/");
        }}
      >
        Log Out
      </MenuItem>
    </Select>
  </FormControl>
);

// Reusable component for balance display
const BalanceDisplay = ({ balance, role }) => (
  <Typography
    sx={{
      color: "text.primary",
      fontWeight: "bold",
      fontSize: "1rem",
    }}
  >
    Balance: ${balance.toFixed(2)}
  </Typography>
);

// Reusable component for mobile menu content
const MobileMenuContent = ({
  fullName,
  theme,
  dispatch,
  navigate,
  dark,
  neutralLight,
  balance,
  role,
  setIsMobileMenuToggled,
}) => (
  <Box
    sx={{
      position: "fixed",
      right: 0,
      bottom: 0,
      height: "100%",
      zIndex: 1100,
      maxWidth: "500px",
      minWidth: "300px",
      backgroundColor: theme.palette.background.default,
    }}
  >
    <Box display="flex" justifyContent="flex-end" p="1rem">
      <IconButton onClick={() => setIsMobileMenuToggled(false)}>
        <Close />
      </IconButton>
    </Box>
    <FlexBetween
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="3rem"
    >
      <ModeToggle theme={theme} dispatch={dispatch} dark={dark} />
      <Message sx={{ fontSize: "25px" }} />
      <Notifications sx={{ fontSize: "25px" }} />
      <Help sx={{ fontSize: "25px" }} />
      <Box display="flex" flexDirection="column" alignItems="center" gap="1rem">
        <UserDropdown
          fullName={fullName}
          dispatch={dispatch}
          navigate={navigate}
          neutralLight={neutralLight}
        />
        <BalanceDisplay balance={balance} role={role} />
      </Box>
    </FlexBetween>
  </Box>
);

const Navbar = ({ toggleSidebar }) => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const alt = theme.palette.background.alt;

  // Ensure user exists before accessing properties
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const balance = user?.balance || 0;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: alt,
      }}
    >
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        {/* Left Side: Sidebar Toggle & Search Bar */}
        <FlexBetween gap="1.75rem">
          {!isNonMobileScreens && (
            <IconButton onClick={toggleSidebar}>
              <Menu />
            </IconButton>
          )}
          {isNonMobileScreens && <SearchBar neutralLight={neutralLight} />}
        </FlexBetween>

        {/* Right Side: Icons, Balance & User Dropdown */}
        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <ModeToggle theme={theme} dispatch={dispatch} dark={dark} />
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <BalanceDisplay balance={balance} role={role} />
            <UserDropdown
              fullName={fullName}
              dispatch={dispatch}
              navigate={navigate}
              neutralLight={neutralLight}
            />
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}

        {/* Mobile Menu */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <MobileMenuContent
            fullName={fullName}
            theme={theme}
            dispatch={dispatch}
            navigate={navigate}
            dark={dark}
            neutralLight={neutralLight}
            balance={balance}
            role={role}
            setIsMobileMenuToggled={setIsMobileMenuToggled}
          />
        )}
      </FlexBetween>
    </Box>
  );
};

export default Navbar;
