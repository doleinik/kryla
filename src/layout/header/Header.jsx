import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import css from "./Header.module.scss";
import IconEnter from "../../assets/img/icon/enter.svg";
import IconProfile from "../../assets/img/icon/profile.svg";

import { Button } from "../../components/button/Button";
import Logo from "../../components/logo/Logo";
import { activeLog } from "../../redux/state";
import { ButtonSupport } from "../../components/action-buttons/Button";
import AuthContext from "../../context/AuthProvider";

const Header = ({ options, menu }) => {
  const { auth } = useContext(AuthContext);

  const pagesNav = menu[0]?.menuItems?.edges.map((item) => {
    return {
      title: item.node.label,
      uri: item.node.uri,
    };
  });

  return (
    <header className={css.header}>
      <div className={css.left}>
        <div className={css.logo}>
          <Logo></Logo>
        </div>
        <div className={css.language}>
          <h3 className={css.l}>EN</h3>
        </div>
        <nav className={css.links}>
          {pagesNav &&
            pagesNav.map((page, idx) => (
              <NavLink key={idx} className={`link`} to={page.uri}>
                {page.title}
              </NavLink>
            ))}
        </nav>
      </div>

      <div className={css.right}>
        <div className={css.buttons}>
          <Button title="Отримати підтримку" class={"light_button"} />
          <ButtonSupport />

          {!auth?.token ? (
            <button className={"link " + css.enter} onClick={activeLog}>
              <span className={css.i}>{<IconEnter />}</span>
              Увійти
              <span className={css.p}>{<IconProfile />}</span>
            </button>
          ) : (
            <NavLink className={`link ` + css.profile} to={"/profile"}>
              <span className={css.p}>
                {auth?.user_photo ? (
                  <img src={auth?.user_photo} alt="" />
                ) : (
                  <IconProfile />
                )}
              </span>
              {auth.first_name ?? "Профіль"}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
