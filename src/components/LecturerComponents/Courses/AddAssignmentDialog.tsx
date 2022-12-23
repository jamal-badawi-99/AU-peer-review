import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { DateTimePicker } from "@material-ui/pickers";
import firebase from "firebase/compat/app";
import { useFormik } from "formik";
import React from "react";
import { BiImages } from "react-icons/bi";
import { MdAdd, MdClose, MdPictureAsPdf } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { db, storage } from "../../../firebase";
import { useSnackBar } from "../../../utils/SnackbarContext";
import { scrollBarStyle } from "../../UserComponents/UserProfile";
interface Props {
  closeDialog: () => void;
  courseId: string;
}

export default React.memo(AddAssignmentDialog);

function AddAssignmentDialog(props: Props) {
  const { closeDialog, courseId } = props;

  const classes = useStyles();
  const snackBar = useSnackBar();
  const [files, setFiles] = React.useState<File[]>([]);
  const handlePicker = (event: any) => {
    if (event.target.files) {
      setFiles((prev) => {
        return [...prev, ...event.target.files];
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      course: courseId,
      deadline: new Date(),
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      deadline: Yup.date().required("Deadline is required"),
    }),
    onSubmit: async (v, { setSubmitting }) => {
      return Promise.all(
        files.map(async (file) => {
          const storageRef = storage.ref("courses/" + courseId + "/");
          const fileRef = storageRef.child(
            "fileNameIs" +
              file.name +
              "uuidIs" +
              uuidv4().split("-")[0] +
              "typeIs" +
              file.type
          );
          await fileRef.put(file);
          return await fileRef.getDownloadURL();
        })
      ).then(async (urls) => {
        setSubmitting(true);

        await db
          .collection("assignments")

          .add({
            ...v,
            files: urls,
          })
          .then(async (docref) => {
            await db
              .collection("courses")
              .doc(courseId)
              .update({
                assignments: firebase.firestore.FieldValue.arrayUnion(
                  docref.id
                ),
              })
              .then(() => {
                snackBar.show("Appointment Updated", "success");
                closeDialog();
              })
              .finally(() => {
                setSubmitting(false);
              });
          });
      });
    },
  });

  return (
    <>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>Add Assignment</Typography>
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
          label="Title"
          margin="normal"
          name="title"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.title}
        />
        <TextField
          variant="standard"
          error={Boolean(
            formik.touched.description && formik.errors.description
          )}
          fullWidth
          helperText={formik.touched.description && formik.errors.description}
          label="Description"
          margin="normal"
          name="description"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.description}
        />

        <DateTimePicker
          disableFuture
          openTo="year"
          ampm={false}
          TextFieldComponent={(props) => (
            <TextField
              variant="standard"
              fullWidth
              {...props}
              label="Deadline"
              margin="normal"
              name="deadline"
              onBlur={formik.handleBlur}
              type="deadLine"
            />
          )}
          format="dddd DD/MM/yyyy HH:mm"
          label="Deadline"
          views={["year", "month", "date", "hours", "minutes"]}
          value={formik.values.deadline}
          onChange={(date) => formik.setFieldValue("deadline", date)}
        />
        <div className={classes.labelsContainer}>
          <Typography className={classes.additionalLabel}>
            Additional Files
          </Typography>
          <Typography className={classes.fileTypesLabel}>
            (PDF/Images)
          </Typography>
        </div>
        <div className={classes.additionalFiles}>
          {files?.map((file, index) => (
            <div key={index} className={classes.fileContainer}>
              <div className={classes.nameType}>
                <Typography className={classes.fileName}>
                  {file.name.split(".")[0]}
                </Typography>
                <Typography className={classes.fileType}>
                  {`.${file.name.split(".")[1]}`}
                </Typography>
              </div>
              <div>
                {file.type.includes("image") ? (
                  <BiImages size={50} className={classes.img} />
                ) : (
                  <MdPictureAsPdf size={50} className={classes.pdf} />
                )}
              </div>
              <IconButton
                className={classes.removeFileButton}
                disabled={formik.isSubmitting}
                onClick={() => {
                  setFiles((prev) => prev?.filter((file, i) => i !== index));
                }}
              >
                <MdClose />
              </IconButton>
            </div>
          ))}
          <Button
            style={{
              width: 120,
              height: 120,
              border: "1px dashed",
              justifySelf: "center",
            }}
            color="secondary"
            component="label"
            disabled={formik.isSubmitting}
          >
            <input
              hidden
              accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
              type="file"
              multiple
              onChange={handlePicker}
            />
            <MdAdd size={50} />
          </Button>
        </div>
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

      <div className={classes.dialogActions}></div>
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
}));
