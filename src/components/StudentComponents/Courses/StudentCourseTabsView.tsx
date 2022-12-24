import { Tab, Tabs } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../../firebase";
import { Courses } from "../../../types/courseTypes";
import Loading from "../../Loading";
import HeaderWithButton from "../../Reusables/HeaderWithButton";
import TabPanel from "../../Reusables/TabPanel";
import CourseInfo from "./CourseInfo";
import CourseStudents from "./CourseStudents";
import StudentsCourseAssignments from "./StudentsCourseAssignments";

export default React.memo(StudentCourseTabsView);

function StudentCourseTabsView() {
  const classes = useStyles();
  const location = useLocation();
  const [course, setCourse] = React.useState<Courses | null>(null);
  React.useEffect(() => {
    console.log(location.pathname);
    db.collection("courses")
      .doc(location.pathname.split("/")[2])
      .onSnapshot((snapshot) => {
        const data = {
          _id: snapshot.id,
          ...snapshot.data(),
        } as Courses;

        setCourse(data);
      });
  }, [location.pathname]);

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  if (course === null) {
    return <Loading />;
  }
  return (
    <div className={classes.container}>
      <HeaderWithButton title={course.title} backButton />
      <Tabs
        value={value}
        onChange={handleChange}
        classes={{ scroller: classes.scroller }}
      >
        <Tab label="Information" />
        <Tab label="Students" />
        <Tab label="Assignments" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <CourseInfo course={course} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CourseStudents course={course} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <StudentsCourseAssignments course={course} />
      </TabPanel>
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
  },
  content: {
    display: "flex",
    flexDirection: "column",
    // flexGrow: 1,
    overflow: "auto",
    paddingBlock: theme.spacing(2),

    paddingInline: theme.spacing(64),

    [theme.breakpoints.down("lg")]: {
      paddingInline: theme.spacing(48),
    },

    [theme.breakpoints.down("md")]: {
      paddingInline: theme.spacing(32),
    },
    [theme.breakpoints.down("sm")]: {
      paddingInline: theme.spacing(16),
    },
    [theme.breakpoints.down("xs")]: {
      paddingInline: theme.spacing(8),
    },
  },
  courseContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: theme.spacing(2),
    border: "1px solid #ccc",
    borderRadius: 4,
    marginBottom: theme.spacing(2),
  },
  scroller: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
}));
