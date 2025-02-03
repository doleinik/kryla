import React, { useState, useEffect } from "react";
import fs from "../../form/Form.module.scss";
import SupportFund from "./support-fund/Fund";
import SupporPromo from "./support-promo/Promo";

const QuickDonation = (props) => {
  const [steps, setStep] = useState({ active: ["fr"] });

  const isActive = (st) => {
    return steps.active.includes(st) ? css.active : "";
  };

  const css = props.css;
  const suppurtForm = {
    support: (
      <SupportFund
        {...props}
        fs={fs}
        steps={steps}
        setStep={setStep}
        isActive={isActive}
      />
    ),
    support_promo: (
      <SupporPromo
        {...props}
        fs={fs}
        steps={steps}
        setStep={setStep}
        isActive={isActive}
      />
    ),
  };

  return (
    <>
      <div className={css.steps}>
        <div className={`${css.step}  ${isActive("fr")}`}>
          <div className={css.ico}></div>
          <div className={css.text}>{props.form?.donation_amount?.subtitle}</div>
        </div>
        <div className={css.line}></div>

        <div className={`${css.step}  ${isActive("sec")}`}>
          <div className={css.ico}></div>
          <div className={css.text}>{props.form?.donation_data?.subtitle}</div>
        </div>
        <div className={css.line}></div>
        <div className={css.step}>
          <div className={css.ico}></div>
          <div className={css.text}>Оплатіть</div>
        </div>
      </div>

      <div className={css.quick_donation}>{suppurtForm[props.active]}</div>
    </>
  );
};

export default QuickDonation;
