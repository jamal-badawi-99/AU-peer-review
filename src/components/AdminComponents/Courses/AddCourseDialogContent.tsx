import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useFormik } from "formik";
import React from "react";
import { MdClose } from "react-icons/md";
import * as Yup from "yup";
import { db } from "../../../firebase";
import { Users } from "../../../types/userTypes";
import { useSnackBar } from "../../../utils/SnackbarContext";

interface Props {
  closeDialog: () => void;
}

export default React.memo(AddCourseDialogContent);

function AddCourseDialogContent(props: Props) {
  const { closeDialog } = props;

  const classes = useStyles();
  const alert = useSnackBar();
  const [lecturers, setLecturers] = React.useState<Users[]>([]);
  React.useEffect(() => {
    db.collection("users")
      .where("userType", "==", "lecturer")
      .get()
      .then((querySnapshot) => {
        const lecturers: Users[] = [];
        querySnapshot.forEach((doc) => {
          lecturers.push({ _id: doc.id, ...doc.data() } as Users);
        });
        setLecturers(lecturers);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",

      lecturer: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Course title is required"),
      lecturer: Yup.string().required("Lecturer is required"),
    }),
    onSubmit: (v) => {
      db.collection("courses")
        .add({
          title: v.title,
          lecturerId: v.lecturer,
          lecturerName: lecturers.find((l) => l._id === v.lecturer)?.fullName,
        })
        .then(() => {
          alert.show("Course created", "success");
          formik.setSubmitting(false);
          closeDialog();
        })
        .catch((e) => {
          if (e === "auth/email-already-in-use") {
            alert.show("Email Already In Use", "error");
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
        <Typography className={classes.dialogTitle}>Add Course</Typography>
        <IconButton onClick={closeDialog}>
          <MdClose />
        </IconButton>
      </div>
      <form className={classes.dialogContent} onSubmit={formik.handleSubmit}>
        <TextField
          variant="standard"
          error={Boolean(formik.touched.title && formik.errors.title)}
          fullWidth
          helperText={formik.touched.title && formik.errors.title}
          label="Course Title"
          margin="normal"
          name="title"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.title}
        />
        <TextField
          variant="standard"
          select
          label="Lecturer"
          name="lecturer"
          error={
            formik.touched.lecturer && formik.errors.lecturer ? true : false
          }
          focused={formik.touched.lecturer ? true : false}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.lecturer}
        >
          {lecturers.map((s) => {
            return (
              <MenuItem key={s._id} value={s._id}>
                {s.fullName}
              </MenuItem>
            );
          })}
        </TextField>
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
