import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import authImage from "../../assets/loginImage.png";

// Schemas
const schemas = {
  register: yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    role: yup.string().required("required"),
    location: yup.string().required("required"),
    picture: yup.string().required("required"),
    employeeId: yup.string(),
    supplierId: yup.string(),
    phoneNumber: yup.string().required("required"),
    securityQuestion: yup.string().required("required"),
    securityAnswer: yup.string().required("required"),
  }),
  login: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  }),
  verifyEmail: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  }),
  resetPassword: yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    securityAnswer: yup
      .string()
      .required("Security answer is required")
      .min(2, "Security answer must be at least 2 characters")
      .max(50, "Security answer must be at most 50 characters"),
    password: yup.string().required("Password is required"),
  }),
};

// Initial Values
const initialValues = {
  register: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    location: "",
    phoneNumber: "",
    supplierId: "",
    employeeId: "",
    securityQuestion: "",
    securityAnswer: "",
    picture: "",
  },
  login: { email: "", password: "" },
  verifyEmail: { email: "" },
  resetPassword: { securityAnswer: "", email: "", password: "" },
};

// Reusable Styled TextField
const StyledTextField = ({ sx, ...props }) => (
  <TextField
    {...props}
    sx={{
      gridColumn: "span 4",
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: props.name === "text.secondary",
        },
        "&:hover fieldset": { borderColor: "primary.main" },
        "&.Mui-focused fieldset": { borderColor: "primary.main" },
      },
      "& .MuiInputLabel-root": { color: "text.secondary" },
      "& input": { color: "text.secondary" },
      ...sx,
    }}
  />
);

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // API Handlers
  const apiCalls = {
    register: async (values) => {
      const formData = new FormData();
      for (let key in values) formData.append(key, values[key]);
      formData.append("picturePath", values.picture.name);
      const response = await fetch("http://localhost:6001/auth/register", {
        method: "POST",
        body: formData,
      });
      return response.json();
    },
    login: async (values) => {
      const response = await fetch("http://localhost:6001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      return response.json();
    },
    verifyEmail: async (values) => {
      const response = await fetch("http://localhost:6001/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      return response.json();
    },
    resetPassword: async (values) => {
      const response = await fetch(
        "http://localhost:6001/auth/reset-password-security",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      return response.json();
    },
  };

  // Form Submission Handler
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await apiCalls[pageType](values);
      resetForm();

      if (pageType === "login" && response.user) {
        dispatch(setLogin({ user: response.user, token: response.token }));
        navigate("/home");
      } else if (pageType === "register" && response) {
        setPageType("login");
      } else if (pageType === "verifyEmail" && response.success) {
        setSecurityQuestion(response.securityQuestion);
        setPageType("resetPassword");
        alert("Email Verified");
      } else if (pageType === "resetPassword" && response.success) {
        setPageType("login");
        alert("Password reset successfully");
      } else {
        alert(`Error: ${response.message || "Action failed"}`);
      }
    } catch (error) {
      console.error(`Error in ${pageType}:`, error);
      alert("An error occurred.");
    }
  };

  // Navigation Links
  const navLinks = {
    login: [
      { text: "Don't have an account? Sign Up here.", to: "register" },
      { text: "Forgot Password?", to: "verifyEmail" },
    ],
    register: [{ text: "Already have an account? Login here.", to: "login" }],
    verifyEmail: [{ text: "Remember your password? Login here.", to: "login" }],
    resetPassword: [
      { text: "Remember your password? Login here.", to: "login" },
    ],
  };

  // Form Fields Configuration
  const formFields = {
    register: [
      { name: "firstName", label: "First Name", sx: { gridColumn: "span 2" } },
      { name: "lastName", label: "Last Name", sx: { gridColumn: "span 2" } },
      {
        component: ({ values, handleChange }) => (
          <FormControl component="fieldset">
            <FormLabel component="legend" id="role">
              Role
            </FormLabel>
            <RadioGroup
              row
              name="role"
              value={values.role}
              onChange={handleChange}
            >
              <Box display="flex">
                <FormControlLabel
                  value="employee"
                  control={<Radio />}
                  label="Employee"
                />
                <FormControlLabel
                  value="supplier"
                  control={<Radio />}
                  label="Supplier"
                />
              </Box>
            </RadioGroup>
          </FormControl>
        ),
      },
      {
        name: "employeeId",
        label: "Employee Id",
        condition: (values) => values.role === "employee",
      },
      {
        name: "supplierId",
        label: "Supplier Id",
        condition: (values) => values.role === "supplier",
      },
      { name: "phoneNumber", label: "Phone Number" },
      { name: "location", label: "Inventory location" },
      {
        component: ({ values, setFieldValue }) => (
          <Box
            gridColumn="span 4"
            border={`1px solid ${palette.neutral.medium}`}
            borderRadius="5px"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(files) => setFieldValue("picture", files[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.text.secondary}`}
                  p="1rem"
                  borderRadius={1}
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!values.picture ? (
                    <p>Add Picture Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{values.picture.name}</Typography>
                      <EditOutlinedIcon />
                    </FlexBetween>
                  )}
                </Box>
              )}
            </Dropzone>
          </Box>
        ),
      },
      { name: "securityQuestion", label: "Security Question" },
      { name: "securityAnswer", label: "Security Answer" },
      { name: "email", label: "Email" },
      { name: "password", label: "Password", type: "password" },
    ],
    login: [
      { name: "email", label: "Email" },
      { name: "password", label: "Password", type: "password" },
    ],
    verifyEmail: [{ name: "email", label: "Email" }],
    resetPassword: [
      { name: "email", label: "Email" },
      {
        component: () => <Box>{securityQuestion}</Box>,
      },
      { name: "securityAnswer", label: "Security Answer" },
      { name: "password", label: "New Password", type: "password" },
    ],
  };

  return (
    <Box
      display="flex"
      flexDirection={isNonMobile ? "row" : "column"}
      gap={4}
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      {/* Left Image */}
      {isNonMobile && pageType === "login" && (
        <Box
          width="600px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={authImage}
            alt="Auth Illustration"
            style={{
              width: "100%",
              borderRadius: "12px", // Rounded corners
            }}
          />
        </Box>
      )}
      <Box width={isNonMobile ? "600px" : "100%"} maxWidth="100%">
        <Typography variant="h1" mb={3} fontWeight="medium">
          {pageType === "login"
            ? "Welcome Back!"
            : pageType === "verifyEmail"
            ? "Verify Your Email"
            : pageType === "resetPassword"
            ? "Reset Password"
            : "Create new Account"}
        </Typography>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues[pageType]}
          validationSchema={schemas[pageType]}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap={2}
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {formFields[pageType].map((field, index) =>
                  field.component ? (
                    <field.component
                      key={index}
                      values={values}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                    />
                  ) : (
                    (!field.condition || field.condition(values)) && (
                      <StyledTextField
                        key={field.name}
                        label={field.label}
                        type={field.type || "text"}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values[field.name]}
                        name={field.name}
                        error={
                          Boolean(touched[field.name]) &&
                          Boolean(errors[field.name])
                        }
                        helperText={touched[field.name] && errors[field.name]}
                        sx={field.sx}
                      />
                    )
                  )
                )}
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    borderRadius: "2rem",
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {pageType === "login"
                    ? "LOGIN"
                    : pageType === "verifyEmail"
                    ? "VERIFY EMAIL"
                    : pageType === "resetPassword"
                    ? "RESET PASSWORD"
                    : "REGISTER"}
                </Button>

                {navLinks[pageType].map(({ text, to }) => (
                  <Typography
                    key={to}
                    onClick={() => {
                      setPageType(to);
                      resetForm();
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: palette.primary.main,
                      "&:hover": {
                        cursor: "pointer",
                        color: palette.primary.light,
                      },
                      textAlign: "center",
                    }}
                  >
                    {text}
                  </Typography>
                ))}
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Form;
