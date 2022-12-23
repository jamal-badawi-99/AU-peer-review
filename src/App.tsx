import MomentUtils from "@date-io/moment";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import "./App.css";
import "./firebase";
import Router from "./Router";
import { SnackBarContextProvider } from "./utils/SnackbarContext";
import { theme } from "./utils/theme";
import { UserContextProvider } from "./utils/UserContext";
function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <SnackBarContextProvider>
          <UserContextProvider>
            <Router />
          </UserContextProvider>
        </SnackBarContextProvider>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
