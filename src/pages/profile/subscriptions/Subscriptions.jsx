import React from "react";
import { Button } from "../../../components/button/Button";
import css from "./Subscriptions.module.scss";

const array = [
  {
    title: "Підтримка проекту: Допоможемо медикам рятувати дитячі серця!",
    date: "22 Жов 2022",
    sum: "250 грн",
  },
  {
    title: "Підтримка проекту: Допоможемо медикам рятувати дитячі серця!",
    date: "22 Жов 2022",
    sum: "250 грн",
  },
  {
    title: "Підтримка проекту: Допоможемо медикам рятувати дитячі серця!",
    date: "22 Жов 2022",
    sum: "250 грн",
  },
];

const Subscriptions = ({ store, close }) => {
  const openAlert = () => {
    store.setAlert({
      title: "Ви дійсно бажаєте скасувати підписку?",
      subtitle: "Ваша підписка буде скасовано.",
      danger: () => (
        <Button title="Видалити" class={"dark_button"} callBack={close} />
      ),
    });
  };

  
  return (
    <>
      <div className={css.content}>
        {array.map((sub, id) => (
          <div key={id} className={css.subscription}>
            <div className={css.info}>
              <h3 className={css.title}>{sub.title}</h3>

              <div className={css.description}>
                <p className={css.date}>
                  Дата першого списання коштів <span>{sub.date}</span>
                </p>
                <p className={css.sum}>
                  Сума списання <span>{sub.sum}</span>
                </p>
              </div>
            </div>

            <div className={css.buttons}>
              <Button title="Редагувати суму" class={`white_button`}></Button>
              <Button
                title="Скасувати підписку"
                class={`red_button ${css.btn}`}
                callBack={openAlert}
              ></Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Subscriptions;
