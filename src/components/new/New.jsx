import React from "react";
import css from "./New.module.scss";
import { NavLink } from "react-router-dom";
import LoadImage from "../load-image/Image";

const New = ({ title, subtitle, icon, link, date, tags, ...props }) => {
  return (
    <>
      <NavLink
        to={link}
        className={`${css.new} ${props.class ? props.class : ""} `}
      >
        <div className={css.icon} data-icon={true}>
          <LoadImage icon={icon} />
        </div>
        <div className={css.information}>
          <div className={css.tags}>
            {tags &&
              tags?.nodes.map((tag, idx) => (
                <div key={idx} className={`link ${css.tag}`}>
                  {tag.name}
                </div>
              ))}
          </div>
          <div className={css.date}>{date?.split("T")[0]}</div>
          <h4 className={css.title}>{title}</h4>
          <p className={css.subtitle}>{subtitle}</p>
        </div>
      </NavLink>
    </>
  );
};

export default New;
