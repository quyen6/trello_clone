import { Container, useColorScheme } from "@mui/material";
import AppBar from "./components/AppBar/AppBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { mode } = useColorScheme();
  const resolvedMode =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: light)").matches
        ? "dark"
        : "light"
      : mode;
  const colorTextMain = resolvedMode === "dark" ? "white" : "#000000";

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      {/* AppBar xuất hiện xuyên suốt */}
      <AppBar resolvedMode={resolvedMode} />
      {/* Chỗ này render các page con */}
      <Outlet context={{ resolvedMode, colorTextMain }} />
    </Container>
  );
};

export default MainLayout;
