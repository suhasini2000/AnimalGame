import React from "react";

const ScoreBoard = ({ score, total }) => (
  <div style={{ fontSize: "18px", margin: "10px 0" }}>
    Score: {score} / {total}
  </div>
);

export default ScoreBoard;