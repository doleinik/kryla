import React, { useState, useContext, useEffect } from "react";

import css from "./PopUp.module.scss";
import { Button } from "../button/Button";
import { activeReg, activeRes, closeAllPopUps } from "../../redux/state";

import EnterViaSocials from "./enter-buttons/EnterViaSocials";

import { ButtonClose } from "../action-buttons/Button";
import useForm from "../../utils/hooks/useForm";
import InputLabel from "../form-labels/input";
import CheckboxLabel from "../form-labels/checkbox";

export default function Login({ form }) {
  const { endpoint, fields, title } = form;

  const {
    formData,
    invalidFields,
    isSuccess,
    isSending,
    handleChange,
    handleSubmit,
  } = useForm({}, endpoint);

  useEffect(() => {
    isSuccess && closeAllPopUps();

    return () => {};
  }, [isSuccess]);

  const initLabels = (label) => {
    const obj = {
      key: label.name,
      label: label,
      invalid: invalidFields,
    };

    switch (label.type) {
      case "checkbox":
        return <CheckboxLabel {...obj} Change={handleChange} />;
      default:
        return <InputLabel {...obj} change={handleChange} />;
    }
  };

  return (
    <div className={css.content}>
      <div className={css.content__scroll}>
        <h5 className={css.title}>{title}</h5>
        <div className={css.column}>
          <div className={css.login_type}>
            <EnterViaSocials setPopUp={closeAllPopUps} />
          </div>
          <div className={css.lines}>
            <span className={css.line}></span>
            <span className={css.text}>або</span>
            <span className={css.line}></span>
          </div>
          <div className={css.form_content}>
            <form className={css.form_content} onSubmit={handleSubmit}>
              {fields.map((f) => initLabels(f))}
              <button
                type="button"
                className={`link ${css.forgot}`}
                onClick={activeRes}
              >
                Забули пароль ?
              </button>

              <Button
                type="submit"
                disabled={isSending}
                class={`yellow_button ${css.submit}`}
                title={"Увійти"}
              />
            </form>

            <div className={css.lines}>
              <span className={css.line}></span>
              <span className={css.text}>Не зареєстровані ?</span>
              <span className={css.line}></span>
            </div>
            <Button
              callBack={activeReg}
              class={`light_button ${css.submit}`}
              title={"Зареєструватися"}
            />
          </div>
        </div>
      </div>
      <ButtonClose addClass={css.close} />
    </div>
  );
}
