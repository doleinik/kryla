import React from "react";
import { LinkNav } from "../../../components/button/Button";
import icon from "../../../assets/img/temp/home_icon.png";

import css from "./Welcome.module.scss";

const Welcome = ({ data }) => {
  return (
    <section className={css.welcome}>
      <div className={css.text_content}>
        <h1 className={css.title}>{data.title}</h1>
        <p className={css.subtitle}> {data.subtitle}
        </p>
        <LinkNav
          link="/contact-us"
          title="Підтримати"
          class={`dark_button ${css.link}`}
        />
      </div>
      <div className={css.gallery}>
        {data.gallery.map((el, idx) => {
          return (
            <div key={idx} className={css.icon}>
              <img src={el.sourceUrl} alt="" />;{/* <LoadImage icon={el} /> */}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Welcome;
