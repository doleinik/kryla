import React, { useState } from "react";
import fs from "../form/Form.module.scss";

export default function AmountLabel({ label, amount, setAmount, subtitle }) {
  const { name, title, options } = label;

  const changeClass = (val) => {
    return amount == val.split(" ")[0] ? fs.active : "";
  };
  const changeAmount = ({ target }) => {
    const dataset = target.dataset.value;
    let value = dataset ? dataset.split(" ")[0] : target.value;
    value = value < 1 ? "" : value;
    setAmount(value);
  };

  return (
    <label className={fs.form_row + " " + fs.amount}>
      {subtitle ? <h4>{subtitle}</h4> : null}

      <div className={fs.sums}>
        {options &&
          options.map(({ value }) => (
            <button
              key={value}
              type="button"
              data-value={value}
              name={name}
              onClick={changeAmount}
              className={`${fs.s} ${changeClass(value)}`}
            >
              {value}
            </button>
          ))}
      </div>
      <input
        type="number"
        name={name}
        placeholder={title}
        value={amount}
        onInput={changeAmount}
      />
    </label>
  );
}
