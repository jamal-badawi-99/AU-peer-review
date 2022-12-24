import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useFormik } from "formik";
import React from "react";
import { MdClose } from "react-icons/md";
import * as Yup from "yup";
import { accountCreator } from "../../../utils/AccountCreator";
import { useSnackBar } from "../../../utils/SnackbarContext";

interface Props {
  closeDialog: () => void;
}

export default React.memo(AddStudentDialogContent);

function AddStudentDialogContent(props: Props) {
  const { closeDialog } = props;

  const classes = useStyles();
  const alert = useSnackBar();
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      username: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      fullName: Yup.string().max(255).required("Student name is required"),
      username: Yup.string().required("Student Number is required"),
    }),
    onSubmit: (v) => {
      accountCreator({
        email: v.email,
        fullName: v.fullName,
        username: v.username,
        userType: "student",
      })
        .then((e) => {
          alert.show("Student created", "success");
          formik.setSubmitting(false);
          closeDialog();
        })
        .catch((e) => {
          if (e === "auth/email-already-in-use") {
            alert.show("Email Already In Use", "error");
          } else if (e === "User already exists") {
            alert.show("Student Number Already Exists", "error");
          } else {
            alert.show("An Error Has Occurred", "error");
          }
          formik.setSubmitting(false);
        });
    },
  });
  return (
    <>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>Add Student</Typography>
        <IconButton onClick={closeDialog}>
          <MdClose />
        </IconButton>
      </div>
      <form className={classes.dialogContent} onSubmit={formik.handleSubmit}>
        <TextField
          variant="standard"
          error={Boolean(formik.touched.fullName && formik.errors.fullName)}
          fullWidth
          helperText={formik.touched.fullName && formik.errors.fullName}
          label="Full Name"
          margin="normal"
          name="fullName"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.fullName}
        />

        <TextField
          variant="standard"
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
        />
        <TextField
          variant="standard"
          error={Boolean(formik.touched.username && formik.errors.username)}
          fullWidth
          helperText={formik.touched.username && formik.errors.username}
          label="Student Number"
          margin="normal"
          name="username"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.username}
        />

        <div className={classes.dialogActions}>
          {!formik.isSubmitting ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => formik.handleSubmit}
              type="submit"
              disabled={formik.isSubmitting}
            >
              Add
            </Button>
          ) : (
            <CircularProgress
              size={36}
              color="primary"
              style={{ alignSelf: "flex-end", marginInline: 16 }}
            />
          )}
        </div>
      </form>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
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
}));
