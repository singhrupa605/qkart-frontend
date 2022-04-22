import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [pswd, setPassword] = useState("");
  const [confirmPaswd, setConfirmPassword] = useState("");
  const userData = {
    username: userName,
    password: pswd,
    confirmPassword: confirmPaswd,
  };

  // Function to delay registration to illustrate circular progress
  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));

    // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
    /**
     * Definition for register handler
     * - Function to be called when the user clicks on the register button or submits the register form
     *
     * @param {{ username: string, password: string, confirmPassword: string }} formData
     *  Object with values of username, password and confirm password user entered to register
     *
     * API endpoint - "POST /auth/register"
     *
     * Example for successful response from backend for the API call:
     * HTTP 201
     * {
     *      "success": true,
     * }
     *
     * Example for failed response from backend for the API call:
     * HTTP 400
     * {
     *      "success": false,
     *      "message": "Username is already taken"
     * }
     */
  }
  const register = async (formData) => {
    setLoading(true);
    // await timeout(5000);
    try {
      const resData = await axios
        .post(`${config.endpoint}/auth/register`, {
          username: formData.username,
          password: formData.password,
        })
        .then((response) => {
          setLoading(false);
          console.log(response.status);
          enqueueSnackbar("Registered Successfully", {
            variant: "success",
          });
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.status === 400) {
            enqueueSnackbar("Username is already taken", {
              variant: "error",
            });
          }
        });
    } catch (error) {
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON",
        {
          variant: "error",
        }
      );
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (data.username.length === 0) {
      enqueueSnackbar("Username is a required field", {
        variant: "error",
      });
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (data.password.length === 0) {
      enqueueSnackbar("Password is a required field", {
        variant: "error",
      });
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", {
        variant: "error",
      });
      return false;
    }
    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            fullWidth
          />
          <Button
            className="button"
            variant="contained"
            onClick={() => {
              if (validateInput(userData)) {
                register(userData);
                history.push("/login", { from: "Register" });
                // console.log(userData);
              }
            }}
          >
            Register Now
          </Button>
          {isLoading && (
            <CircularProgress color="inherit" style={{ alignSelf: "center" }} />
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
