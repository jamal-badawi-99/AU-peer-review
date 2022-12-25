import { Button, Dialog, Fab, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Timestamp } from "firebase/firestore";

import moment from "moment";
import React, { useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { db } from "../../../firebase";
import useBoolean from "../../../hooks/useBoolean";
import { Assignments } from "../../../types/assignmentTypes";
import { Courses } from "../../../types/courseTypes";
import Loading from "../../Loading";
import AddAssignmentDialog from "./AddAssignmentDialog";
import ObjectionsDialog from "./ObjectionsDialog";

interface Props {
  course: Courses;
}

export default React.memo(CourseAssignments);

function CourseAssignments(props: Props) {
  const { course } = props;

  const classes = useStyles();
  const [addAssignment, openAddAssignment, closeAddAssignment] = useBoolean();
  const [assignments, setAssignments] = React.useState<Assignments[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    React.useState<Assignments | null>(null);

  const [objections, openObjections, closeObjections] = useBoolean();
  const onObjectionView = (assignment: Assignments) => {
    setSelectedAssignment(assignment);
    openObjections();
  };
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
  }, [course._id]);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 200,

      align: "left",
    },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "passingGrade",
      headerName: "Passing Grade",
      width: 124,
      renderCell(params) {
        const max = params.row.maxGrade;
        const min = params.value;

        return <Typography>{`${min} / ${max}`}</Typography>;
      },
      disableColumnMenu: true,
      sortable: false,
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
      field: "objections",
      headerName: "Objections",
      renderCell(params) {
        const assignment = assignments.find((a) => a._id === params.row._id);

        return (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              onObjectionView(assignment!);
            }}
          >
            View Objections
          </Button>
        );
      },
      width: 140,
      align: "left",
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  if (assignments === null) return <Loading />;
  if (assignments.length === 0)
    return (
      <div className={classes.container}>
        <Dialog
          open={addAssignment}
          onClose={closeAddAssignment}
          classes={{ paper: classes.dialog }}
        >
          <AddAssignmentDialog
            closeDialog={closeAddAssignment}
            courseId={course._id}
          />
        </Dialog>
        <Fab
          onClick={openAddAssignment}
          variant="extended"
          style={{ width: 180, position: "absolute", bottom: 40, right: 40 }}
          color="secondary"
        >
          <MdAdd size={22} />
          Add Assignment
        </Fab>
        <Typography style={{ marginTop: 24 }}>No Assignments</Typography>
      </div>
    );
  return (
    <div className={classes.container}>
      <Dialog
        open={objections}
        onClose={closeObjections}
        classes={{ paper: classes.objectionDialog }}
      >
        <ObjectionsDialog
          closeDialog={closeObjections}
          assignment={selectedAssignment!}
        />
      </Dialog>
      <Dialog
        open={addAssignment}
        onClose={closeAddAssignment}
        classes={{ paper: classes.dialog }}
      >
        <AddAssignmentDialog
          closeDialog={closeAddAssignment}
          courseId={course._id}
        />
      </Dialog>
      <Fab
        onClick={openAddAssignment}
        variant="extended"
        style={{ width: 180, position: "absolute", bottom: 40, right: 40 }}
        color="secondary"
      >
        <MdAdd size={22} />
        Add Assignment
      </Fab>
      <div className={classes.contentContainer}>
        <div style={{ height: "100%", width: 920, userSelect: "none" }}>
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
  },
  objectionDialog: {
    minWidth: 300,
    padding: 16,
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
