import React, { useState, useEffect } from "react";
import css from "../PopUp.module.scss";

import SuccessIco from "../../../assets/img/icon/goal/goal_4.svg";
import AlertIco from "../../../assets/img/icon/goal/goal_3.svg";
import { Button } from "../../button/Button";

const AlertMessage = ({ state, ...props }) => {
  const { danger, title, subtitle, close_title } = state.getState().alert;

  return (
    <>
      <div
        className={`${css.content} ${css.content__success} ${
          danger ? css.alert : ""
        }`}
      >
        <div className={css.icon}>{danger ? <AlertIco /> : <SuccessIco />}</div>
        <h5 className={css.title}>{title}</h5>
        <p className={css.subtitle}>{subtitle}</p>

        <div className={css.buttons}>
          <Button
            type={"button"}
            class={`light_button`}
            title={close_title ? close_title : "Добре"}
            callBack={() => state.setActivePopUp(false)}
          ></Button>
          {danger && danger()}
        </div>
      </div>
    </>
  );
};

export default AlertMessage;
