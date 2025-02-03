import React, { useContext, useEffect, useState } from "react";
import css from "./PopUp.module.scss";
import { Button } from "../button/Button";
import { activeLog, closeAllPopUps } from "../../redux/state";
import QuickDonation from "./type-of-donate/QuickDonation";
import Requisites from "./type-of-donate/Requisites";
import Additionally from "./type-of-donate/Additionally";
import { ButtonClose } from "../action-buttons/Button";
import AuthContext from "../../context/AuthProvider";
const Support = (props) => {
  const [type, setType] = useState("quick");
  const { auth } = useContext(AuthContext);

  const donate = {
    quick: <QuickDonation css={css} close={closeAllPopUps} {...props} />,
    requisites: <Requisites />,
    additionally: <Additionally />,
  };
  const donateType = [
    {
      title: "Швидкий донат",
      key: "quick",
    },
    {
      title: "Реквізити",
      key: "requisites",
    },
    {
      title: "Додатково",
      key: "additionally",
    },
  ];

  return (
    <div className={css.column__support}>
      <div className={css.content__scroll}>
        <div className={css.side_left}>
          <div className={css.buttons}>
            {donateType.map(({ key, title }) => (
              <button
                key={key}
                onClick={(e) => setType(key)}
                className={`${css.button} ${type == key ? css.active : ""}`}
              >
                {title}
              </button>
            ))}
          </div>
          <div className={css.bottom}>
            <p className={css.title}>
              Просимо звернути увагу на те, що при переказі коштів, ви
              автоматично погоджуєтеся з правилами нашого фонду:
            </p>
            <p className={css.subtitle}>
              При переказі коштів на розрахунковий рахунок благодійного фонду
              "Крила надії" для конкретної дитини, при неможливості використання
              коштів згідно цільового призначення ( завершення дитиною основного
              курсу лікування, відмова батьків від допомоги фонду, інші суттєві
              обставини) я даю дозвіл на використання залишку коштів на потреби
              інших дітей, що знаходяться під опікою фонду.
            </p>
            {!auth.user_id ? (
              <Button
                title="Увійти"
                class={"light_button"}
                callBack={activeLog}
              />
            ) : null}
          </div>
        </div>
        <div className={css.side_right}>{donate[type]}</div>
      </div>
      <ButtonClose addClass={css.close} />
    </div>
  );
};

export default Support;
