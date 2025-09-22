import { useColorScheme } from "@mui/material/styles";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

const ModeSwitcher = () => {
  const { mode, setMode } = useColorScheme();
  const handleSetMode = (event) => {
    setMode(event.target.value);
  };

  if (!mode) return null;

  return (
    <FormControl sx={{ m: 0, minWidth: 100 }} size="small">
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={mode}
        onChange={handleSetMode}
        sx={{
          color: "white",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          ".MuiSvgIcon-root": {
            color: "white",
          },
        }}
      >
        <MenuItem value="light">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LightModeIcon fontSize="small" />
            &nbsp; <span sx={{ fontSize: "1.2rem" }}>Light</span>
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DarkModeIcon fontSize="small" /> &nbsp;{" "}
            <span sx={{ fontSize: "1.2rem" }}>Dark</span>
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SettingsBrightnessIcon fontSize="small" /> &nbsp;{" "}
            <span sx={{ fontSize: "1.2rem" }}>System</span>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default ModeSwitcher;
