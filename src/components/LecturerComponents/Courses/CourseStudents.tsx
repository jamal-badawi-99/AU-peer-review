import makeStyles from "@material-ui/core/styles/makeStyles";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { Courses } from "../../../types/courseTypes";
import Loading from "../../Loading";

interface Props {
  course: Courses;
}

export default React.memo(CourseStudents);

function CourseStudents(props: Props) {
  const classes = useStyles();

  const columns: GridColDef[] = [
    {
      field: "number",
      headerName: "Student Number",
      width: 200,

      align: "left",
    },
    { field: "fullName", headerName: "Full Name", width: 200 },

    {
      field: "email",
      headerName: "Email",

      width: 250,
      align: "left",
    },
  ];
  const [rows, setRows] = useState<any>(null);
  useEffect(() => {
    db.collection("users")
      .where("userType", "==", "student")
      .onSnapshot((snap) => {
        const data = snap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((student) => props.course.students.includes(student.id));
        console.log(data);
        setRows(data);
      });
  }, [props.course.students]);

  if (!rows) {
    return <Loading />;
  }
  return (
    <div className={classes.container}>
      <div className={classes.contentContainer}>
        <div style={{ height: "100%", width: 660, userSelect: "none" }}>
          <DataGrid
            rows={rows}
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

  dialog: {
    width: 520,
    // height: 400,
    padding: 16,
  },

  dialogTitleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
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
  dialogContentItem: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
  },
  dialogContentItemTitle: {
    fontWeight: 500,

    fontSize: 14,
    color: theme.palette.text.primary,
  },
  dialogContentItemInput: {
    height: 40,
    width: "100%",

    border: "1px solid #E0E0E0",
    borderRadius: 4,
    padding: "0 8px",
    marginTop: 4,
  },
  dialogActions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  dialogButton: {
    color: theme.palette.background.paper,
    background: theme.palette.error.main,
    "&:hover": {
      background: theme.palette.error.dark,
    },
  },
  activateButton: {
    color: theme.palette.background.paper,
    background: theme.palette.success.main,
    "&:hover": {
      background: theme.palette.success.dark,
    },
  },

  cell: {
    outline: "none !important",
  },
}));
