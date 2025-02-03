import React, { useEffect, useContext } from "react";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

import css from "./PopUp.module.scss";

import Login from "./Login";
import Registration from "./Registration";
import ResetPassword from "./ResetPassword";
import Support from "./Support";
import Promotion from "./Promotion";
import JoinToTeam from "./JoinTeam";
import AlertMessage from "./success/success";
import DataContext from "../../context/DataProvider";
import AddPromUpdate from "./AddPromUpdate";

const PopUps = ({ state }) => {
  const {
    data: { forms },
  } = useContext(DataContext);

  const active = state.getState().active_pop_up;

  const parts = {
    login: <Login form={forms.user_login} />, // done update
    registr: <Registration form={forms.user_register} />, // done update
    reset: <ResetPassword state={state} form={forms.password_reset} />, // done update
    support: <Support form={forms} active={active} state={state} />,
    support_promo: <Support form={forms} active={active} state={state} />,
    promo: <Promotion state={state} form={forms.create_promotion} />,  // done update
    prom_up: <AddPromUpdate state={state} form={forms.promo_history_update} />,  // done update
    join: <JoinToTeam state={state} form={forms.join_team} />,  // done update
    alert: <AlertMessage state={state} />,
  };

  useEffect(() => {
    active && disableBodyScroll(document.body);

    return () => clearAllBodyScrollLocks();
  }, [active]);

  const onPopClick = ({ target }) => {
    target.dataset.close && state.setActivePopUp(false);
  };

  return (
    <>
      <div
        className={`${css.pop_up} ${active ? css.active : ""}`}
        onClick={onPopClick}
        data-close="true"
      >
        {parts[active]}
      </div>
    </>
  );
};

export default PopUps;
