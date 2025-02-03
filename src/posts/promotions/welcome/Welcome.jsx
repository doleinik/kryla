import React from "react";
import { LinkNav, Button } from "../../../components/button/Button";
import { NavLink } from "react-router-dom";

import css from "./Welcome.module.scss";

import Arrow from "../../../assets/img/arrow.svg";
import IN from "../../../assets/img/icon/socials/instagram.svg";
import FB from "../../../assets/img/icon/socials/facebook.svg";
import TW from "../../../assets/img/icon/socials/twitter.svg";
import { activeSupPromo } from "../../../redux/state";

const Welcome = ({
  data: {
    title,
    date,
    databaseId,
    featuredImage: {
      node: { sourceUrl, srcSet },
    },
    promotion_options: { collected, sum, status },
  },
}) => {
  const addSpace = (x) => {
    return !x ? 0 : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  const support = () => {
    activeSupPromo();
  };

  const toPercent = (x, y) => {
    if (!x) return "1.5%";
    let sum = (x / y) * 100;
    return sum < 1 ? "1.5%" : `${sum}%`;
  };

  return (
    <section className={css.welcome}>
      <div className={css.text_content}>
        <NavLink to="/projects" className={css.back}>
          <Arrow />
        </NavLink>
        <div>
          <div className={css.date}>
            <p>Акцію створено {date.split("T")[0]}</p>
          </div>
          <h1 className={`${css.title}`}> {title}</h1>

          <div className={css.money}>
            <div className={css.now}>{addSpace(collected)}</div>
            <div className={css.all}>з {addSpace(sum)} грн</div>
          </div>
          <div className={css.progress}>
            <div
              className={css.line}
              style={{
                width: toPercent(collected, sum),
              }}
            ></div>
          </div>
          {status !== "finished" ? (
            <Button
              title="Підтримати"
              class={`yellow_button ${css.link}`}
              callBack={support}
            />
          ) : null}
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
        <img src={sourceUrl} alt="" srcSet={srcSet} />
      </div>
    </section>
  );
};

export default Welcome;
