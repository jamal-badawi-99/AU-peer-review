import {
  Button,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { BiImages } from "react-icons/bi";
import { MdClose, MdFileCopy, MdPictureAsPdf } from "react-icons/md";
import { db } from "../../../firebase";
import { Assignments } from "../../../types/assignmentTypes";
import { Submissions } from "../../../types/submissionTypes";
import { ItemWithLabel } from "../../StudentComponents/Courses/Dialogs/GradeOthersAssignmentDialog";
import { scrollBarStyle } from "../../UserComponents/UserProfile";

interface Props {
  closeDialog: () => void;
  submission: Submissions;
  assignment: Assignments;
}

export default React.memo(SubmissionDialog);

function SubmissionDialog(props: Props) {
  const { submission, closeDialog, assignment } = props;

  const classes = useStyles();
  const [newGrade, setNewGrade] = React.useState<number>(0);
  const [newCommnet, setNewCommnet] = React.useState<string>("");
  return (
    <>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>
          Objected Submission
        </Typography>
        <Typography
          className={
            newGrade > assignment.maxGrade
              ? classes.bankPassed
              : classes.bankNotPassed
          }
        >
          {`Bank: ${newGrade}/${assignment.maxGrade} (${Math.round(
            (newGrade / assignment.maxGrade) * 100
          )}%)`}
        </Typography>
        <IconButton onClick={closeDialog}>
          <MdClose />
        </IconButton>
      </div>
      <div className={classes.dialogContent}>
        <div className={classes.studentContainer}>
          <ItemWithLabel label="Note" value={submission.note!} break={true} />
          <div className={classes.labelsContainer}>
            <Typography className={classes.additionalLabel}>
              Attachments
            </Typography>
          </div>
          <div className={classes.filesContainer}>
            {submission.files!.map((file, index) => {
              return (
                <ButtonBase
                  key={index}
                  className={classes.fileContainer}
                  onClick={() => {
                    const url = file;
                    window.open(url, "_blank");
                  }}
                >
                  {file.split("typeIs")[1].includes("image") && (
                    <BiImages size={50} className={classes.img} />
                  )}
                  {file.split("typeIs")[1].includes("pdf") && (
                    <MdPictureAsPdf size={50} className={classes.pdf} />
                  )}
                  {!file.split("typeIs")[1].includes("pdf") &&
                    !file.split("typeIs")[1].includes("image") && (
                      <MdFileCopy size={50} className={classes.file} />
                    )}
                </ButtonBase>
              );
            })}
          </div>

          <div className={classes.studentActionsContainer}>
            <TextField
              label="Grade"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  max: assignment.passingGrade,
                },
              }}
              fullWidth
              margin="normal"
              value={newGrade}
              onChange={(e) => {
                if (Number(e.target.value) > assignment.maxGrade) return;
                setNewGrade(Number(e.target.value));
              }}
            />
            <TextField
              label="Comment"
              margin="normal"
              fullWidth
              value={newCommnet}
              onChange={(e) => {
                setNewCommnet(e.target.value);
              }}
            />
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  if (newGrade > assignment.maxGrade) return;
                  await db
                    .collection("submissions")

                    .doc(submission._id)
                    .update({
                      objection: {
                        grade: newGrade,
                        comment: newCommnet,
                        status: "resolved",
                      },
                    })
                    .then(() => {
                      closeDialog();
                    });
                }}
              >
                Regrade
              </Button>
            </div>
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
  noObjections: {
    width: "100%",
    fontWeight: 600,
    textAlign: "center",
    marginTop: 8,
    boxSizing: "border-box",
    fontSize: 20,
  },

  studentText: {
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.text.primary,
  },
  studentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
    boxSizing: "border-box",
    boxShadow: "0px 0px 4px rgba(0,0,0,0.1)",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  file: {
    position: "absolute",
    top: 30,
    left: 35,
    color: theme.palette.grey[500],
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
  filesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gridGap: 16,
    overflow: "auto",
    maxHeight: 150,
    boxSizing: "border-box",
    ...scrollBarStyle,
  },
  studentActionsContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: 16,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
  },
  labelsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  additionalLabel: {
    fontSize: 16,
    color: theme.palette.text.secondary,
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
  bankPassed: {
    color: theme.palette.error.main,
    fontSize: 20,
    fontWeight: 600,
  },

  bankNotPassed: {
    fontSize: 20,
    fontWeight: 600,

    color: theme.palette.text.primary,
  },
}));
