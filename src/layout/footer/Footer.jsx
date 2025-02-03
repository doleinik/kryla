import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import css from "./Footer.module.scss";
import Social from "../../components/social/Social";

import icon from "../../assets/img/logo_big.png";
import { ButtonSupport } from "../../components/action-buttons/Button";

const Footer = ({ menu, ...props }) => {
  const pagesNav = menu[1]?.menuItems?.edges.map((item) => {
    return {
      title: item.node.label,
      uri: item.node.uri,
    };
  });

  return (
    <>
      <footer className={css.footer}>
        <div className={css.left_column}>
          <NavLink to={"/"} className={css.logo}>
            <img src={icon} alt="" />
            {/* <LogoSvg /> */}
          </NavLink>

          <div className={css.column}>
            <nav className={css.links}>
              {pagesNav &&
                pagesNav.map((page, idx) => (
                  <div key={idx} className={css.link}>
                    <NavLink className={"link"} to={page.uri}>
                      {page.title}
                    </NavLink>
                  </div>
                ))}
            </nav>
            <div className={css.all_right}>
              <p>©2018 All right reserved</p>
            </div>
          </div>
        </div>
        <div className={css.center_column}>
          <div className={css.address}>
            <div className={css.column}>
              <div className={`${css.title}`}>Адреса</div>

              <div className="">
                <p>м. Львів. вул Городоцька 16.</p>
                <a href="">volonter.lviv@gmail.com6.</a>
              </div>
            </div>
            <div className={css.column}>
              <div className={`${css.title}`}>Адреса</div>

              <div className="">
                <p>
                  Нова Пошта м. Львів, відділення 5, БФ “КРИЛА НАДІЇ”,
                  тел.:0503709002.
                </p>
              </div>
            </div>
          </div>
          <div className={css.link}>
            <NavLink className={`link ${css.link}`} to={"/contact-us"}>
              Terms and conditions
            </NavLink>
          </div>
        </div>
        <div className={css.right_column}>
          <h5 className={css.title}>
            Готовий нам <br /> допомогти?
          </h5>
          <ButtonSupport title="Підтримати" />
        </div>

        <div className={css.socials}>
          <Social class={css.s} icon="facebook" link="dfsdfsdfdsf.dfdf" />
          <Social class={css.s} icon="instagram" link="dfsdfsdfdsf.dfdf" />
          <Social class={css.s} icon="twitter" link="dfsdfsdfdsf.dfdf" />
        </div>
      </footer>
    </>
  );
};

export default Footer;
