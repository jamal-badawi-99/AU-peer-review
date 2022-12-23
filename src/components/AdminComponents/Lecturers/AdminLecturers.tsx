import { Dialog } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { db } from "../../../firebase";
import Loading from "../../Loading";
import HeaderWithButton from "../../Reusables/HeaderWithButton";
import AddLecturerDialogContent from "./AddLecturerDialogContent";

interface Props {}

export default React.memo(AdminLecturers);

function AdminLecturers(props: Props) {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: "number",
      headerName: "Username",
      width: 150,

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
      .where("userType", "==", "lecturer")
      .onSnapshot((snap) => {
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
        <AddLecturerDialogContent closeDialog={closeDialog} />
      </Dialog>

      <div className={classes.container}>
        <HeaderWithButton
          button={{
            text: "Add Lecturer",
            icon: MdAdd,
            onClick: openDialog,
          }}
          title="Lecturers"
        ></HeaderWithButton>
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
