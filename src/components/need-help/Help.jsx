import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../button/Button";
import css from "./Help.module.scss";

import Arrow from "../../assets/img/arrow.svg";
import LoadImage from "../load-image/Image";
import { activeSupPromo } from "../../redux/state";

const HelpSlide = ({
  title,
  subtitle,
  icon,
  link,
  post_id,
  status,
  sum,
  collected,
  can_edit,
  children,
  ...props
}) => {
  useEffect(() => {
    return () => {
      localStorage.removeItem("promo_id");
    };
  }, []);

  const addSpace = (x) => {
    return !x ? 0 : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const toPercent = (x, y) => {
    if (!x) return "1.5%";
    let sum = (x / y) * 100;
    return sum < 1 ? "1.5%" : `${sum}%`;
  };
  const support = () => {
    localStorage.setItem("promo_id", post_id);
    activeSupPromo();
  };

  return (
    <>
      <div className={css.help_icon + " " + props.class}>
        <div className={css.icon} data-icon>
          <LoadImage icon={icon} />
        </div>

        <div className={css.information}>
          <div>
            {status !== "finished" ? (
              <>
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
              </>
            ) : (
              <>
                <div className={css.finished}>
                  <div className={css.dot}></div>
                  <p>Завершено</p>
                </div>
              </>
            )}

            <h4 className={css.title}>{title}</h4>
            <p className={css.subtitle}>{subtitle}</p>
          </div>
          <div className={css.buttons}>
            {status !== "finished" && !can_edit ? (
              <Button class={css.help} title="Підтримати" callBack={support} />
            ) : null}
            {can_edit && status !== "finished" ? children : null}
            <NavLink to={link} className={`link ${css.link_more}`}>
              Більше
              <span>
                <Arrow />
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpSlide;
