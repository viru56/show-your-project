import React from "react";
import packageJson from "../../../package.json";
const Footer = () => {
  return <div className="footer">SYP &copy; {packageJson.version} </div>;
};

export default Footer;
