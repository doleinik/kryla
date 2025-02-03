import React from "react";
import css from "./Goal.module.scss";

const Goal = ({ steps, class_icon, class_grid }) => {
  if (!steps) return;
  return (
    <>
      <div className={`${css.goal_grid} ${class_grid}`}>
        {steps.map((s, idx) => (
          <div key={idx} className={`${class_icon} ${css.column}`}>
            <div className={css.icon}>
              <img src={s.icon.sourceUrl} alt="" />
            </div>
            <div className={css.description}>
              <h3 className={css.title}>{s.data.name}</h3>
              <p>{s.data.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Goal;
