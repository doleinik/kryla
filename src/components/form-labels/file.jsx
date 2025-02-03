import React, { useState } from "react";
import fs from "../form/Form.module.scss";
import FileIcon from "../../assets/img/icon/file.svg";

export default function FileLabel({ label, invalid, change }) {
  const [fileName, setFileName] = useState(false);

  const { name, title, accept, type } = label;

  const onChange = (e) => {
    const name = e.target.files[0]?.name;
    setFileName(name || false);
    change(e);
  };

  return (
    <label
      className={`${fs.form_row} ${fs.file_label} ${
        invalid[name] ? fs.error : ""
      }`}
    >
      <span className={fs.placeholder}>{invalid[name]}</span>
      <div className={fs.f_name}>
        <input placeholder={title} readOnly value={fileName || ""} />
        <input type={type} accept={accept} name={name} onChange={onChange} />
        <div className={fs.icon}>
          <FileIcon />
        </div>
      </div>
    </label>
  );
}
