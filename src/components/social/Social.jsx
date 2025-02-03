import React from "react";
import css from "./Social.module.scss";

import IN from "../../assets/img/icon/socials/instagram.svg";
import FB from "../../assets/img/icon/socials/facebook.svg";
import TW from "../../assets/img/icon/socials/twitter.svg";


const soc = {
  instagram: IN,
  facebook: FB,
  twitter: TW,
}

const Social = (props) => {
  let Icon = soc[props.icon]
  return <a className={`${css.i} ${props.class ? props.class : ""}`} href={props.link} target="_blank"><Icon /></a>
};

export default Social;
