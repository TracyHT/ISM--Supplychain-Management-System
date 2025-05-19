import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { cloneElement } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";

const QuickStatsWidget = ({ data }) => {
  const theme = useTheme();
  return (
    <Box display="flex" gap={1.5}>
      {data.map((item, index) => (
        <WidgetWrapper
          key={index}
          elevation={3}
          backgroundColor={theme.palette.background.alt}
          sx={{
            padding: "1.25rem 1.25rem",
            minWidth: "160px",
            borderRadius: "0.25rem",
            width: "100%",
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          <Box color="text.secondary" paddingTop={"0.5rem"}>
            {cloneElement(item.icon, { sx: { fontSize: 40 } })}
          </Box>
          <Box>
            <Typography variant="subtitle" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h3" marginTop="0.5rem" fontWeight="semi-bold">
              {item.value}
            </Typography>
          </Box>
        </WidgetWrapper>
      ))}
    </Box>
  );
};

export default QuickStatsWidget;
