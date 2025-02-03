import React from "react";

import icon from "../../../assets/img/temp/heroes.png";

import css from "./Welcome.module.scss";

import { ButtonSupport } from "../../../components/action-buttons/Button";

const Welcome = ({ data }) => {
  if (!data) return;

  return (
    <section className={css.welcome}>
      <div className={css.animation}>
        <img src={icon} alt="" />
      </div>
      <div className={css.text_content}>
        <div>
          <h1
            className={css.title}
            dangerouslySetInnerHTML={{ __html: data.title }}
          ></h1>
          <ButtonSupport title={data.button} />
        </div>

        <div className={css.subtitle}>
          <p>{data.description}</p>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
