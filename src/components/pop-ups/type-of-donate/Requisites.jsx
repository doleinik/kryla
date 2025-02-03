import React, { useState, useEffect } from "react";
import css from "../PopUp.module.scss";

import { CopyToClipboard } from "react-copy-to-clipboard";

import Copy from "../../../assets/img/copy.svg";
import Done from "../../../assets/img/done.svg";
import G1 from "../../../assets/img/icon/goal/goal_1.svg";

const requisitesGeneral = [
  {
    currency: "USD",
    wallet: "UA1111111111111111111111111111111111111",
    description: `JSC CB "PRIVATBANK", 1D HRUSHEVSKOHO STR., KYIV, 01001, UKRAINE, JSC CB "PRIVATBANK"`,
  },
  {
    currency: "EUR",
    wallet: "UA222222222222222222222222222222222222",
    description: `JSC CB "PRIVATBANK", 1D HRUSHEVSKOHO STR., KYIV, 01001, UKRAINE, JSC CB "PRIVATBANK"`,
  },
  {
    currency: "PLN",
    wallet: "UA33333333333333333333333333333333333",
    description: `JSC CB "PRIVATBANK", 1D HRUSHEVSKOHO STR., KYIV, 01001, UKRAINE, JSC CB "PRIVATBANK"`,
  },
];
const requisitesOther = [
  {
    title: "Реквізити благодійного фонду ”Крила надії”",
    wallet: "UA1111111111111111111111111111111111111",
    description: `Проєкт, аналітика, команда, оптимально, інструмент, координатор`,
  },
  {
    title: "Реквізити благодійного фонду ”Крила надії”",
    wallet: "UA222222222222222222222222222222222222",
    description: `Проєкт, аналітика, команда, оптимально, інструмент, координатор`,
  },
  {
    title: "Реквізити благодійного фонду ”Крила надії”",
    wallet: "UA33333333333333333333333333333333333",
    description: `Проєкт, аналітика, команда, оптимально, інструмент, координатор`,
  },
];

const Requisites = (props) => {
  const [copy, setCopy] = useState(false);

  useEffect(
    (e) => {
      if (!copy) return;
      setTimeout(() => setCopy(false), 2000);

      return (e) => {};
    },
    [copy]
  );

  return (
    <>
      <div className={css.requisites}>
        <div className={`${css.grid}`}>
          <h5 className={css.title}>Реквізити</h5>

          {requisitesGeneral.map((requisite, idx) => (
            <div className={css.requisite} key={idx}>
              <div className={css.information}>
                <h4 className={css.currency}>{requisite.currency}</h4>
                <p className={css.wallet}>{requisite.wallet}</p>
                <p className={css.description}>{requisite.description}</p>
              </div>

              <CopyToClipboard
                text={requisite.wallet}
                onCopy={() => setCopy(requisite.wallet)}
              >
                <button
                  className={`${css.copy} ${
                    copy == requisite.wallet ? css.active : ""
                  }`}
                >
                  {copy == requisite.wallet ? <Done /> : <Copy />}
                </button>
              </CopyToClipboard>
            </div>
          ))}
        </div>
        <div className={`${css.grid}`}>
          <h3 className={css.title}>Інші реквізити</h3>
          {requisitesOther.map((requisite, idx) => (
            <div className={css.requisite} key={idx}>
              <div className={css.ico}>
                <G1 />
              </div>
              <div className={css.information}>
                <h4 className={css.currency}>{requisite.title}</h4>
                <p>{requisite.description}</p>
              </div>
              <CopyToClipboard
                text={requisite.wallet}
                onCopy={() => setCopy(requisite.wallet)}
              >
                <button
                  className={`${css.copy} ${
                    copy == requisite.wallet ? css.active : ""
                  }`}
                >
                  {copy == requisite.wallet ? <Done /> : <Copy />}
                </button>
              </CopyToClipboard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Requisites;
