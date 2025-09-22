import { Chip, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PublicIcon from "@mui/icons-material/Public";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FilterListIcon from "@mui/icons-material/FilterList";

import { capitalizeFirstLetter } from "~/utils/formatter";

import { useOutletContext } from "react-router-dom";
import BoardUserGroup from "./BoardUserGroup";
import InviteBoardUser from "./InviteBoardUser";
const MENU_STYLES = {
  color: "#000",
  bgcolor: "#bae2e2",
  border: "none",
  // boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 7px 0px",
  paddingX: "5px",
  borderRadius: "4px",
  "& .MuiSvgIcon-root": {
    color: "rgb(0, 134, 137)",
  },
  "&:hover": {
    backgroundColor: "primary.50",
  },
};
const BoardBar = (props) => {
  const { board } = props;
  const { resolvedMode, colorTextMain } = useOutletContext();

  return (
    <Box
      px={2}
      sx={{
        // backgroundColor: "primary.dark",
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        // borderBottom: "1px solid #00bfa5",
        // marginBottom: 1,
        backgroundColor: resolvedMode === "dark" ? "#34495e" : "#f5f7fa",
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: resolvedMode === "dark" ? "#eee" : "#01a3a4",
        },
        "&::-webkit-scrollbar-track": { m: 2 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={{
              ...MENU_STYLES,
              bgcolor: resolvedMode === "dark" ? "#1c2a4094" : "#bae2e2",
              color: colorTextMain,

              "& .MuiSvgIcon-root": {
                color: resolvedMode === "dark" ? "#fff" : "rgb(0, 134, 137)",
              },
              // boxShadow:
              //   resolvedMode === "dark"
              //     ? "rgba(255, 255, 255, 0.4) 0px 0px 7px 0px"
              //     : "rgba(0, 0, 0, 0.2) 0px 0px 7px 0px",
            }}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={{
            ...MENU_STYLES,
            bgcolor: resolvedMode === "dark" ? "#1c2a4094" : "#bae2e2",
            color: colorTextMain,
            "& .MuiSvgIcon-root": {
              color: resolvedMode === "dark" ? "#fff" : "rgb(0, 134, 137)",
            },
            // boxShadow:
            //   resolvedMode === "dark"
            //     ? "rgba(255, 255, 255, 0.4) 0px 0px 7px 0px"
            //     : "rgba(0, 0, 0, 0.2) 0px 0px 7px 0px",
          }}
          icon={<PublicIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={{
            ...MENU_STYLES,
            bgcolor: resolvedMode === "dark" ? "#1c2a4094" : "#bae2e2",
            color: colorTextMain,
            "& .MuiSvgIcon-root": {
              color: resolvedMode === "dark" ? "#fff" : "rgb(0, 134, 137)",
            },
            // boxShadow:
            //   resolvedMode === "dark"
            //     ? "rgba(255, 255, 255, 0.4) 0px 0px 7px 0px"
            //     : "rgba(0, 0, 0, 0.2) 0px 0px 7px 0px",
          }}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip
          sx={{
            ...MENU_STYLES,
            bgcolor: resolvedMode === "dark" ? "#1c2a4094" : "#bae2e2",
            color: colorTextMain,
            "& .MuiSvgIcon-root": {
              color: resolvedMode === "dark" ? "#fff" : "rgb(0, 134, 137)",
            },
            // boxShadow:
            //   resolvedMode === "dark"
            //     ? "rgba(255, 255, 255, 0.4) 0px 0px 7px 0px"
            //     : "rgba(0, 0, 0, 0.2) 0px 0px 7px 0px",
          }}
          icon={<ElectricBoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={{
            ...MENU_STYLES,
            bgcolor: resolvedMode === "dark" ? "#1c2a4094" : "#bae2e2",
            color: colorTextMain,
            "& .MuiSvgIcon-root": {
              color: resolvedMode === "dark" ? "#fff" : "rgb(0, 134, 137)",
            },
            // boxShadow:
            //   resolvedMode === "dark"
            //     ? "rgba(255, 255, 255, 0.4) 0px 0px 7px 0px"
            //     : "rgba(0, 0, 0, 0.2) 0px 0px 7px 0px",
          }}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/*  Xử lý mời user vào làm thành viên của board */}
        <InviteBoardUser boardId={board._id} />

        {/* Xử ly hiển thị danh sách thành viên của board */}
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  );
};

export default BoardBar;
