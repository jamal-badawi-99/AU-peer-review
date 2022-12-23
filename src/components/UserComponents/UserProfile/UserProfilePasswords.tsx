import { Button, makeStyles, TextField, Typography } from "@material-ui/core";

import { useFormik } from "formik";
import React from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import * as Yup from "yup";
import { auth } from "../../../firebase";
import { useSnackBar } from "../../../utils/SnackbarContext";

export default React.memo(UserProfilePasswords);

function UserProfilePasswords() {
  const classes = useStyles();
  const alert = useSnackBar();
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      auth?.currentUser
        ?.updatePassword(values.newPassword)
        .then(() => {
          formik.resetForm();
          alert.show("Password updated successfully", "success");
        })
        .catch((error) => {
          if (error.code === "auth/requires-recent-login") {
            alert.show("Please login again to update your password", "error");
          } else {
            alert.show("An error has occurred", "error");
          }
          formik.resetForm();
        });
    },
  });

  return (
    <form className={classes.editSection} onSubmit={formik.handleSubmit}>
      <Typography className={classes.sectionTitle}>Change Password</Typography>
      <div className={classes.CoupleTF}>
        <TextField
          variant="standard"
          style={{ width: "48%" }}
          error={Boolean(
            formik.touched.newPassword &&
              formik.dirty &&
              formik.errors.newPassword
          )}
          helperText={
            formik.touched.newPassword &&
            formik.dirty &&
            formik.errors.newPassword
          }
          id="newPassword"
          label="New Password"
          margin="normal"
          name="newPassword"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          required
          type="password"
          autoComplete="new-password"
          value={formik.values.newPassword}
        />
        <TextField
          variant="standard"
          style={{ width: "48%" }}
          error={Boolean(
            formik.touched.confirmPassword &&
              formik.dirty &&
              formik.errors.confirmPassword
          )}
          helperText={
            formik.touched.confirmPassword &&
            formik.dirty &&
            formik.errors.confirmPassword
          }
          id="confirmPassword"
          label="Confirm Password"
          margin="normal"
          name="confirmPassword"
          required
          autoComplete="new-password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.confirmPassword}
        />
      </div>
      <Button
        className={classes.saveButton}
        disabled={formik.isSubmitting || !(formik.dirty && formik.isValid)}
        endIcon={<RiLockPasswordLine />}
        variant="contained"
        color="primary"
        type="submit"
      >
        Change Password
      </Button>
    </form>
  );
}

const useStyles = makeStyles((theme) => ({
  EditContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    overflow: "auto",
    marginInlineStart: theme.spacing(4),
    marginInlineEnd: theme.spacing(32),
    boxSizing: "border-box",
  },
  fullName: {
    fontSize: 24,
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginTop: theme.spacing(2),
  },
  birthDate: {
    fontSize: 16,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
  },
  email: {
    fontSize: 18,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
  },
  avatarContainer: {
    position: "relative",
  },
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    background: theme.palette.background.paper,
    borderRadius: "50%",
    padding: theme.spacing(1),
    boxShadow: theme.shadows[8],
    transition: theme.transitions.create("all", { duration: 200 }),
    "&:hover": {
      background: theme.palette.background.default,
    },
  },
  editSection: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: theme.palette.background.default,
    borderRadius: 8,
    boxShadow: theme.shadows[8],
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    boxSizing: "border-box",
  },
  sectionTitle: {
    fontSize: 20,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  CoupleTF: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
  },

  saveButton: {
    marginTop: theme.spacing(2),
    width: "25%",
    alignSelf: "flex-end",
  },
}));

export const phoneNumberRegex =
  /^\+[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

const schema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Too Short!, Make sure it's more than 6 characters long.")
    .required("Required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Required"),
});
