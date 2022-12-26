import {
  Button,
  ButtonBase,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import firebase from "firebase/compat/app";
import React, { useEffect } from "react";
import { BiImages } from "react-icons/bi";
import { MdClose, MdFileCopy, MdPictureAsPdf } from "react-icons/md";
import { db } from "../../../../firebase";
import { Assignments } from "../../../../types/assignmentTypes";
import { Submissions } from "../../../../types/submissionTypes";
import { useUser } from "../../../../utils/UserContext";
import Loading from "../../../Loading";
import { scrollBarStyle } from "../../../UserComponents/UserProfile";

export function ItemWithLabel(props: {
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
  assignment: Assignments;
}

export default React.memo(GradeOthersAssignmentDialog);
interface GradingData {
  id: string;
  comment: string;
  grade: number;
}
function GradeOthersAssignmentDialog(props: Props) {
  const { assignment, onClose } = props;

  const classes = useStyles();
  const user = useUser();
  const [submissions, setSubmissions] = React.useState<Submissions[] | null>(
    null
  );
  const [gradingData, setGradingData] = React.useState<GradingData[]>([]);
  const len = assignment?.whoGrades![user._id]?.length ?? 0;
  const bankOutOf = assignment.passingGrade * len;
  const bank = gradingData.reduce((prev, curr) => prev + curr.grade, 0);

  useEffect(() => {
    const ids = assignment.whoGrades![user._id] as string[];
    if (ids.length === 0) {
      onClose();
      return;
    }
    db.collection("submissions")
      .where("assignment", "==", assignment._id)
      .where("student", "in", ids)
      .onSnapshot((querySnapshot) => {
        const submissions: Submissions[] = [];
        let idsToDelete = [] as string[];
        ids.forEach((id) => {
          if (querySnapshot.docs.find((doc) => doc.data().student === id)) {
            const document = querySnapshot.docs.find(
              (doc) => doc.data().student === id
            );
            const data = document?.data() as Submissions;
            const _id = document?.id!;
            const grade = data.grades.find((g) => g.gradedBy === user._id);
            const gradingDataObject = gradingData.find((g) => g.id === _id);

            if (!gradingDataObject) {
              gradingData.push({
                id: _id,
                comment: grade?.comment ?? "",
                grade: grade?.grade ?? 0,
              });
            }
            submissions.push({ ...data, _id });
          } else {
            idsToDelete.push(id);
          }
        });

        setSubmissions(submissions);
        if (idsToDelete.length > 0) {
          db.collection("assignments")
            .doc(assignment._id)
            .update({
              [`whoGrades.${user._id}`]: ids.filter(
                (id) => !idsToDelete.includes(id)
              ),
            });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment._id, assignment.whoGrades, user._id]);

  if (!assignment || !submissions) return <Loading />;

  return (
    <>
      <div className={classes.dialogTitleContainer}>
        <Typography className={classes.dialogTitle}>Grade Students</Typography>
        <Typography
          className={
            bank > bankOutOf ? classes.bankPassed : classes.bankNotPassed
          }
        >
          {`Bank: ${bank}/${bankOutOf} (${Math.round(
            (bank / bankOutOf) * 100
          )}%)`}
        </Typography>
        <IconButton onClick={onClose}>
          <MdClose />
        </IconButton>
      </div>
      {submissions.length > 0 ? (
        <div className={classes.dialogContent}>
          {submissions.map((sub, i) => {
            return (
              <div className={classes.studentContainer} key={i}>
                <div className={classes.labelsContainer}>
                  <Typography className={classes.title}>
                    {`Student ${i + 1}`}
                  </Typography>
                </div>
                <ItemWithLabel label="Note" value={sub.note!} break={true} />
                <div className={classes.labelsContainer}>
                  <Typography className={classes.additionalLabel}>
                    Attachments
                  </Typography>
                </div>
                <div className={classes.filesContainer}>
                  {sub.files!.map((file, index) => {
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
                {sub.grades.find((grade) => grade.gradedBy === user._id) ? (
                  <Typography
                    style={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: 8,
                      fontSize: 20,
                      fontWeight: 600,
                    }}
                  >
                    Graded
                  </Typography>
                ) : (
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
                      value={gradingData[i]?.grade}
                      onChange={(e) => {
                        if (Number(e.target.value) > bankOutOf) return;
                        const newGradingData = [...gradingData];
                        newGradingData[i] = {
                          ...newGradingData[i],
                          grade: Number(e.target.value),
                        };
                        setGradingData(newGradingData);
                      }}
                    />
                    <TextField
                      label="Comment"
                      margin="normal"
                      fullWidth
                      value={gradingData.find((g) => g.id === sub._id)?.comment}
                      onChange={(e) => {
                        const newGradingData = [...gradingData];
                        newGradingData[i] = {
                          ...newGradingData[i],
                          comment: e.target.value,
                        };
                        setGradingData(newGradingData);
                      }}
                    />
                    <div className={classes.buttonContainer}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          if (bank > bankOutOf) return;
                          await db
                            .collection("submissions")

                            .doc(sub._id)
                            .update({
                              grades: firebase.firestore.FieldValue.arrayUnion({
                                grade: gradingData[i]?.grade,
                                comment: gradingData[i]?.comment,
                                gradedBy: user._id,
                              }),
                            })
                            .then(async () => {
                              await db
                                .collection("assignments")
                                .doc(assignment._id)
                                .update({
                                  [`whoGraded.${user._id}`]:
                                    firebase.firestore.FieldValue.arrayUnion(
                                      sub.student
                                    ),
                                });
                            });
                        }}
                      >
                        Grade
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={classes.dialogContent}>There's nothing to do here</div>
      )}
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
    width: "100%",
    maxHeight: 600,
    overflow: "auto",
    ...scrollBarStyle,
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
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.text.primary,
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
  noGradeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  noGradeText: {
    fontSize: 18,
    fontWeight: 600,
    color: theme.palette.text.secondary,
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
    alignItems: "flex-start",

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
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
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
