import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";

export default React.memo(Loading);

function Loading() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <CircularProgress size={60} color="primary" />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));
