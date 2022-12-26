import { Button, Dialog, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Timestamp } from "firebase/firestore";

import moment from "moment";
import React, { useEffect } from "react";
import { db } from "../../../firebase";
import useBoolean from "../../../hooks/useBoolean";
import { Assignments } from "../../../types/assignmentTypes";
import { Courses } from "../../../types/courseTypes";
import { Submissions } from "../../../types/submissionTypes";
import { useUser } from "../../../utils/UserContext";
import Loading from "../../Loading";
import { scrollBarStyle } from "../../UserComponents/UserProfile";
import DetailsAssignmentDialog from "./Dialogs/DetailsAssignmentDialog";
import GradeAssignmentDialog from "./Dialogs/GradeAssignmentDialog";
import GradeOthersAssignmentDialog from "./Dialogs/GradeOthersAssignmentDialog";
import SubmitAssignmentDialog from "./Dialogs/SubmitAssignmentDialog";

interface Props {
  course: Courses;
}

export default React.memo(StudentsCourseAssignments);

function StudentsCourseAssignments(props: Props) {
  const { course } = props;
  const user = useUser();
  const classes = useStyles();
  const [assignmentId, setAssignmentId] = React.useState<string | null>(null);
  const [assignment, setAssignment] = React.useState<Assignments | null>(null);
  const [submissionId, setSubmissionId] = React.useState<string | null>(null);
  const [submitOpen, openSubmit, closeSubmit] = useBoolean();
  const setSubmitOpen = (id: string) => {
    setAssignmentId(id);
    openSubmit();
  };
  const [gradeOpen, openGrade, closeGrade] = useBoolean();
  const setGradeOpen = (id: string, submitId: string) => {
    setAssignmentId(id);
    setSubmissionId(submitId);
    openGrade();
  };
  const [detailsOpen, openDetails, closeDetails] = useBoolean();
  const setDetailsOpen = (id: string) => {
    setAssignmentId(id);
    openDetails();
  };
  const [gradeOthersOpen, openGradeOthers, closeGradeOthers] = useBoolean();
  const setGradeOthersOpen = (assignment: Assignments) => {
    setAssignment(assignment);
    openGradeOthers();
  };
  const [assignments, setAssignments] = React.useState<Assignments[]>([]);
  const [submissions, setSubmissions] = React.useState<Submissions[]>([]);
  useEffect(() => {
    db.collection("assignments")
      .where("course", "==", course._id)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const ts = doc.data().deadline as Timestamp;
          return {
            ...doc.data(),
            _id: doc.id,
            id: doc.id,
            deadline: ts.toDate(),
          } as Assignments & { id: string };
        });
        setAssignments(data);
      });
    db.collection("submissions")

      .where("student", "==", user._id)
      .where("course", "==", course._id)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            _id: doc.id,
          } as Submissions;
        });
        setSubmissions(data);
      });
  }, [course._id, user._id]);
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 200,

      align: "left",
    },

    {
      field: "deadline",
      headerName: "Deadline",
      renderCell(params) {
        const date = params.value as Date;

        return (
          <Typography>
            {moment(date).format("dddd DD/MM/YYYY HH:mm")}
          </Typography>
        );
      },
      type: "date",
      width: 250,
      align: "left",
    },
    {
      field: "details",
      headerName: "Details",
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      renderCell(params) {
        return (
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setDetailsOpen(params.row._id)}
          >
            View Details
          </Button>
        );
      },
    },

    {
      field: "submit",
      headerName: "Submit",
      renderCell(params) {
        const date = params.row.deadline;
        const isSubmitted = submissions.some(
          (submission) => submission.assignment === params.row._id
        );

        if (isSubmitted) {
          return (
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Submitted
            </Typography>
          );
        }
        const isOverdue = moment().isAfter(date);
        if (isOverdue) {
          return (
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "red",
              }}
            >
              Overdue
            </Typography>
          );
        }
        return (
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => setSubmitOpen(params.row._id)}
          >
            Submit
          </Button>
        );
      },
      type: "date",
      width: 160,
      align: "center",
    },
    {
      field: "gradeOthers",
      headerName: "Grade Other Students",
      renderCell(params) {
        const assignment = assignments.find(
          (assignment) => assignment._id === params.row._id
        );

        const date = params.row.deadline;
        const isOverdue = moment().isAfter(date);
        if (!isOverdue) {
          return null;
        }

        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setGradeOthersOpen(assignment!)}
            fullWidth
          >
            Grade Others
          </Button>
        );
      },
      width: 160,
      align: "center",
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "grade",
      headerName: "Grade Status",
      renderCell(params) {
        const submission = submissions.find(
          (submission) => submission.assignment === params.row._id
        );
        const date = params.row.deadline;

        const isOverdue = moment().isAfter(date);
        if (!isOverdue) {
          return null;
        }
        if (!submission)
          return (
            <Typography
              style={{
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Not Submitted
            </Typography>
          );

        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setGradeOpen(params.row._id, submission._id)}
            fullWidth
          >
            View Grade
          </Button>
        );
      },
      type: "date",
      width: 160,
      align: "center",
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  if (assignments === null) return <Loading />;
  if (assignments.length === 0)
    return (
      <div className={classes.container}>
        <Typography style={{ marginTop: 24 }}>No Assignments</Typography>
      </div>
    );
  return (
    <div className={classes.container}>
      <Dialog
        open={submitOpen}
        onClose={closeSubmit}
        classes={{ paper: classes.dialog }}
      >
        <SubmitAssignmentDialog
          courseId={course._id}
          assignmentId={assignmentId!}
          onClose={closeSubmit}
        />
      </Dialog>
      <Dialog
        open={detailsOpen}
        onClose={closeDetails}
        classes={{ paper: classes.dialog }}
      >
        <DetailsAssignmentDialog
          assignmentId={assignmentId!}
          onClose={closeDetails}
        />
      </Dialog>
      <Dialog
        open={gradeOpen}
        onClose={closeGrade}
        classes={{ paper: classes.dialog }}
      >
        <GradeAssignmentDialog
          assignmentId={assignmentId!}
          submissionId={submissionId!}
          onClose={closeGrade}
        />
      </Dialog>
      <Dialog
        open={gradeOthersOpen}
        onClose={closeGradeOthers}
        classes={{ paper: classes.dialog }}
      >
        <GradeOthersAssignmentDialog
          assignment={assignment!}
          onClose={closeGradeOthers}
        />
      </Dialog>
      <div className={classes.contentContainer}>
        <div style={{ height: "100%", width: 1100, userSelect: "none" }}>
          <DataGrid
            rows={assignments}
            columns={columns}
            classes={{ cell: classes.cell, columnHeader: classes.cell }}
            pageSize={13}
            showCellRightBorder
            disableSelectionOnClick
          />
        </div>
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
    alignItems: "center",
  },
  dialog: {
    minWidth: 600,
    padding: 16,
    ...scrollBarStyle,
  },
  cell: {
    outline: "none !important",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    height: "96%",
    marginTop: 24,
    width: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
    border: "1px solid #E5E5E5",
    overflow: "auto",
  },
}));
