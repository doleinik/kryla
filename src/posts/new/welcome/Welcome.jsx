import React from "react";
import { NavLink } from "react-router-dom";

import { LinkNav } from "../../../components/button/Button";
import icon from "../../../assets/img/temp/home_icon.png";

import css from "./Welcome.module.scss";

import Arrow from "../../../assets/img/arrow.svg";

import IN from "../../../assets/img/icon/socials/instagram.svg";
import FB from "../../../assets/img/icon/socials/facebook.svg";
import TW from "../../../assets/img/icon/socials/twitter.svg";

const Welcome = (props) => {
  const array = ["", "", "", "", "", "", "", ""];

  return (
    <section className={css.welcome}>
      <div className={css.text_content}>
        <NavLink to="/projects" className={css.back}>
          <Arrow />
        </NavLink>
        <div>
          <div className={css.date}>
            <p>22 Лют 2022</p>
          </div>
          <h1 className={`${css.title}`}>
            Допоможемо медикам рятувати дитячі серця!
          </h1>
        </div>
        <div className={css.share}>
          <p>Поширити</p>
          <div className={css.soc}>
            <a href="/">
              <IN />
            </a>
            <a href="/">
              <FB />
            </a>
            <a href="/">
              <TW />
            </a>
          </div>
        </div>
      </div>
      <div className={css.icon}>
        <img src={icon} alt="" />
      </div>
    </section>
  );
};

export default Welcome;
