import React, { useEffect, useState } from "react";
import css from "./WhatWeDo.module.scss";
import { getSectionWeDo } from "../../../api/queries";
import LoadImage from "../../load-image/Image";
const WhatWeDo = (props) => {
  const [content, setContent] = useState(false);

  async function fetchData() {
    let data = await getSectionWeDo();

    setContent(data);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  if (!content) return;

  return (
    <section className={css.about_dream}>
      <div className={css.text_content}>
        <h1
          className={`small ` + css.title}
          dangerouslySetInnerHTML={{ __html: content.title }}
        ></h1>

        <div
          className={css.description}
          dangerouslySetInnerHTML={{ __html: content.subtitle }}
        ></div>
      </div>
      <div className={`${css.grid}`}>
        {content.todo.map((el, idx) => (
          <div key={idx} className={`${css.column}`}>
            <div className={css.icon}>
              <LoadImage icon={el.icon} />
            </div>
            <div className={css.description}>
              <h3 className={css.title}>{el.data.name}</h3>
              <p>{el.data.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeDo;
