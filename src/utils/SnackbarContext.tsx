import { Snackbar } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import React, { createContext, useContext } from "react";

type SnackBarContextActions = {
  show: (text: string, typeColor: Color) => void;
};

const SnackBarContext = createContext({} as SnackBarContextActions);

interface SnackBarContextProviderProps {
  children: React.ReactNode;
}

const SnackBarContextProvider: React.FC<SnackBarContextProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [typeColor, setTypeColor] = React.useState<Color>("info");

  const show = (text: string, color: Color) => {
    setMessage(text);
    setTypeColor(color);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTypeColor("info");
  };

  return (
    <SnackBarContext.Provider value={{ show }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={typeColor}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </SnackBarContext.Provider>
  );
};

const useSnackBar = (): SnackBarContextActions => {
  const context = useContext(SnackBarContext);

  if (!context) {
    throw new Error(
      "useSnackBar must be used within an SnackBarContextProvider"
    );
  }

  return context;
};

export { SnackBarContextProvider, useSnackBar };
