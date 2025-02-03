import React, { useState } from "react";

import css from "./Description.module.scss";
import Update from "./parts/Updates";
import Descriptions from "./parts/Description";
import Payments from "./parts/Payments";

const tabs = [
  {
    title: "Опис",
    key: "descr",
  },
  {
    title: "Оновлення",
    key: "update",
  },

  {
    title: "Платежі",
    key: "payment",
  },
];

const Description = ({ data, autotId }) => {
  const parts = {
    update: <Update {...data} id={autotId} css={css} />,
    descr: <Descriptions {...data} css={css} />,
    payment: <Payments css={css} payments={data.payments} />,
  };

  const [active, setPart] = useState("descr");

  return (
    <section className={css.project_description}>
      <div className={css.tabs}>
        <div className={css.tabs}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={(e) => setPart(t.key)}
              className={`${css.tab} ${active === t.key ? css.active : ""}`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      <div className={css.column}>{parts[active]}</div>
    </section>
  );
};

export default Description;
