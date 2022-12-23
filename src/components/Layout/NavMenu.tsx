import { ButtonBase, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { getAuth, signOut } from "firebase/auth";
import React, { useCallback, useEffect } from "react";
import { GoSignOut } from "react-icons/go";
import { MdSchool } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackBar } from "../../utils/SnackbarContext";
import { useUser } from "../../utils/UserContext";
import { MenuTab } from "./menuTabs";
import NavMenuItem from "./NavMenuItem";

interface Props {
  tabs: MenuTab[] | undefined;
}

export const HIDE_MENU_ROUTES = ["create-campaigns"];

export default React.memo(NavMenu);

function NavMenu(props: Props) {
  const { tabs } = props;

  const classes = useStyles();
  const user = useUser();
  // const permissions = user.user?.permissions
  const location = useLocation();
  const navigate = useNavigate();
  const alert = useSnackBar();
  useEffect(() => {
    if (tabs?.[0]?.path && location.pathname === "/") {
      navigate(tabs?.[0]?.path!);
    }
  }, [location.pathname, navigate, tabs]);

  const auth = getAuth();

  const logout = useCallback(() => {
    signOut(auth).then(() => {
      alert.show("Logged out", "success");
    });
  }, [alert, auth]);
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <MdSchool size={40} className={classes.logo} />

        <div className={classes.tabsContainer}>
          {tabs?.map((tab, idx) => {
            return <NavMenuItem idx={idx} tab={tab} key={idx} />;
          })}
        </div>

        <div className={classes.userInfo}>
          <div className={classes.userInfoItems}>
            <Typography className={classes.nameTypography}>
              {user?.fullName}
            </Typography>
            <Typography className={classes.nameTypography}>
              {user._id}
            </Typography>
          </div>

          <ButtonBase onClick={logout} className={classes.logoutBase}>
            <GoSignOut className={classes.logout} />
          </ButtonBase>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    flex: 1,
    background: theme.palette.background.default,

    borderRight: `1px solid ${theme.palette.divider}`,
    userSelect: "none",
    display: "flex",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    borderLeft: theme.palette.divider,
    flex: 1,
  },
  logo: {
    pointerEvents: "none",
    userSelect: "none",
    width: "100%",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
    color: theme.palette.primary.main,
  },
  avatar: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: 16,
    marginBottom: 4,
  },
  address: {
    color: theme.palette.text.secondary,
    fontSize: 11,
    marginBottom: 16,
  },
  tabsContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    overflowY: "auto",
    overflowX: "hidden",
  },
  userContainer: {
    display: "flex",
    alignItems: "center",
  },
  userAvatar: {
    height: 40,
    width: 40,
    marginRight: 2,
    borderRadius: 8,
  },
  nameContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
  email: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  settingsButton: {
    height: 40,
    width: 40,
    padding: 0,
    fontSize: 22,
  },
  menuContent: {
    width: 200,
    display: "flex",
    flexDirection: "column",
    outline: "none",
  },
  userInfo: {
    width: "calc(100% - 32px)",
    alignItems: "center",
    display: "flex",
    margin: "0px 16px",
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingBlock: theme.spacing(2),
  },
  userInfoItems: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logoutBase: {
    padding: 8,
    borderRadius: 8,
  },
  AiFillShopContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    background: theme.palette.text.primary,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 8,
    marginRight: 8,
  },
  nameTypography: {
    display: "flex",
    fontSize: 16,
    fontWeight: 500,
  },
  typeTypography: {
    display: "flex",
    fontSize: 11,
    color: theme.palette.text.hint,
  },
  logout: {
    fontSize: 20,
    color: theme.palette.error.main,
  },
  menu: {
    width: 240,
  },
  dialog: {
    width: 480,
    height: 560,
    padding: 16,
  },
  passwordDialog: {
    width: 480,
    height: 352,
    padding: 16,
  },
}));
export function cfl(str: string) {
  let name = "";
  const arr = str.split(" ");
  arr.forEach((s, i) => {
    const upper = s.charAt(0).toUpperCase() + s.slice(1);
    name += upper + (arr.length - 1 === i ? "" : " ");
  });
  return name;
}
