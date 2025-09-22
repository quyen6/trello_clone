import { extendTheme } from "@mui/material/styles";

const APP_BAR_HEIGHT = "58px";
const BOARD_BAR_HEIGHT = "60px";
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "56px";

const theme = extendTheme({
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT,
  },
  // colorSchemes: {
  //   light: {
  //     palette: {
  //       mode: "light",
  //     },
  //   },
  //   dark: {
  //     palette: {
  //       mode: "dark",
  //     },
  //   },
  // },
  colorSchemeSelector: "class",

  // ... other properties
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: 6,
            height: 6,
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#95afc0",
            borderRadius: 4,
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#eee",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-body1": {
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",

          "& fieldset": {
            borderWidth: "1px !important",
          },
          "&:hover fieldset": {
            borderWidth: "2px !important",
          },
          "&.Mui-focused fieldset": {
            borderWidth: "2px !important",
          },
        },
      },
    },
  },
});

export default theme;
