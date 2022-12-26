import { IconButton, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { db } from "../../../firebase";
import { Assignments } from "../../../types/assignmentTypes";
import { Submissions } from "../../../types/submissionTypes";
import { Users } from "../../../types/userTypes";
import Loading from "../../Loading";

interface Props {
  closeDialog: () => void;
  assignment: Assignments;
}

export default React.memo(GradesDialog);
interface Subs extends Submissions {
  id: string;
  grade: number;
}
function GradesDialog(props: Props) {
  const { assignment, closeDialog } = props;

  const classes = useStyles();

  const [submissions, setSubmissions] = React.useState<Subs[] | null>(null);
  const [studentsInCourse, setStudentsInCourse] = React.useState<
    Users[] | null
  >(null);
  useEffect(() => {
    const unsub2 = db

      .collection("users")
      .where("userType", "==", "student")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            _id: doc.id,
            id: doc.id,
          } as Users & {
            id: string;
          };
        });
        setStudentsInCourse(data);
      });

    const unsub = db
      .collection("submissions")
      .where("assignment", "==", assignment._id)

      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          if (doc.data().grades.length !== assignment.amount) {
            return undefined;
          }

          const gradeReducer = doc
            .data()
            .grades.map((x: any) => {
              return x.grade;
            })
            .reduce((a: any, b: any) => a + b, 0);
          const grade =
            doc.data().objection?.status !== "none"
              ? doc.data().objection?.grade > 100
                ? 100
                : doc.data().objection?.grade
              : gradeReducer > 100
              ? 100
              : gradeReducer;

          return {
            ...doc.data(),
            _id: doc.id,
            id: doc.id,
            grade: grade > 100 ? 100 : grade,
          } as Subs;
        });
        setSubmissions(data.filter((x) => x !== undefined) as Subs[]);
      });
    return () => {
      unsub2();
      unsub();
    };
  }, [assignment._id, assignment.amount, assignment.course]);
  console.log(submissions);
  if (!assignment || !submissions) return <Loading />;
  if (submissions.length === 0)
    return (
      <>
        <div className={classes.dialogTitleContainer}>
          <Typography className={classes.dialogTitle}>Grades</Typography>
          <IconButton onClick={closeDialog}>
            <MdClose />
          </IconButton>
        </div>
        <Typography className={classes.noObjections}>No grades!</Typography>
      </>
    );
  return (
    <>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>Grades</Typography>
        <IconButton onClick={closeDialog}>
          <MdClose />
        </IconButton>
      </div>
      <div className={classes.dialogContent}>
        {submissions.map((submission, i) => {
          return (
            <div key={submission._id} className={classes.studentContainer}>
              <Typography className={classes.numberText}>
                {
                  studentsInCourse?.find((x) => x._id === submission.student)
                    ?.number!
                }
              </Typography>
              <Typography className={classes.studentText}>
                {
                  studentsInCourse?.find((x) => x._id === submission.student)
                    ?.fullName!
                }
              </Typography>
              <Typography className={classes.gradeText}>
                {`${submission.grade}/${assignment.maxGrade}`}
              </Typography>
            </div>
          );
        })}
      </div>
    </>
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
  dialogTitleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dialogTitle: {
    fontWeight: 500,
    fontSize: 20,
    color: theme.palette.text.primary,
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  noObjections: {
    width: "100%",
    fontWeight: 600,
    textAlign: "center",
    marginTop: 8,
    boxSizing: "border-box",
    fontSize: 20,
  },
  studentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 32,
    marginBottom: 8,
    "&:last-child": {
      marginBottom: 0,
    },
  },
  numberText: {
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.text.secondary,
    flex: 1,
    textAlign: "center",
  },
  studentText: {
    fontSize: 16,
    color: theme.palette.text.primary,
    flex: 1,
    textAlign: "center",
  },
  gradeText: {
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.text.primary,
    flex: 1,
    textAlign: "center",
  },
  dialog: {
    minWidth: 600,
    padding: 16,
  },
}));
