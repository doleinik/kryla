import React from "react";
// import LogoSvg from "../../assets/img/icon/logo.svg";
import icon from "../../assets/img/logo.png";

import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <NavLink to={"/"}>
      <img src={icon} alt="" />
      {/* <LogoSvg /> */}
    </NavLink>
  );
};

export default Logo;
