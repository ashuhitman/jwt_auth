import React from "react";
import "./Loader.scss";

function Loader({ size, width, color, visibility }) {
  return (
    <div
      className="loader"
      style={{
        height: size,
        width: size,
        borderLeftColor: color,
        borderWidth: width,
        visibility,
      }}
    ></div>
  );
}

export default Loader;
