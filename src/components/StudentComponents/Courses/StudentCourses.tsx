import { ButtonBase } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { Courses } from "../../../types/courseTypes";
import { useUser } from "../../../utils/UserContext";
import Loading from "../../Loading";
import HeaderWithButton from "../../Reusables/HeaderWithButton";
import { scrollBarStyle } from "../../UserComponents/UserProfile";
import { ItemWithLabel } from "./Dialogs/GradeOthersAssignmentDialog";

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
      <div
        className={classes.content}
        style={{
          gridTemplateColumns: `repeat(${
            courses.length > 3 ? 3 : courses.length
          },300px)`,
        }}
      >
        {courses.map((course) => (
          <ButtonBase
            className={classes.courseContainer}
            key={course._id}
            onClick={() => navigate(`/student-courses/${course._id}`)}
          >
            <ItemWithLabel label="Course Title" value={course.title} />
            <ItemWithLabel label="Lecturer" value={course.lecturerName} />
            <ItemWithLabel
              label="Students count"
              value={course.students ? course.students.length.toString() : "0"}
            />
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
    boxSizing: "border-box",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    boxSizing: "border-box",
    display: "grid",
    ...scrollBarStyle,
    gridGap: theme.spacing(2),

    overflow: "auto",
    paddingBlock: theme.spacing(2),
  },
  courseContainer: {
    display: "flex",
    flexDirection: "column",
    width: 300,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: theme.spacing(2),
    border: "1px solid #e5e5e5",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",

    marginBottom: theme.spacing(2),
  },
}));
