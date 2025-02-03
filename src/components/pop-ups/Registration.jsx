import React from "react";
import css from "./PopUp.module.scss";
import { Button } from "../button/Button";
import { activeLog } from "../../redux/state";

import Google from "./enter-buttons/Google";
import Facebook from "./enter-buttons/Facebook";
import { ButtonClose } from "../action-buttons/Button";

import useForm from "../../utils/hooks/useForm";
import PhoneLabel from "../form-labels/phone";
import InputLabel from "../form-labels/input";

const Registration = ({ form }) => {
  const { endpoint, fields, title } = form;

  const { formData, invalidFields, isSending, handleChange, handleSubmit } =
    useForm({}, endpoint);

  const initLabels = (label) => {
    const obj = {
      key: label.name,
      label: label,
      invalid: invalidFields,
      def: formData,
      change: handleChange,
    };

    switch (label.name) {
      case "user_phone":
        return <PhoneLabel {...obj} />;
      default:
        return <InputLabel {...obj} />;
    }
  };

  return (
    <div className={css.content}>
      <div className={css.content__scroll}>
        <h5 className={css.title}>{title}</h5>
        <div className={css.column}>
          <div className={css.login_type}>
            <Google />
            <Facebook />
          </div>
          <div className={css.lines}>
            <span className={css.line}></span>
            <span className={css.text}>або</span>
            <span className={css.line}></span>
          </div>
          <div className={css.form_content}>
            <form className={css.form_content} onSubmit={handleSubmit}>
              {fields.map((label) => initLabels(label))}

              <Button
                type={"submit"}
                disabled={isSending}
                class={`yellow_button ${css.submit}`}
                title={"Зареєструватися"}
              />
            </form>

            <div className={css.lines}>
              <span className={css.line}></span>
              <span className={css.text}>Уже зареєстровані?</span>
              <span className={css.line}></span>
            </div>
            <Button
              class={`light_button ${css.submit}`}
              callBack={activeLog}
              title={"Увійти"}
            />
          </div>
        </div>
      </div>
      <ButtonClose addClass={css.close} />
    </div>
  );
};

export default Registration;
