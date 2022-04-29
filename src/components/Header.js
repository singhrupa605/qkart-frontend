import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Button,
  Stack,
  CardHeader,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  let dataToRender = null;
  const userData = localStorage.getItem("username");
  const history = useHistory();
  if (hasHiddenAuthButtons) {
    dataToRender = (
      <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={() => {
          history.push("/");
        }}
      >
        Back to explore
      </Button>
    );
  } else {
    if (userData !== null) {
      dataToRender = (
        <Stack direction="row">
          <CardHeader
            avatar={<Avatar alt={userData} src="../../public/avatar.png" />}
            title={
              <p
                className="username-text"
                style={{ color: "gray", fontSize: "15px" }}
              >
                {" "}
                {userData}{" "}
              </p>
            }
          />
          <Button
            className="button"
            onClick={(e) => {
              localStorage.clear();
              window.location.reload();
              history.push("/", { from: "Products" });
            }}
          >
            LOGOUT
          </Button>
        </Stack>
      );
    } else {
      dataToRender = (
        <Stack direction="row" spacing={4}>
          <Button
            onClick={(e) => {
              history.push("/login", { from: "Products" });
            }}
          >
            LOGIN
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              history.push("/register", { from: "Products" });
            }}
          >
            REGISTER
          </Button>
        </Stack>
      );
    }
  }
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {dataToRender}
    </Box>
  );
};

export default Header;
