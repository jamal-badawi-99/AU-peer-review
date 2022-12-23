import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuTab } from "./menuTabs";

interface Props {
  tab: MenuTab;
  idx: number;
}

export default React.memo(NavMenuItem);

function NavMenuItem(props: Props) {
  const { tab, idx } = props;

  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const selected = useMemo(
    () => tab.path && location.pathname.includes(tab.path),
    [location.pathname, tab.path]
  );

  const onClick = useCallback(() => navigate(tab.path!), [navigate, tab.path]);

  return (
    <div
      onClick={selected ? undefined : onClick}
      className={classNames({
        [classes.navItem]: true,
        [classes.firstItem]: idx === 0,
        [classes.selected]: selected,
        [classes.hover]: !selected,
      })}
    >
      <tab.icon className={classes.icon} />
      <Typography className={classes.itemText}>{tab.title}</Typography>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  navItem: {
    height: 40,
    minHeight: 40,
    width: "calc(100% - 32px)",
    display: "flex",
    alignItems: "center",
    margin: "0px 16px",
    marginBottom: 16,
    borderRadius: 4,
    userSelect: "none",
    transition: theme.transitions.create("background"),
  },
  firstItem: {
    marginTop: 8,
  },
  icon: {
    color: theme.palette.text.secondary,
    fontSize: 22,
    marginRight: 16,
    marginLeft: 12,
    transition: theme.transitions.create("color"),
  },
  itemText: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    fontWeight: 600,
    transition: theme.transitions.create("color"),
  },
  selected: {
    background: theme.palette.action.selected,
    "& $icon": {
      color: theme.palette.primary.main,
    },
    "& $itemText": {
      color: theme.palette.primary.main,
    },
  },
  hover: {
    cursor: "pointer",
    "&:hover": { background: theme.palette.action.hover },
    "&:active": { background: theme.palette.action.selected },
  },
}));
