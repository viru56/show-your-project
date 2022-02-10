import React from "react";
import logo from "../assets/images/logo.png";
export default function Logo({ width }) {
  return (
    <div className="logo">
      <img src={logo} alt="SYP" width={width || 184} />
    </div>
  );
}
