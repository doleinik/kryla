import React, { useState, useContext, useEffect } from "react";
import { Button } from "../../components/button/Button";
import css from "./Profile.module.scss";

import PersonalData from "./data/Data";
import Password from "./password/Password";
import History from "./history/History";
import Shares from "./shares/Shares";
import Subscriptions from "./subscriptions/Subscriptions";
import AuthContext from "../../context/AuthProvider";
import {
  DeleteButton,
  LogoutButton,
} from "../../components/action-buttons/Button";
import store, { activeProm, closeAllPopUps } from "../../redux/state";
import DataContext from "../../context/DataProvider";

const navs = [
  {
    name: "Особисті дані",
    key: "data",
  },
  {
    name: "Змінити пароль",
    key: "password",
  },
  {
    name: "Історія внесків",
    key: "history",
  },
  {
    name: "Мої акції",
    key: "shares",
  },
  {
    name: "Мої підписки",
    key: "subscriptions",
  },
];

const Profile = (props) => {
  const { auth, setAuth } = useContext(AuthContext);
  const { data } = useContext(DataContext);
  const profileDelete = data.forms.profile_delete;

  const [alertPopUp, setAlert] = useState(false);
  const [activePart, setPart] = useState("shares");

  const openAlert = () => {
    store.setAlert({
      ...alertPopUp,
      danger: alertPopUp.action
        ? () => (
            <DeleteButton
              action={alertPopUp.action}
              onSuccess={closeAllPopUps}
            />
          )
        : false,
    });
  };

  useEffect(() => {
    alertPopUp ? openAlert() : closeAllPopUps();

    return () => {};
  }, [alertPopUp]);

  const parts = {
    data: <PersonalData forms={data.forms} auth={auth} alert={setAlert} />,
    password: <Password forms={data.forms} auth={auth} alert={setAlert} />,
    history: <History />,
    shares: <Shares id={auth?.user_id} editPopUp={activeProm} />,
    subscriptions: <Subscriptions store={store} close={closeAllPopUps} />,
  };

  return (
    <>
      <section className={css.profile}>
        <div className={css.text_content}>
          <h1 className={`small ${css.title}`}>Особистий кабінет</h1>
          {activePart == "shares" ? (
            <Button
              title="Створити акцію"
              class={"dark_button"}
              callBack={activeProm}
            />
          ) : null}
        </div>

        <div className={css.profile_content}>
          <div className={css.profile_content__nav}>
            <nav>
              {navs.map((nav, idx) => (
                <button
                  key={idx}
                  className={`link ${css.nav_btn} ${
                    activePart == nav.key ? css.active : ""
                  }`}
                  onClick={(e) => setPart(nav.key)}
                >
                  {nav.name}
                </button>
              ))}
            </nav>

            <div className={css.buttons}>
              <LogoutButton />
              <Button
                title="Видалити профіль"
                class={"red_button"}
                callBack={(e) =>
                  setAlert({
                    ...profileDelete.confirm_message,
                    close_title: "Скасувати",
                    action: profileDelete.endpoint,
                  })
                }
              />
            </div>
          </div>
          <div className={css.profile_content__data}>{parts[activePart]}</div>
        </div>
      </section>
    </>
  );
};

export default Profile;
