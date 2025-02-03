import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { LinkNav, Button } from "../../../components/button/Button";
import css from "./History.module.scss";
import icon from "../../../assets/img/temp/home_icon.png";
import Help from "../../../components/need-help/Help";
import Arrow from "../../../assets/img/arrow.svg";

const History = (props) => {
  const array = ["", "", "", ""];
  const tabs = ["Усі внески", "Підтримані акції", "Підтримані проекти"];

  const [activeTab, setActiveTab] = useState(0);

  const handleClick = (id) => {
    setActiveTab(id);
  };

  return (
    <>
      <div className={css.content}>
        <div className={css.tabs}>
          <div className={css.tabs}>
            {tabs.map((t, idx) => (
              <button
                key={idx}
                id={idx}
                onClick={(e) => handleClick(idx)}
                className={`${css.tab} ${activeTab === idx ? css.active : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className={css.grid}>
          {array.map((t, idx) => (
            <Help
              key={idx}
              title={`Допоможемо медикам рятувати дитячі серця!`}
              subtitle="Кирил чекає на день, коли лікарі дозволять йому знову ганяти на самокаті. "
              icon={icon}
              link=""
              more=""
              class={css.history_icon}
            ></Help>
          ))}
        </div>
        <Button title="Показати більше" class={`${css.load_more}`}>
          <span className={css.arrow}>
            <Arrow></Arrow>
          </span>
        </Button>
      </div>
    </>
  );
};

export default History;
