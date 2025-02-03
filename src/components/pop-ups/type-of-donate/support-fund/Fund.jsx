import React, { useState, useEffect } from "react";
import { Button } from "../../../button/Button";
import FormUserData from "../form-user-data";
import useForm from "../../../../utils/hooks/useForm";
import AmountLabel from "../../../form-labels/amount";
import HiddenLabel from "../../../form-labels/hidden";
import DateLabel from "../../../form-labels/date";
import SelectLabel from "../../../form-labels/select";

const SupporPromo = ({ close, form, setStep, isActive, css, state }) => {
  const [period, setPeriod] = useState("monthly");

  const [amountDonate, setAmount] = useState("");
  const { fields, title, subtitle, endpoint } = form.support_fund;

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
      state.setAlert({ ...form.support_fund?.success_message });
    }

    return () => {};
  }, [isSuccess]);

  const changeStep = (boo) => {
    setStep({
      active: boo ? ["sec"] : ["fr"],
    });
  };

  const initLabels = (label) => {
    const obj = {
      key: label.name,
      label: label,
      amount: amountDonate,
      setAmount: setAmount,
    };

    switch (label.type) {
      case "buttons":
        return (
          <div key={label.type} className={css.types_donation}>
            {label?.options.map((type) => (
              <button
                key={type.name}
                type="button"
                onClick={(e) => setPeriod(type.name)}
                className={`${css.b} ${period == type.name ? css.active : ""}`}
              >
                {type.title}
              </button>
            ))}
          </div>
        );
      case "date":
        return period == "monthly" ? <DateLabel {...obj} /> : null;
    }
    switch (label.name) {
      case "donation_amount":
        return <AmountLabel {...obj} subtitle={subtitle} />;
      case "donation_appointment":
        return <SelectLabel {...obj} />;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h5>{title}</h5>

        <HiddenLabel name={"promo_id"} def={localStorage.getItem("promo_id")} />

        <div className={`${css.form_step} ${isActive("fr")}`}>
          {fields.map((field) => initLabels(field))}

          <div className={css.buttons_navs}>
            <Button
              title={"Скасувати"}
              callBack={close}
              class={"light_button"}
            />
            <>
              <Button
                title="Далі"
                class={"dark_button"}
                disabled={!amountDonate}
                callBack={(e) => changeStep(true)}
              />
            </>
          </div>
        </div>

        <FormUserData
          form={form.donation_data}
          handleChange={handleChange}
          invalid={invalidFields}
          active={isActive("sec")}
          css={css}
          step={changeStep}
        />
      </form>
    </>
  );
};

export default SupporPromo;
