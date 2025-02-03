import React from "react";
import css from "../PopUp.module.scss";

import G1 from "../../../assets/img/icon/goal/goal_1.svg";

const requisitesAdditionally = [
  {
    title: "Схема проплати через термінали Приват банку",
    description: `Власники платіжних карт Visa і MasterCard можуть здійснити благодійний внесок скориставшись системою он-лайн платежів LiqPAY: коміссія при переказі складе 2,75 % (коміссія банку)`,
  },
  {
    title: "Щоб Відключити місячний платіж ознайомтеся тут",
    description: `Ви також можете відключити підписку самостійно, скориставшись особистим кабінетом`,
  },
  {
    title: "Якщо у вас зв’яилися питання",
    description: `пишіть нам сюди supprtkrula@gmail.com`,
  },
];

const Additionally = () => {
  return (
    <>
      <div className={css.requisites}>
        <div className={`${css.grid}`}>
          <h5 className={css.title}>Додатково</h5>
          {requisitesAdditionally.map((requisite, idx) => (
            <div className={css.requisite} key={idx}>
              <div className={css.ico}>
                <G1 />
              </div>
              <div className={css.information}>
                <h4 className={css.currency}>{requisite.title}</h4>
                <p>{requisite.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Additionally;
