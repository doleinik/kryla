import React from "react";
import css from "./Faq.module.scss";

const Faq = ({ data }) => {
  const toggleQuestions = (e) => {
    let button = e.target;
    let panel = button.nextElementSibling;
    let active = button.classList.contains(css.active);

    panel.style.maxHeight = active ? 0 : panel.scrollHeight + "px";
    button.classList.toggle(css.active, !active);
  };

  return (
    <section className={css.faq}>
      <div className={css.text_content}>
        <h1
          className={`${css.title}`}
          dangerouslySetInnerHTML={{ __html: data.title }}
        ></h1>
      </div>

      <div className={css.grid}>
        {data.faqs.map((q, idx) => (
          <div key={idx} className={css.q}>
            <div onClick={toggleQuestions} className={css.button}>
              <span className={css.ico}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 0C13.1046 0 14 0.89543 14 2V10H22C23.1046 10 24 10.8954 24 12C24 13.1046 23.1046 14 22 14H14V22C14 23.1046 13.1046 24 12 24C10.8954 24 10 23.1046 10 22V14H2C0.89543 14 0 13.1046 0 12C0 10.8954 0.89543 10 2 10H10V2C10 0.89543 10.8954 0 12 0Z"
                    fill="#76BC21"
                  />
                </svg>
              </span>

              <h3>{q.q}</h3>
            </div>
            <div className={css.panel}>
              <p> {q.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
