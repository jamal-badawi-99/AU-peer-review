import { IconButton, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Timestamp } from "firebase/firestore";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { db } from "../../../../firebase";
import { Assignments } from "../../../../types/assignmentTypes";
import { Submissions } from "../../../../types/submissionTypes";
import { useSnackBar } from "../../../../utils/SnackbarContext";
import { useUser } from "../../../../utils/UserContext";
import Loading from "../../../Loading";
import { scrollBarStyle } from "../../../UserComponents/UserProfile";
interface Props {
  onClose: () => void;
  assignmentId: string;
  submissionId: string;
}

export default React.memo(GradeAssignmentDialog);

function GradeAssignmentDialog(props: Props) {
  const { assignmentId, onClose, submissionId } = props;

  const classes = useStyles();
  const snackBar = useSnackBar();
  const user = useUser();
  const [assignment, setAssignment] = React.useState<Assignments | null>(null);
  const [submissions, setSubmissions] = React.useState<Submissions[] | null>(
    null
  );

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
    const unsub2 = db
      .collection("submissions")
      .where("assignmentId", "==", assignmentId)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Submissions;
          return data;
        });
        setSubmissions(data);
      });

    return () => {
      unsub();
      unsub2();
    };
  }, [assignmentId, submissionId]);

  if (!assignment || !submissions) return <Loading />;
  return (
    <>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>
          Assignment Grade
        </Typography>
        <IconButton onClick={onClose}>
          <MdClose />
        </IconButton>
      </div>
      <div className={classes.dialogContent}></div>
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
