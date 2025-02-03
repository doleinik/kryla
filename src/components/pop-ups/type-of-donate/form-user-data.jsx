import React, { useState, useContext } from "react";
import AuthContext from "../../../context/AuthProvider";
import { Button } from "../../button/Button";
import CheckboxLabel from "../../form-labels/checkbox";
import InputLabel from "../../form-labels/input";
import PhoneLabel from "../../form-labels/phone";

const FormUserData = ({ active, css, step, form, handleChange, invalid }) => {
  const { auth } = useContext(AuthContext);
  const { fields, title } = form;
  const [agree, setAgree] = useState(false);

  const initLabels = (label) => {
    const obj = {
      key: label.name,
      label: label,
      invalid: invalid,
      def: auth,
    };

    switch (label.name) {
      case "anonymous":
        return <CheckboxLabel {...obj} />;
      case "policy":
        return <CheckboxLabel {...obj} change={() => setAgree((e) => !e)} />;
      case "user_phone":
        return <PhoneLabel {...obj} change={handleChange} />;
      default:
        return <InputLabel {...obj} change={handleChange} />;
    }
  };

  return (
    <>
      <div className={`${css.form_step} ${css.second} ${active}`}>
        <h4>{title}</h4>

        {fields.map((f) => initLabels(f))}

        <div className={css.buttons_navs}>
          <Button
            type="button"
            title="Назад"
            callBack={() => step(false)}
            class={"light_button"}
          />
          <>
            <Button
              type="submit"
              disabled={!agree}
              title="Зробити внесок"
              class={"yellow_button"}
            />
          </>
        </div>
      </div>
    </>
  );
};

export default FormUserData;
