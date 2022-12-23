import { Button, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { IconType } from "react-icons";

interface Props {
  button?: {
    text: string;
    onClick: () => void;
    icon?: IconType;
  };
  title: string;
}

export default React.memo(HeaderWithButton);

function HeaderWithButton(props: Props) {
  const { button, title } = props;

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography className={classes.title}>{title}</Typography>
      {button && (
        <Button
          className={classes.button}
          onClick={button.onClick}
          variant="contained"
          color="primary"
          startIcon={button.icon && <button.icon />}
        >
          {button.text}
        </Button>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 24,
    width: "100%",
    paddingBlock: theme.spacing(3),
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginInline: theme.spacing(2),
  },
  button: {
    height: 40,
    minWidth: 140,
    maxWidth: "100%",
    marginInline: theme.spacing(2),
  },
}));
