import React, { useEffect } from "react";
import { Button } from "../../../components/button/Button";
import css from "./Password.module.scss";
import fs from "../../../components/form/Form.module.scss";

import useForm from "../../../utils/hooks/useForm";
import InputLabel from "../../../components/form-labels/input";

const Password = ({ auth, alert, forms }) => {
  const { title, subtitle, endpoint, fields, success_message } =
    forms.user_password_update;
  const { invalidFields, isSuccess, isSending, handleChange, handleSubmit } =
    useForm({}, endpoint);

  useEffect(() => {
    isSuccess && alert({ ...success_message });

    return () => {};
  }, [isSuccess]);

  return (
    <>
      <div className={css.pass_content}>
        <h3 className={css.title}>{title}</h3>

        <form className={css.form} onSubmit={handleSubmit}>
          <label className={fs.hidden}>
            <input type="text" name="user_id" value={auth.user_id} readOnly />
          </label>
          {fields.map((label) => (
            <InputLabel
              key={label.name}
              label={label}
              invalid={invalidFields}
              change={handleChange}
            />
          ))}

          <p className={css.description}>{subtitle}</p>
          <Button
            class={`${css.save} dark_button`}
            title={"Зберегти дані"}
            type={"submit"}
            disabled={isSending}
          />
        </form>
      </div>
    </>
  );
};

export default Password;
