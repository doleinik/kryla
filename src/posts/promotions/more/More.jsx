import React, { useState } from "react";

import icon from "../../../assets/img/temp/home_icon.png";

import { LinkNav } from "../../../components/button/Button";
import Help from "../../../components/need-help/Help";

import css from "./More.module.scss";

const More = (props) => {
  return (
    <section className={css.more_share}>
      <div className={css.text_content}>
        <h1 className={`small ${css.title}`}>Більше акцій</h1>
        <LinkNav
          link="/shares"
          title="Більше акцій"
          class={`yellow_button ${css.link}`}
        />
      </div>
      <div className={css.grid}>
        <Help
          title={`Допоможемо медикам рятувати дитячі серця!`}
          subtitle="Кирил чекає на день, коли лікарі дозволять йому знову ганяти на самокаті. "
          icon={icon}
          link=""
          more=""
          class={css.more_icon}
        ></Help>
        <Help
          title={`Допоможемо медикам рятувати дитячі серця!`}
          subtitle="Кирил чекає на день, коли лікарі дозволять йому знову ганяти на самокаті. "
          icon={icon}
          link=""
          more=""
          class={css.more_icon}
        ></Help>
        <Help
          title={`Допоможемо медикам рятувати дитячі серця!`}
          subtitle="Кирил чекає на день, коли лікарі дозволять йому знову ганяти на самокаті. "
          icon={icon}
          link=""
          more=""
          class={css.more_icon}
        ></Help>
        <Help
          title={`Допоможемо медикам рятувати дитячі серця!`}
          subtitle="Кирил чекає на день, коли лікарі дозволять йому знову ганяти на самокаті. "
          icon={icon}
          link=""
          more=""
          class={css.more_icon}
        ></Help>
      </div>
    </section>
  );
};

export default More;
