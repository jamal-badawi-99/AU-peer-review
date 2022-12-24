import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { Courses } from "../../../types/courseTypes";

interface Props {
  course: Courses;
}

export default React.memo(CourseInfo);

function CourseInfo(props: Props) {
  const { course } = props;

  const classes = useStyles();
  console.log(course);
  return (
    <div className={classes.container}>
      <div className={classes.items}>
        <Typography className={classes.label}>Title</Typography>
        <Typography className={classes.itemDescription}>
          {course.title}
        </Typography>

        <Typography className={classes.label}>Lecturer</Typography>
        <Typography className={classes.itemDescription}>
          {course.lecturerName}
        </Typography>
        <Typography className={classes.label}>Students Count</Typography>
        <Typography className={classes.itemDescription}>
          {course.students ? course.students.length : 0}
        </Typography>
        <Typography className={classes.label}>Assignments Count</Typography>
        <Typography className={classes.itemDescription}>
          {course.assignments ? course.assignments.length : 0}
        </Typography>
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
    overflow: "hidden",
    paddingTob: 24,
    alignItems: "center",
  },
  items: {
    display: "flex",

    flexDirection: "column",
    width: "100%",
    maxWidth: 500,
    margin: 24,
    padding: 24,
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
    border: "1px solid #E5E5E5",
  },
  label: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  itemDescription: {
    fontSize: 28,
    fontWeight: 400,
    color: theme.palette.text.primary,
    marginBottom: 24,
    marginTop: 4,
    marginInline: 8,
    "&:last-child": {
      marginBottom: 0,
    },
  },
}));
