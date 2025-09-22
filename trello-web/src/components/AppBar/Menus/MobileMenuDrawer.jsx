import { Box, Drawer, Button, useMediaQuery } from "@mui/material";
import Workspaces from "./Workspaces";
import Recent from "./Recent";
import Starred from "./Starred";
import Templates from "./Templates";
import ModeSwitcher from "~/components/ModeSwitcher/ModeSwitcher";

import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
const MobileMenuDrawer = (props) => {
  const { resolvedMode, isMdDown } = props;
  const { open, setOpen } = props;
  const isSmUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <>
      {isMdDown && (
        <Drawer
          anchor="left"
          open={open}
          aria-hidden="false"
          onClose={() => {
            setOpen(false);
          }}
        >
          <Box
            sx={{
              width: 200,
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor:
                resolvedMode === "light" ? "rgb(0, 134, 137)" : "#2d3436",
            }}
            onClick={() => setOpen(false)}
          >
            <Workspaces isMdDown={isMdDown} />
            <Recent isMdDown={isMdDown} />
            <Starred isMdDown={isMdDown} />
            <Templates isMdDown={isMdDown} />
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                width: "50%",
                border: "none",
              }}
              startIcon={<AddToPhotosIcon />}
            >
              Create
            </Button>
            {!isSmUp && <ModeSwitcher />}
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default MobileMenuDrawer;
