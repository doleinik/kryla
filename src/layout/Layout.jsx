import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import SideBar from "./aside/Aside";
import getMenu from "../utils/getMenu";
import PopUps from "../components/pop-ups/PopUp";

const ESCAPE_KEYS = ["27", "Escape"];

const Layout = (props) => {
  const menus = getMenu(props?.siteData?.menus?.nodes);
  const activePopUp = props?.active_pop_up;
  const setPopUp = (p) => props.state.setActivePopUp(p);

  const keyHandler = ({ key }) => {
    ESCAPE_KEYS.includes(String(key)) && setPopUp(false);
  };

  // Close PopUps on Escape
  useEffect(() => {
    activePopUp && document.addEventListener("keydown", keyHandler, false);

    return () => document.removeEventListener("keydown", keyHandler, false);
  }, [activePopUp]);

  return (
    <>
      <Header {...props} menu={menus.header} />
      <SideBar />
      <main>
        <Outlet />
      </main>
      <Footer {...props} menu={menus.footer} />
      <PopUps state={props.state} />
    </>
  );
};

export default Layout;
