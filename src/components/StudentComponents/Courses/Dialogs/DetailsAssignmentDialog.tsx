import { ButtonBase, IconButton, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useEffect } from "react";
import { BiImages } from "react-icons/bi";
import { MdClose, MdPictureAsPdf } from "react-icons/md";
import { db } from "../../../../firebase";
import { Assignments } from "../../../../types/assignmentTypes";
import { useSnackBar } from "../../../../utils/SnackbarContext";
import { useUser } from "../../../../utils/UserContext";
import Loading from "../../../Loading";
import { scrollBarStyle } from "../../../UserComponents/UserProfile";

function ItemWithLabel(props: {
  label: string;
  value: string;
  break?: boolean;
  customComponent?: JSX.Element;
}) {
  const { label, value, customComponent } = props;
  const classes = useStyles();
  if (!value) {
    return null;
  }
  return (
    <div className={classes.itemContainer}>
      <Typography className={classes.label}>{label}</Typography>
      {customComponent ?? (
        <Typography
          className={classes.value}
          style={{ wordBreak: props.break ? "break-all" : "normal" }}
        >
          {value}
        </Typography>
      )}
    </div>
  );
}

interface Props {
  onClose: () => void;
  assignmentId: string;
}

export default React.memo(DetailsAssignmentDialog);

function DetailsAssignmentDialog(props: Props) {
  const { assignmentId, onClose } = props;

  const classes = useStyles();
  const snackBar = useSnackBar();
  const user = useUser();

  const [assignment, setAssignment] = React.useState<Assignments | null>(null);
  useEffect(() => {
    const unsub = db
      .collection("assignments")
      .doc(assignmentId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data() as Assignments;
          const date = data.deadline as unknown as Timestamp;
          data.deadline = date.toDate();
          setAssignment(data);
        }
      });
    return () => unsub();
  }, [assignmentId]);
  if (!assignment) return <Loading />;
  return (
    <>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>
          Assignment Details
        </Typography>
        <IconButton onClick={onClose}>
          <MdClose />
        </IconButton>
      </div>
      <div className={classes.dialogContent}>
        <ItemWithLabel label="Title" value={assignment.title} break />
        <ItemWithLabel
          label="Description"
          value={assignment.description}
          break
        />
        <ItemWithLabel
          label="Deadline"
          value={moment(assignment.deadline).format("dddd DD/MM/YYYY hh:mm")}
        />
        <ItemWithLabel
          label="Passing Grade"
          value={
            assignment.passingGrade!.toString() +
            " / " +
            assignment.maxGrade!.toString()
          }
        />
      </div>
      {assignment.files && assignment.files?.length > 0 && (
        <Typography className={classes.label} style={{ marginBottom: 8 }}>
          Attachments
        </Typography>
      )}

      <div className={classes.filesContainer}>
        {assignment.files!.map((file, index) => {
          const name = file.split("fileNameIs")[1].split("typeIs")[0];

          return (
            <ButtonBase
              key={index}
              className={classes.fileContainer}
              onClick={() => {
                const url = file;
                window.open(url, "_blank");
              }}
            >
              <Typography className={classes.fileName}>{name}</Typography>
              {file.split("typeIs")[1].includes("image") ? (
                <BiImages size={50} className={classes.img} />
              ) : (
                <MdPictureAsPdf size={50} className={classes.pdf} />
              )}
            </ButtonBase>
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
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    marginTop: 16,
    gridGap: 16,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 16,
  },
  label: {
    fontWeight: 400,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  value: {
    fontWeight: 500,
    fontSize: 16,
    color: theme.palette.text.primary,
    marginInlineStart: 16,
    marginTop: 4,
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
    maxWidth: 100,
    position: "absolute",
    bottom: 8,
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
  filesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gridGap: 16,
    overflow: "auto",
    maxHeight: 150,
    boxSizing: "border-box",
    ...scrollBarStyle,
  },
}));
