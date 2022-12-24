import { IconButton, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { db } from "../../../../firebase";
import { Assignments } from "../../../../types/assignmentTypes";
import { Submissions } from "../../../../types/submissionTypes";
import { useUser } from "../../../../utils/UserContext";
import Loading from "../../../Loading";
import { scrollBarStyle } from "../../../UserComponents/UserProfile";
interface Props {
  onClose: () => void;
  assignmentId: string;
  submissionId: string;
}

export default React.memo(GradeAssignmentDialog);

function GradeAssignmentDialog(props: Props) {
  const { assignmentId, onClose, submissionId } = props;

  const classes = useStyles();
  const user = useUser();
  const [assignment, setAssignment] = React.useState<Assignments | null>(null);
  const [submission, setSubmission] = React.useState<Submissions | null>(null);

  useEffect(() => {
    const unsub = db
      .collection("submissions")
      .doc(submissionId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data() as Submissions;
          setSubmission(data);
        }
      });
    const unsub2 = db
      .collection("assignments")
      .doc(assignmentId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data() as Assignments;
          setAssignment(data);
        }
      });

    return () => {
      unsub();
      unsub2();
    };
  }, [assignmentId, submissionId]);

  if (!submission || !assignment) return <Loading />;
  const whog = assignment.whoGraded
    ? assignment.whoGraded![user._id]
      ? assignment.whoGraded![user._id].length
      : 0
    : 0;
  const grade = submission.grades
    .map((x) => {
      return x.grade;
    })
    .reduce((a, b) => a + b, 0);
  return (
    <>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>
          Assignment Grade
        </Typography>
        <IconButton onClick={onClose}>
          <MdClose />
        </IconButton>
      </div>
      {assignment.whoGrades![user._id].length! === whog ? (
        submission.grades.length !== assignment.amount ? (
          <div className={classes.dialogContent}>
            <div className={classes.noGradeContainer}>
              <Typography className={classes.noGradeText}>
                Your grade is not ready yet
              </Typography>
              <Typography
                className={classes.noGradeText}
                style={{ marginTop: 8 }}
              >
                You need to wait until all students have graded your assignment
              </Typography>
            </div>
          </div>
        ) : (
          <div className={classes.dialogContent}>
            <div className={classes.noGradeContainer}>
              <Typography className={classes.GradeText}>
                Your Grade is:{" "}
              </Typography>
              <Typography
                className={
                  grade > assignment.passingGrade
                    ? classes.passed
                    : classes.failed
                }
              >
                {grade > assignment.maxGrade ? assignment.maxGrade : grade}{" "}
                {"/"} {assignment.maxGrade}
              </Typography>
            </div>
          </div>
        )
      ) : (
        <div className={classes.dialogContent}>
          <div className={classes.noGradeContainer}>
            <Typography className={classes.noGradeText}>
              You have not graded all required students yet!
            </Typography>
          </div>
        </div>
      )}
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
  dialogActions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  additionalFiles: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gridGap: 16,
    overflow: "auto",
    maxHeight: 150,
    boxSizing: "border-box",
    ...scrollBarStyle,
  },
  additionalLabel: {
    fontSize: 16,
    color: theme.palette.text.secondary,
  },

  fileTypesLabel: {
    fontSize: 13,
    color: theme.palette.text.hint,
    marginInlineStart: 6,
  },
  labelsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  fileContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    padding: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    width: 120,
    height: 120,
    justifySelf: "center",
  },
  fileName: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.text.primary,
    wordBreak: "break-all",
    textOverflow: "ellipsis",
    overflow: "hidden !important",
    whiteSpace: "nowrap",
    maxWidth: 70,
  },

  fileType: {
    fontSize: 14,
    fontWeight: 500,

    color: theme.palette.text.primary,
  },
  removeFileButton: {
    padding: 4,
    position: "absolute",
    top: 0,
    right: 0,
  },
  nameType: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 8,
  },
  img: {
    position: "absolute",
    top: 30,
    left: 35,
    color: theme.palette.info.main,
  },
  pdf: {
    position: "absolute",
    top: 30,
    left: 35,
    color: theme.palette.error.main,
  },
  noGradeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  noGradeText: {
    fontSize: 18,
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  GradeText: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  passed: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.palette.success.main,
    marginBottom: 16,
  },
  failed: {
    fontSize: 24,
    fontWeight: 600,
    color: theme.palette.error.main,
    marginBottom: 16,
  },
}));
