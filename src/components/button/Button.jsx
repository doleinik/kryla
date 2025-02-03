import React from "react";
import css from "./Button.module.scss";
import { NavLink } from "react-router-dom";

const Text = ({ title }) => {
  return <span className={css.taxt}>{title}</span>;
};

const Button = ({ type, title, disabled, ...props }) => {
  const callBackFn = () => {
    if (!props.callBack) return;
    return props.callBack();
  };
  return (
    <button
      onClick={callBackFn}
      type={type ? type : "button"}
      disabled={disabled}
      className={`link ${css.button} ${props.class ? props.class : ""}`}
    >
      {title && <Text title={title} />}
      {props.children}
    </button>
  );
};
const LinkCustom = ({ type, title, link, ...props }) => {
  return (
    <a
      href={link}
      target="_blank"
      className={`link ${css.button} ${props.class ? props.class : ""}`}
    >
      <Text title={title} />
    </a>
  );
};
const LinkNav = ({ type, title, link, ...props }) => {
  return (
    <NavLink
      to={link}
      className={`link ${css.button} ${props.class ? props.class : ""}`}
    >
      <Text title={title} />
    </NavLink>
  );
};

export { Button, LinkCustom, LinkNav };
