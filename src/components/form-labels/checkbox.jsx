import React, { useState } from "react";
import fs from "../form/Form.module.scss";

export default function CheckboxLabel({ label, change }) {
  const { name, title } = label;

  return (
    <label className={fs.checkbox}>
      <input type="checkbox" name={name} onChange={change} />
      <span className={fs.checked}></span>
      <span
        className={`link`}
        dangerouslySetInnerHTML={{ __html: title }}
      ></span>
    </label>
  );
}
