import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfirmProvider } from "material-ui-confirm";
// Cấu hình Redux
import { Provider } from "react-redux";
import { store } from "~/redux/store.js";
// Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from "react-router-dom";

// Cấu hình Redux-Persist
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
const persistor = persistStore(store);

// Kỹ thuật Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from "./utils/authorizeAxios.js";
injectStore(store);

createRoot(document.getElementById("root")).render(
  <>
    <InitColorSchemeScript attribute="class" defaultMode="light" />
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter basename="/" future={{ v7_startTransition: true }}>
          <ThemeProvider theme={theme} attribute="class">
            <ConfirmProvider
              defaultOptions={{
                allowClose: false,
                confirmationText: "OK",
                cancellationText: "CANCLE",
                confirmationButtonProps: {
                  color: "error",
                  variant: "outlined",
                },
                cancellationButtonProps: { color: "inherit" },
              }}
            >
              <GlobalStyles styles={{ a: { textDecoration: "none" } }} />
              <CssBaseline />

              <App />

              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </ConfirmProvider>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>
);
