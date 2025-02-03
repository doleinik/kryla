import React from "react";

import css from "./Support.module.scss";
import LoadImage from "../../../components/load-image/Image";

const Support = ({ data }) => {
  return (
    <section className={css.we_help}>
      <div className={`${css.grid}`}>
        {data.lists.map((list, idx) => (
          <div key={idx} className={`${css.column}`}>
            <div className={css.icon}>
              <LoadImage icon={list.icon} />
            </div>

            <div className={css.information}>
              {idx == 0 ? (
                <div className={css.text_content}>
                  <h1
                    className={css.title}
                    dangerouslySetInnerHTML={{ __html: data.title }}
                  ></h1>
                </div>
              ) : null}

              <h2 className={css.title}>{list.data.name}</h2>
              <p className={css.description}>{list.data.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Support;
