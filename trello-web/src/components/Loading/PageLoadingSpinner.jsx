import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { useOutletContext } from "react-router-dom";

const PageLoadingSpinner = ({ caption }) => {
  const { resolvedMode } = useOutletContext();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: resolvedMode === "dark" ? "#34495e" : "",
        color: resolvedMode === "dark" ? "white" : "",
      }}
    >
      <CircularProgress
        sx={{ mr: 2, color: resolvedMode === "dark" ? "white" : "" }}
      />
      <i>{caption}</i>
    </Box>
  );
};

export default PageLoadingSpinner;
