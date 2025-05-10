import React from "react";
import { Box, Typography } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";

const QuickStatsWidget = ({ data }) => {
  return (
    <Box display="flex" gap={1.5}>
      {data.map((item, index) => (
        <WidgetWrapper
          key={index}
          elevation={3}
          sx={{
            padding: "1.25rem 1.25rem",
            minWidth: "160px",
            borderRadius: "0.25rem",
            width: "100%",
          }}
        >
          <Typography variant="subtitle" color="text.secondary">
            {item.label}
          </Typography>
          <Typography variant="h3" marginTop="0.5rem" fontWeight="semi-bold">
            {item.value}
          </Typography>
        </WidgetWrapper>
      ))}
    </Box>
  );
};

export default QuickStatsWidget;
