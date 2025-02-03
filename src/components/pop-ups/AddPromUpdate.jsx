import React, { useEffect } from "react";
import css from "./PopUp.module.scss";

import { ButtonClose } from "../action-buttons/Button";
import useForm from "../../utils/hooks/useForm";
import { Button } from "../button/Button";
import { closeAllPopUps } from "../../redux/state";
import InputLabel from "../form-labels/input";
import HiddenLabel from "../form-labels/hidden";
import FileLabel from "../form-labels/file";
const AddPromUpdate = ({ state, form }) => {
  const { title, endpoint, fields, success_message } = form;

  const {
    formData,
    invalidFields,
    isSuccess,
    isSending,
    handleChange,
    handleSubmit,
  } = useForm({}, endpoint);

  const initLabels = (label) => {
    const obj = {
      key: label.name,
      label: label,
      invalid: invalidFields,
      change: handleChange,
    };

    switch (label.name) {
      case "upload_file":
        return <FileLabel {...obj} />;
      default:
        return <InputLabel {...obj} def={formData} />;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      state.setAlert({ ...success_message });
      state.setUpdate("update_promo");
    }
    return () => {};
  }, [isSuccess]);

  return (
    <>
      <div className={`${css.content} ${css.content__create}`}>
        <div className={css.content__scroll}>
          <h5 className={css.title}>{title}</h5>

          <form className={css.form} onSubmit={handleSubmit}>
            <HiddenLabel
              name="promo_id"
              def={localStorage.getItem("promo_id")}
            />

            {fields.map((f, i) => initLabels(f, i))}

            <div className={css.buttons}>
              <Button
                type={"button"}
                class={`light_button`}
                title={"Скасувати"}
                callBack={closeAllPopUps}
              ></Button>
              <Button
                type={"submit"}
                disabled={isSending}
                class={`${css.save} yellow_button`}
                title={"Оновити"}
              ></Button>
            </div>
          </form>
        </div>
        <ButtonClose addClass={css.close} />
      </div>
    </>
  );
};

export default AddPromUpdate;
