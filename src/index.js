import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/app";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import reducers from "./store/reducers";
import ReduxPromise from "redux-promise";
import WebFont from "webfontloader";
import "./styles/syp.scss";
import { createTheme, ThemeProvider, CssBaseline } from "@material-ui/core";
/* load fonts */
 WebFont.load({
  google: {
    families: [
      "Montserrat:wght@100;200;300;400;500;600;700;800;900"
    ],
  },
});
/* redux dev tools see your store in dev tools */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(ReduxPromise))
);

/* Change these settings if you want to change the theme of the project */
const theme = createTheme({
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none",
        fontFamily: "Montserrat , Open Sans, sans-serif",
      },
    },
    MuiTypography: {
      h6: {
        fontFamily: "Montserrat, Open Sans, sans-serif",
      },
      h5: {
        fontFamily: "Montserrat, Open Sans, sans-serif",
      },
      h3: {
        fontFamily: "Montserrat, Open Sans, sans-serif",
      },
      h2: {
        fontFamily: "Montserrat, Open Sans, sans-serif",
      },
      caption: {
        fontFamily: "Montserrat, Open Sans, sans-serif",
      },
      body1: {
        fontFamily: "Montserrat, Open Sans, sans-serif",
      },
    },
    MuiFormLabel: {
      root: {
        fontSize: "0.875rem",
      },
    },
    MuiInputBase: {
      root: {
        fontSize: "0.875rem",
      },
    },
    typography: {
      fontFamily: "Montserrat, Open Sans, sans-serif",
    },
  },
  palette: {
    primary: {
      main: "#1a5749",
    },
    secondary: {
      main: "#095480",
    },
  },
});
ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
