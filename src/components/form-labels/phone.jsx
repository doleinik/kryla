import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input/input";
import fs from "../form/Form.module.scss";

export default function PhoneLabel({ label, invalid, change, def }) {
  const onChange = (value) => {
    change({ target: { name: name, value: value } });
  };

  const { name, title, placeholder } = label;

  return (
    <label className={`${fs.form_row} ${invalid[name] ? fs.error : ""}`}>
      <span className={fs.placeholder}>{invalid[name] ?? title}</span>

      <PhoneInput
        placeholder={placeholder}
        name={name}
        international
        country="UA"
        withCountryCallingCode
        value={def[name] || ""}
        onChange={onChange}
        maxLength={16}
      />
    </label>
  );
}
