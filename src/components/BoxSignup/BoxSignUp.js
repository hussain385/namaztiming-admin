import { Typography } from "@mui/material";
import React from "react";
import "./box.css";

const BoxSignup = (props) => {
  return (
    <div id="card" className="animated fadeIn">
      <div id="upper-side2">
        <i
          style={{ fontSize: "100px", marginBottom:"10px" }}
          class="far fa-times-circle"
        ></i>
        <h3 id="status">Please Try Again</h3>
      </div>
      <div id="lower-side">
        <p id="message">{props.title}</p>
      </div>
    </div>
  );
};

export default BoxSignup;
