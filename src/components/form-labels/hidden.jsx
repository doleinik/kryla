import React from "react";
import fs from "../form/Form.module.scss";

export default function HiddenLabel({ name, def }) {
  return (
    <label className={fs.hidden}>
      <input type="text" name={name} defaultValue={def} readOnly />
    </label>
  );
}
