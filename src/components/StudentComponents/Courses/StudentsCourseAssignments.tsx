import { Button, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Timestamp } from "firebase/firestore";

import moment from "moment";
import React, { useEffect } from "react";
import { db } from "../../../firebase";
import { Assignments } from "../../../types/assignmentTypes";
import { Courses } from "../../../types/courseTypes";
import Loading from "../../Loading";

interface Props {
  course: Courses;
}

export default React.memo(StudentsCourseAssignments);

function StudentsCourseAssignments(props: Props) {
  const { course } = props;

  const classes = useStyles();
  const [assignments, setAssignments] = React.useState<Assignments[]>([]);
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
        console.log(date);
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
      field: "submit",
      headerName: "Submit",
      renderCell(params) {
        const date = params.row.deadline;
        const isDisabled = moment().isAfter(date);
        return (
          <Button variant="contained" color="secondary" disabled={isDisabled}>
            Submit
          </Button>
        );
      },
      type: "date",
      width: 140,
      align: "left",
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
