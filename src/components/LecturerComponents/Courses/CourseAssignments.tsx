import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { Courses } from "../../../types/courseTypes";

interface Props {
  course: Courses;
}

export default React.memo(CourseAssignments);

function CourseAssignments(props: Props) {
  const { course } = props;

  const classes = useStyles();

  return <div className={classes.container}></div>;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
}));
