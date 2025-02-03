import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
import { Button } from "../../../components/button/Button";
import css from "./Shares.module.scss";
import Help from "../../../components/need-help/Help";
// import Arrow from "../../../assets/img/arrow.svg";
import { fetchREST } from "../../../api/fetchAPI";

const tabs = [
  { name: "Усі акції", status: false },
  { name: "Активні", status: "active" },
  { name: "Історія", status: "finished" },
];

const History = ({ id, editPopUp, ...props }) => {
  const [isSending, setSending] = useState(false);
  const [response, setResponse] = useState(false);
  const [status, setStatus] = useState(false);
  const [noProms, setNoProms] = useState(false);
  const skeleton = new Array(3).fill(0);

  const handleSubmit = async () => {
    const d = new FormData();
    setSending(true);
    setResponse(false);
    setNoProms(false);
    d.append("user_id", id);
    status && d.append("status", status);
    const response = await fetchREST("promotions", d);
    response?.data ? setResponse(response) : setNoProms(response.message);
    setSending(false);
  };

  const editPostById = (id) => {
    localStorage.setItem("edit_post_id", id);
    editPopUp();
  };

  useEffect(() => {
    handleSubmit();

    return () => {};
  }, [status]);

  let promotionsList = response?.data?.map((t, idx) => (
    <Help
      key={idx}
      title={t.promo_title}
      subtitle={t.promo_excerpt}
      status={t.promo_status}
      icon={t.promo_featured_image_arr}
      link={t?.promo_link}
      sum={t?.promo_sum}
      collected={t?.promo_collected}
      class={css.history_icon}
      can_edit={true}
    >
      <Button title="Редагувати" callBack={() => editPostById(t.promo_id)} />
    </Help>
  ));

  let skeletonList = skeleton.map((e, idx) => (
    <div key={idx} className={css.skeleton}>
      <div className={`${css.icon} ${css.bg}`}></div>

      <div className={css.information}>
        <div className={`${css.money} ${css.bg}`}></div>
        <h4 className={`${css.title} ${css.bg}`}></h4>
        <p className={`${css.subtitle} ${css.bg}`}></p>
        <div className={css.buttons}>
          <div className={`${css.b} ${css.bg}`}></div>
          <div className={`${css.b} ${css.bg}`}></div>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <div className={css.content}>
        <div className={`${css.tabs} ${isSending ? css.loading : ""}`}>
          {tabs.map((t, idx) => (
            <button
              key={idx}
              onClick={(e) => setStatus(t.status)}
              className={`${css.tab} ${status === t.status ? css.active : ""}`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {noProms ? (
          <div className={css.no_proms}>
            <h4>{noProms}</h4>
          </div>
        ) : (
          <div className={css.grid}>
            {response ? promotionsList : null}
            {isSending && skeletonList}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
