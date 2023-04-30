import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  errorText: {
    color: "red",
    marginTop: "0.5rem",
  },
  container: {
    backgroundColor: "#f5f5f5",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  title: {
    marginBottom: "1rem",
  },
}));

const Login = () => {
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setError("");
    handleChange(e);
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { email, username, password } = formData;

  const classes = useStyles();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/user/login", {
        username,
        password,
      });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      console.log("User is Logged in");
      navigate("/calendar");
    } catch (err) {
      setError("Invalid password!");
      console.error(err.response.data);
    }
  };

  return (
    <Container className={classes.container} maxWidth="lg">
      <div>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Typography variant="h5" className={classes.title}>
            Login
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        <Typography variant="body2" className={classes.signupText}>
          Don't have an account? <Link to="/signup">Click here to sign up</Link>
        </Typography>
      </div>
    </Container>
  );
};

export default Login;
