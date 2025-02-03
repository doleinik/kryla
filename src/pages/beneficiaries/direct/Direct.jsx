import React from "react";
import css from "./Direct.module.scss";

const Direct = ({ data }) => {
  return (
    <section className={css.direct_help}>
      <div className={css.text_content}>
        <h1 className={`small ${css.title}`}>{data.title}</h1>
        <h3 className={css.subtitle}>{data.subtitle}</h3>
      </div>

      <div className={css.grid}>
        {data.lists.map((t, idx) => (
          <h4 key={idx} className={css.list}>
            {t.l}
          </h4>
        ))}
      </div>
    </section>
  );
};

export default Direct;
