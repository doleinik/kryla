import React, { useEffect, useState } from "react";
import fs from "../form/Form.module.scss";

export default function SelectLabel({ label, change }) {
  const { name, title, options } = label;

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0].value);

  const closeList = () => setOpen(false);

  useEffect(() => {
    closeList();
    return () => {};
  }, [selected]);

  return (
    <label
      className={`${fs.form_row} ${fs.form_select} ${isOpen ? fs.active : ""}`}
      onMouseLeave={closeList}
    >
      <span className={fs.placeholder}>{title}</span>
      <input
        type="text"
        name={name}
        value={selected}
        readOnly
        onClick={(e) => setOpen(!isOpen)}
      />

      {isOpen && (
        <div className={fs.select_list}>
          {options.map(({ value }, idx) => (
            <div
              key={idx}
              onClick={(e) => setSelected(value)}
              className={`${fs.l} ${selected == value ? fs.selected : ""}`}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </label>
  );
}
