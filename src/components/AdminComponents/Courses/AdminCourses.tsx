import { Button, Dialog, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { db } from "../../../firebase";
import useBoolean from "../../../hooks/useBoolean";
import Loading from "../../Loading";
import HeaderWithButton from "../../Reusables/HeaderWithButton";
import AddCourseDialogContent from "./AddCourseDialogContent";
import ManageCourseDialogContent from "./ManageCourseDialogContent";

interface Props {}

export default React.memo(AdminCourses);

function AdminCourses(props: Props) {
  const classes = useStyles();

  const [dialogOpen, openDialog, closeDialog] = useBoolean();

  const [idToManage, setIdToManage] = useState<string | null>(null);
  const [manageOpen, openManage, closeManage] = useBoolean();
  const handleManage = (id: string) => {
    setIdToManage(id);
    openManage();
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "lecturerName",
      headerName: "Lecturer",
      width: 250,

      align: "left",
    },
    {
      field: "studentCount",
      headerName: "Student Count",
      renderCell: (params) =>
        params.row.students ? (
          <Typography variant="body1">{params.row.students.length}</Typography>
        ) : (
          <Typography variant="body1">0</Typography>
        ),
      width: 180,

      align: "left",
    },

    {
      field: "manage",
      headerName: "Manage",
      //button
      renderCell: (params) => (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => handleManage(params.row.id)}
        >
          Manage
        </Button>
      ),
      width: 100,
      align: "left",
      sortable: false,
      disableColumnMenu: true,
    },
  ];
  const [rows, setRows] = useState<any>(null);
  useEffect(() => {
    db.collection("courses").onSnapshot((snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRows(data);
    });
  }, []);

  if (!rows) {
    return <Loading />;
  }
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        classes={{ paper: classes.dialog }}
      >
        <AddCourseDialogContent closeDialog={closeDialog} />
      </Dialog>
      <Dialog
        open={manageOpen}
        onClose={closeManage}
        classes={{ paper: classes.dialog }}
      >
        <ManageCourseDialogContent
          closeDialog={closeManage}
          courseId={idToManage!}
        />
      </Dialog>

      <div className={classes.container}>
        <HeaderWithButton
          button={{
            text: "Add Course",
            icon: MdAdd,
            onClick: openDialog,
          }}
          title="Courses"
        ></HeaderWithButton>
        <div className={classes.contentContainer}>
          <div style={{ height: "100%", width: 900, userSelect: "none" }}>
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
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: theme.spacing(2),
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
