import React, { useEffect, useState } from "react";
import css from "./Support.module.scss";
import Goal from "../goal/Goal";
import { ButtonSupport } from "../../action-buttons/Button";
import { getSectionSupport } from "../../../api/queries";

const Support = (props) => {
  const [content, setContent] = useState(false);

  async function fetchData() {
    let data = await getSectionSupport();

    setContent(data);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  if (!content) return;

  return (
    <section className={css.support}>
      <div className={css.text_content}>
        <h1 className={css.title}>{content.title}</h1>
        <ButtonSupport
          title={content.button}
          class={`yellow_button ${css.link}`}
        />
      </div>

      <Goal
        steps={content.steps}
        class_grid={css.grid}
        class_icon={css.icon}
      ></Goal>
    </section>
  );
};

export default Support;
