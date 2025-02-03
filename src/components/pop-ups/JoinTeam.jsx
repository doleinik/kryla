import React, { useState, useEffect } from "react";
import css from "./PopUp.module.scss";
import { Button } from "../button/Button";

import { ButtonClose } from "../action-buttons/Button";

import useForm from "../../utils/hooks/useForm";
import InputLabel from "../form-labels/input";
import PhoneLabel from "../form-labels/phone";
import FileLabel from "../form-labels/file";
import CheckboxLabel from "../form-labels/checkbox";
import HiddenLabel from "../form-labels/hidden";

const JoinToTeam = ({ state, form }) => {
  const { endpoint, fields, id, success_message, title, subtitle } = form;

  const [agree, setAgree] = useState(false);

  const onFormSubmit = (e) => {
    agree ? handleSubmit(e) : e.preventDefault();
  };

  const {
    formData,
    invalidFields,
    isSuccess,
    isSending,
    handleChange,
    handleSubmit,
  } = useForm({}, endpoint);

  useEffect(() => {
    if (isSuccess) {
      state.setAlert({ ...success_message });
    }

    return () => {};
  }, [isSuccess]);

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
      case "upload_file":
        return <FileLabel {...obj} />;
      case "policy":
        return <CheckboxLabel {...obj} change={() => setAgree(!agree)} />;
      default:
        return <InputLabel {...obj} />;
    }
  };

  return (
    <>
      <div className={`${css.content}`}>
        <div className={css.content__scroll}>
          <div className={css.text}>
            <h5 className={css.title}>{title}</h5>
            <p className={css.subtitle}>{subtitle}</p>
          </div>

          <div className={css.column}>
            <div className={css.form_content}>
              <form className={css.form_content} onSubmit={onFormSubmit}>
                <HiddenLabel name="form_id" def={id} />

                {fields.map((f, i) => initLabels(f, i))}

                <Button
                  type={"submit"}
                  disabled={!agree || isSending}
                  class={`yellow_button`}
                  title={"Відправити"}
                />
              </form>
            </div>
          </div>
        </div>
        <ButtonClose addClass={css.close} />
      </div>
    </>
  );
};

export default JoinToTeam;
