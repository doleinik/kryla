import React, { useState, useEffect } from "react";
import fs from "../form/Form.module.scss";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function DateLabel({ label }) {
  const { name, title, placeholder } = label;
  const [value, onChange] = useState(new Date());
  const [isOpen, setOpen] = useState(false);

  const closeCalendar = () => setOpen(false);
  
  useEffect(() => {
    isOpen && closeCalendar();
    return () => {};
  }, [value]);

  const getDate = () => {
    let d = value.getDate();
    let m = value.getMonth() + 1;
    let y = value.getFullYear();

    d = d < 10 ? `0${d}` : d;
    m = m < 10 ? `0${m}` : m;
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <label
        className={`${fs.form_row} ${fs.date}`}
        onMouseLeave={closeCalendar}
      >
        <span className={fs.placeholder}>{title}</span>

        <input
          type="text"
          readOnly
          name={name}
          placeholder={placeholder}
          value={getDate()}
          onClick={(e) => setOpen(true)}
        />
        {isOpen ? (
          <Calendar className="calendar" onChange={onChange} on value={value} />
        ) : null}
      </label>
    </>
  );
}
