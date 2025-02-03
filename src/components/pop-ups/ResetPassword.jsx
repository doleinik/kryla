import React, { useEffect } from "react";
import css from "./PopUp.module.scss";
import { Button } from "../button/Button";
import { ButtonClose } from "../action-buttons/Button";
import useForm from "../../utils/hooks/useForm";
import InputLabel from "../form-labels/input";

const ResetPassword = ({ state, form }) => {
  const { endpoint, fields, success_message, title, subtitle } = form;

  const { formData, invalidFields, isSuccess, handleChange, handleSubmit } =
    useForm({}, endpoint);

  useEffect(() => {
    if (isSuccess) {
      state.setAlert({
        ...success_message,
      });
    }
    return () => {};
  }, [isSuccess]);

  const initLabels = (label) => {
    const obj = {
      key: label.name,
      label: label,
      invalid: invalidFields,
      def: formData,
    };

    return <InputLabel {...obj} change={handleChange} />;
  };

  return (
    <>
      <div className={`${css.content} ${css.content__reset}`}>
        <div className={css.content__scroll}>
          <h5 className={css.title}>{title}</h5>
          <p className={css.subtitle}>{subtitle}</p>
          <div className={css.column}>
            <form className={css.form_content} onSubmit={handleSubmit}>
              {fields.map((label) => initLabels(label))}

              <Button
                type={"submit"}
                class={`yellow_button ${css.submit}`}
                title={"Відправити"}
              />
            </form>
          </div>
        </div>
        <ButtonClose addClass={css.close} />
      </div>
    </>
  );
};

export default ResetPassword;
