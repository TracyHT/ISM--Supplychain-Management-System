import React from "react";
import { Box, Typography } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";

const QuickStatsWidget = ({ data }) => {
  return (
    <Box display="flex" gap={2}>
      {data.map((item, index) => (
        <WidgetWrapper
          key={index}
          elevation={3}
          sx={{
            padding: "1rem",
            minWidth: "160px",
          }}
        >
          <Typography variant="subtitle2" color="text.primary" mb="0.25rem">
            {item.label}
          </Typography>
          <Typography variant="h5">{item.value}</Typography>
        </WidgetWrapper>
      ))}
    </Box>
  );
};

export default QuickStatsWidget;
