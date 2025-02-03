import React from "react";

import icon from "../../../../assets/img/temp/home_icon.png";

const Payments = ({ css, payments }) => {
  const array = ["", "", "", "", "", "", "", ""];
  console.log("payments", payments);

  return (
    <div className={css.column_payments}>
      {payments ? (
        payments.map(({ item }, idx) => (
          <div key={idx} className={css.payment}>
            <div className={css.ico}>
              <img src={icon} alt="" />
            </div>
            <div className={css.info}>
              <p className={css.date}> {item.date}</p>
              <h4 className={css.name}>{item.name}</h4>
              <div className={css.money}>{item.count}</div>
              <p className={css.subtitle}>{item.coment}</p>
            </div>
          </div>
        ))
      ) : (
        <h3>This promotion has no payments yet</h3>
      )}
    </div>
  );
};

export default Payments;
