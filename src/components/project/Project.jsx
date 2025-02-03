import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../button/Button";
import css from "./Project.module.scss";

import Arrow from "../../assets/img/arrow.svg";
import LoadImage from "../load-image/Image";
import { activeSup } from "../../redux/state";
const Project = ({ title, featuredImage, databaseId, uri, ...props }) => {
  useEffect(() => {
    return () => localStorage.removeItem("project_id");
  });
  const openSupport = () => {
    localStorage.setItem("project_id", databaseId);
    activeSup();
  };

  return (
    <>
      <div className={css.project + " " + props.class}>
        <div className={css.icon}>
          <LoadImage icon={featuredImage?.node} />
        </div>

        <div className={css.information}>
          <h4 className={css.title}>{title}</h4>
          <div className={css.buttons}>
            <Button
              link={uri}
              title="Підтримати"
              class={css.help}
              callBack={openSupport}
            />
            <NavLink to={uri} className={`link ${css.link_more}`}>
              Більше
              <span>
                <Arrow />
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;
