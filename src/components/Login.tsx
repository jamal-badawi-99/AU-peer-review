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
import { auth, db } from "../firebase";
import { useSnackBar } from "../utils/SnackbarContext";
function Login() {
  const navigate = useNavigate();
  const classes = useStyles();
  const alert = useSnackBar();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()

        .max(255)
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Too Short!, Make sure it's more than 6 characters long.")
        .required("Password is required"),
    }),
    onSubmit: (v) => {
      db.collection("users")
        .where("number", "==", v.username)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            auth
              .signInWithEmailAndPassword(doc.data().email, v.password)
              .then((auth) => {
                navigate("/");
              })
              .catch((e) => {
                alert.show("Account not found", "error");
                formik.setSubmitting(false);
              });
          });
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
            color="textPrimary"
            variant="h4"
            style={{ marginBottom: 16 }}
          >
            Sign in
          </Typography>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="body2"
          ></Typography>
        </Box>

        <TextField
          variant="standard"
          error={Boolean(formik.touched.username && formik.errors.username)}
          fullWidth
          helperText={formik.touched.username && formik.errors.username}
          label="Username"
          margin="normal"
          name="username"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        <TextField
          variant="standard"
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label="Password"
          margin="normal"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
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
            Sign In
          </Button>
        </Box>
        <div className={classes.linkActions}>
          <Typography
            color="textSecondary"
            variant="body2"
            style={{ marginTop: 8 }}
          >
        
          </Typography>
          <Link
            to="/forgot-password"
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            <Typography variant="body2" style={{ marginTop: 8 }}>
              Forgot Password?{" "}
            </Typography>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
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
  linkActions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));
