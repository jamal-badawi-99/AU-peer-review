import { ButtonBase, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { Courses } from "../../../types/courseTypes";
import { useUser } from "../../../utils/UserContext";
import Loading from "../../Loading";
import HeaderWithButton from "../../Reusables/HeaderWithButton";

export default React.memo(LecturerCourses);

function LecturerCourses() {
  const user = useUser();
  const classes = useStyles();
  const [courses, setCourses] = React.useState<Courses[] | null>(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    const cleanup = db
      .collection("courses")
      .where("students", "array-contains", user?._id)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return {
            _id: doc.id,
            ...doc.data(),
          } as Courses;
        });
        setCourses(data);
      });
    return () => cleanup();
  }, [user?._id]);

  if (courses === null) {
    return <Loading />;
  }
  return (
    <div className={classes.container}>
      <HeaderWithButton title="Courses" />
      <div className={classes.content}>
        {courses.map((course) => (
          <ButtonBase
            className={classes.courseContainer}
            key={course._id}
            onClick={() => navigate(`/student-courses/${course._id}`)}
          >
            <Typography>{course.title}</Typography>
            <Typography>{course.lecturerName}</Typography>
            <Typography>
              {course.students ? course.students.length : 0}
            </Typography>
          </ButtonBase>
        ))}
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
    border: "1px solid #e5e5e5",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",

    marginBottom: theme.spacing(2),
  },
}));
