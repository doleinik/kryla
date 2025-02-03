import React, { useState } from "react";
import fs from "../form/Form.module.scss";
import Eye from "../../assets/img/icon/eye.svg";

const ps = "password";
const tx = "text";

export default function InputLabel({ label, invalid, change, def }) {
  const [showPass, setPassword] = useState(false);
  const [isPass, setPass] = useState(label.type === ps);
  const { name, title, placeholder } = label;

  return (
    <label className={`${fs.form_row} ${invalid[name] ? fs.error : ""}`}>
      <span className={fs.placeholder}>{invalid[name] ?? title}</span>

      <input
        type={isPass ? (showPass ? tx : ps) : tx}
        name={name}
        placeholder={placeholder}
        defaultValue={def?.[name] || ""}
        onChange={change}
      />

      {isPass ? (
        <span
          className={`${fs.eye}  ${showPass ? fs.active : ""}`}
          onClick={(e) => setPassword(!showPass)}
        >
          <Eye />
        </span>
      ) : null}
    </label>
  );
}
