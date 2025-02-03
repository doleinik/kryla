import React, { useState, useEffect } from "react";
import { Button } from "../../../button/Button";
import FormUserData from "../form-user-data";
import useForm from "../../../../utils/hooks/useForm";
import AmountLabel from "../../../form-labels/amount";
import HiddenLabel from "../../../form-labels/hidden";

const SupporPromo = ({ close, form, setStep, isActive, css, fs, state }) => {
  const [amountDonate, setAmount] = useState("");
  const { fields, title, subtitle } = form.donation_amount;
  const support = form.promo_support;

  const {
    formData,
    invalidFields,
    isSuccess,
    isSending,
    handleChange,
    handleSubmit,
  } = useForm({}, support.endpoint);

  useEffect(() => {
    if (isSuccess) {
      let isPagePromo = localStorage.getItem("page_promo");

      // console.log(isPagePromo);
      state.setAlert({ ...support.success_message });
      state.setUpdate(
        localStorage.getItem("page_promo") ? "page_promo" : "update_promo"
      );
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
      case "select":
        return <AmountLabel {...obj} subtitle={subtitle} />;
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
