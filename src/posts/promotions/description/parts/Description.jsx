import React from "react";

const Descriptions = ({ description, excerpt, css }) => {
  return (
    <div className={css.column_description}>
      <p>{excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  );
};

export default Descriptions;
