import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box
      maxWidth={isNonMobileScreens ? "65%" : "100%"}
      bgcolor={theme.palette.background.alt}
      p="2rem"
      m="3rem"
      borderRadius="12px"
      boxShadow={3}
      justifySelf="center"
      alignSelf="center"
    >
      <Form />
    </Box>
  );
};

export default LoginPage;
