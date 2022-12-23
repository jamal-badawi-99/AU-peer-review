import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useUser } from "../../../utils/UserContext";
import HeaderWithButton from "../../Reusables/HeaderWithButton";
import UserProfilePasswords from "./UserProfilePasswords";
export default React.memo(UserProfile);

function UserProfile() {
  const classes = useStyles();
  const user = useUser();

  return (
    <div className={classes.container}>
      <HeaderWithButton title={"Profile"} />
      <div className={classes.content}>
        <div className={classes.EditContent}>
          <UserProfilePasswords />
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",

    overflow: "hidden",
  },
  content: {
    paddingTop: theme.spacing(4),
    display: "flex",
    flexDirection: "row",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  profileCard: {
    marginInlineStart: theme.spacing(32),
    width: 592,
    height: 386,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    background: theme.palette.background.default,
    boxShadow: theme.shadows[8],
  },
  EditContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "96%",
    overflow: "auto",
    marginInlineStart: theme.spacing(4),
    marginInlineEnd: theme.spacing(32),
    marginBotom: theme.spacing(4),
    boxSizing: "border-box",
    ...scrollBarStyle,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginTop: theme.spacing(2),
  },
  birthDate: {
    fontSize: 16,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
  },
  email: {
    fontSize: 18,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
  },
  avatarContainer: {
    position: "relative",
  },
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: theme.palette.background.paper,
    borderRadius: "50%",
    padding: theme.spacing(1),
    boxShadow: theme.shadows[8],
    transition: theme.transitions.create("all", { duration: 200 }),
    "&:hover": {
      background: theme.palette.background.default,
    },
  },
  check: {
    position: "absolute",
    top: 0,
    right: 0,
    background: theme.palette.success.main,
    borderRadius: "50%",
    padding: theme.spacing(1),
    boxShadow: theme.shadows[8],
    transition: theme.transitions.create("all", { duration: 200 }),
    "&:hover": {
      background: theme.palette.success.dark,
    },
  },
  reset: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: theme.palette.error.main,
    borderRadius: "50%",
    padding: theme.spacing(1),
    boxShadow: theme.shadows[8],
    transition: theme.transitions.create("all", { duration: 200 }),
    "&:hover": {
      background: theme.palette.error.dark,
    },
  },
  removePic: {
    position: "absolute",
    top: 0,
    right: 0,
    background: theme.palette.error.main,
    borderRadius: "50%",
    padding: theme.spacing(1),
    boxShadow: theme.shadows[8],
    transition: theme.transitions.create("all", { duration: 200 }),
    "&:hover": {
      background: theme.palette.error.dark,
    },
  },
  iconColor: {
    color: theme.palette.background.paper,
  },
  editSection: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: theme.palette.background.default,
    borderRadius: 8,
    boxShadow: theme.shadows[8],
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    boxSizing: "border-box",
  },
  sectionTitle: {
    fontSize: 20,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  CoupleTF: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },

  saveButton: {
    position: "absolute",
    bottom: theme.spacing(4),
    right: theme.spacing(32),
  },
}));

export const phoneNumberRegex =
  /^\+[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

export const scrollBarStyle = {
  "&::-webkit-scrollbar": {
    width: "5px",
  },

  "&::-webkit-scrollbar-thumb": {
    background: "rgba(55, 65, 81, 0.48)",
    borderRadius: 8,
  },
};
