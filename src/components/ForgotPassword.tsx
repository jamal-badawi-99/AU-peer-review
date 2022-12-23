import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { auth } from "../firebase";
import { useSnackBar } from "../utils/SnackbarContext";
function ForgotPassword() {
  const navigate = useNavigate();
  const classes = useStyles();
  const alert = useSnackBar();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
    }),
    onSubmit: (v) => {
      auth
        .sendPasswordResetEmail(v.email)
        .then((auth) => {
          navigate("/");
          alert.show("Password reset email sent", "success");
        })
        .catch((e) => {
          alert.show("Account not found", "error");
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <div className={classes.container}>
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <Box sx={{ my: 3 }}>
          <Typography
            style={{ width: 418, marginBottom: 16 }}
            color="textPrimary"
            variant="h4"
          >
            Forgot Password
          </Typography>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="body2"
          ></Typography>
        </Box>

        <TextField
          variant="standard"
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email Address"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
        />

        <Box sx={{ py: 2 }}>
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Send Email
          </Button>
        </Box>
        <Typography
          color="textSecondary"
          variant="body2"
          style={{ marginTop: 8 }}
        >
          Remember your password?{" "}
          <Link
            to="/login"
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            Sign In
          </Link>
        </Typography>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          style={{ marginTop: 8 }}
        >
          Make sure to check your spam folder if you haven't received the email.
        </Typography>
      </form>
    </div>
  );
}

export default ForgotPassword;
const useStyles = makeStyles((theme) => ({
  box: {
    alignItems: "center",
    display: "flex",
    flexGrow: 1,
    minHeight: "100%",
  },

  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    maxWidth: 460,
  },
}));
