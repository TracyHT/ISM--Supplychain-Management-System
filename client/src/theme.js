// color design tokens export
export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F8F9FA",
    50: "#F1F3F5",
    100: "#E9ECEF",
    200: "#DEE2E6",
    300: "#CED4DA",
    400: "#ADB5BD",
    500: "#868E96",
    600: "#495057",
    700: "#343A40",
    800: "#212529",
    900: "#121416",
    1000: "#000000",
  },
  primary: {
    50: "#E3F8FC",
    100: "#C7F1F9",
    200: "#9FE5F4",
    300: "#66D4EC",
    400: "#33C3E0",
    500: "#00B2D4", // Main primary color
    600: "#0090B3",
    700: "#006E8A",
    800: "#004A5E",
    900: "#002A36",
  },
  // New secondary color palette (complementary to teal)
  secondary: {
    50: "#FFF0E3",
    100: "#FFE0C7",
    200: "#FFC79F",
    300: "#FFAD66",
    400: "#FF9433",
    500: "#FF7A00", // Main secondary color (orange)
    600: "#D66200",
    700: "#A64B00",
    800: "#753400",
    900: "#4D2200",
  },
  // Utility colors for feedback states
  success: {
    50: "#E6F7ED",
    100: "#C3EADB",
    200: "#9ADEC8",
    300: "#5FCCA8",
    400: "#33BD8F",
    500: "#00AB76", // Main success color
    600: "#008A5E",
    700: "#006947",
    800: "#00472F",
    900: "#00291B",
  },
  error: {
    50: "#FEECEB",
    100: "#FDD8D6",
    200: "#FBB1AD",
    300: "#F88A84",
    400: "#F6635B",
    500: "#F43C32", // Main error color
    600: "#D92419",
    700: "#A31C13",
    800: "#6D130D",
    900: "#370A06",
  },
  warning: {
    50: "#FFF8E6",
    100: "#FFF1CC",
    200: "#FFE499",
    300: "#FFD666",
    400: "#FFC833",
    500: "#FFBA00", // Main warning color
    600: "#D69C00",
    700: "#A67700",
    800: "#755300",
    900: "#4D3700",
  },
  info: {
    50: "#E6EFFF",
    100: "#CCDFFF",
    200: "#99BFFF",
    300: "#669FFF",
    400: "#337FFF",
    500: "#005FFF", // Main info color
    600: "#004CD6",
    700: "#003AA6",
    800: "#002775",
    900: "#00174D",
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              dark: colorTokens.primary[300],
              main: colorTokens.primary[400],
              light: colorTokens.primary[800],
            },
            secondary: {
              dark: colorTokens.secondary[300],
              main: colorTokens.secondary[400],
              light: colorTokens.secondary[800],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[600],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
              paper: colorTokens.grey[800],
            },
            success: {
              main: colorTokens.success[400],
              light: colorTokens.success[300],
              dark: colorTokens.success[600],
            },
            error: {
              main: colorTokens.error[400],
              light: colorTokens.error[300],
              dark: colorTokens.error[600],
            },
            warning: {
              main: colorTokens.warning[400],
              light: colorTokens.warning[300],
              dark: colorTokens.warning[600],
            },
            info: {
              main: colorTokens.info[400],
              light: colorTokens.info[300],
              dark: colorTokens.info[600],
            },
            text: {
              primary: colorTokens.grey[100],
              secondary: colorTokens.grey[300],
              disabled: colorTokens.grey[500],
            },
            teal: colorTokens.primary,
          }
        : {
            // palette values for light mode
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[50],
            },
            secondary: {
              dark: colorTokens.secondary[700],
              main: colorTokens.secondary[500],
              light: colorTokens.secondary[50],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[200],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[50],
              alt: colorTokens.grey[0],
              paper: colorTokens.grey[0],
            },
            success: {
              main: colorTokens.success[500],
              light: colorTokens.success[50],
              dark: colorTokens.success[700],
            },
            error: {
              main: colorTokens.error[500],
              light: colorTokens.error[50],
              dark: colorTokens.error[700],
            },
            warning: {
              main: colorTokens.warning[500],
              light: colorTokens.warning[50],
              dark: colorTokens.warning[700],
            },
            info: {
              main: colorTokens.info[500],
              light: colorTokens.info[50],
              dark: colorTokens.info[700],
            },
            text: {
              primary: colorTokens.grey[900],
              secondary: colorTokens.grey[700],
              disabled: colorTokens.grey[500],
            },
            teal: colorTokens.primary,
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
