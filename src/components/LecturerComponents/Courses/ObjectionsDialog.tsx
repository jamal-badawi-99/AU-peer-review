import { Button, Dialog, IconButton, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { db } from "../../../firebase";
import useBoolean from "../../../hooks/useBoolean";
import { Assignments } from "../../../types/assignmentTypes";
import { Submissions } from "../../../types/submissionTypes";
import Loading from "../../Loading";
import SubmissionDialog from "./SubmissionDialog";

interface Props {
  closeDialog: () => void;
  assignment: Assignments;
}

export default React.memo(ObjectionsDialog);

function ObjectionsDialog(props: Props) {
  const { assignment, closeDialog } = props;

  const classes = useStyles();

  const [submissions, setSubmissions] = React.useState<Submissions[] | null>(
    null
  );

  const [submissionToRegrade, setSubmissionToRegrade] =
    React.useState<Submissions | null>(null);
  const [submissionOpen, openSubmission, closeSubmission] = useBoolean();
  const onSubmissionView = (submission: Submissions) => {
    setSubmissionToRegrade(submission);
    openSubmission();
  };

  useEffect(() => {
    const unsub = db
      .collection("submissions")
      .where("assignment", "==", assignment._id)
      .where("objection.status", "==", "pending" || "resolved")

      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            _id: doc.id,
            id: doc.id,
          } as Submissions & { id: string };
        });
        setSubmissions(data);
      });
    return () => unsub();
  }, [assignment._id]);
  console.log(submissions);
  if (!assignment || !submissions) return <Loading />;
  if (submissions.length === 0)
    return (
      <>
        <div className={classes.dialogTitleContainer}>
          <Typography className={classes.dialogTitle}>Objections</Typography>
          <IconButton onClick={closeDialog}>
            <MdClose />
          </IconButton>
        </div>
        <Typography className={classes.noObjections}>No objections</Typography>
      </>
    );
  return (
    <>
      <Dialog
        open={submissionOpen}
        onClose={closeSubmission}
        classes={{
          paper: classes.dialog,
        }}
      >
        <SubmissionDialog
          submission={submissionToRegrade!}
          closeDialog={closeSubmission}
          assignment={assignment}
        />
      </Dialog>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>Objections</Typography>
        <IconButton onClick={closeDialog}>
          <MdClose />
        </IconButton>
      </div>
      <div className={classes.dialogContent}>
        {submissions.map((submission, i) => {
          return (
            <div key={submission._id} className={classes.studentContainer}>
              <Typography className={classes.studentText}>{`Student ${
                i + 1
              }`}</Typography>
              {submission?.objection?.status === "resolved" ? (
                <Button variant="contained" color="primary" disabled>
                  Resolved
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onSubmissionView(submission)}
                >
                  Regrade
                </Button>
              )}
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
    marginBottom: 8,
    "&:last-child": {
      marginBottom: 0,
    },
  },
  studentText: {
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.text.primary,
  },
  dialog:{
    minWidth: 600,
    padding:16
  }
}));
