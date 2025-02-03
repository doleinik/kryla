import React, { useState, useEffect } from "react";
import { Button } from "../../../components/button/Button";

import css from "./Welcome.module.scss";

import Arrow from "../../../assets/img/arrow.svg";

import Help from "../../../components/need-help/Help";

import { getPromotions } from "../../../api/queries";
// import store from "../../../redux/state";

const tags = [
  {
    name: "Активні",
    status: "active",
  },
  {
    name: "Завершені",
    status: "finished",
  },
  {
    name: "Усі",
    status: false,
  },
];

const Welcome = ({ state }) => {
  const [promotions, setPromotions] = useState([]);
  const [status, setStatus] = useState("active");
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const count = 4;
  const skeleton = new Array(count).fill(0);

  const need_update = state.getState().need_update;

  // console.log("need_update", need_update);

  async function fetchData(end = endCursor, clear = false) {
    setLoading(true);

    let prom = await getPromotions(count, end, status);

    setPromotions(clear ? prom.edges : [...promotions, ...prom.edges]);
    setEndCursor(prom?.pageInfo?.endCursor);
    setHasNextPage(prom?.pageInfo?.hasNextPage);
    state.setUpdate(false);
    setLoading(false);
  }

  const changeTag = () => fetchData(null, true);

  const loadMore = () => fetchData();

  useEffect(() => {
    setPromotions([]);
    changeTag();
    localStorage.setItem("page_promo", true);

    return () => {
      localStorage.removeItem("page_promo");
    };
  }, [status]);

  // useEffect(() => {
  //   // console.log("need_update", need_update);
  //   // if (need_update == "page_promo") {
  //   //   fetchData();
  //   // }
  //   // return () => {};
  // }, [need_update]);

  let promotionsList = promotions?.map(({ node }) => (
    <Help
      title={node.title}
      subtitle={node.promotion_options.excerpt}
      icon={node.featuredImage?.node}
      post_id={node.databaseId}
      key={node.databaseId}
      link={node.uri}
      status={node.promotion_options.status}
      class={css.grid_icon}
      sum={node.promotion_options.sum}
      collected={node.promotion_options.collected}
    ></Help>
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
    <section className={css.shares}>
      <div className={css.text_content}>
        <h1 className={`${css.title}`}>
          Кому <br /> допомогти
        </h1>
        <div className={`${css.tags} ${isLoading ? css.loading : ""}  `}>
          {tags.map((tag, idx) => (
            <button
              key={idx}
              className={`link ${css.tag} ${
                status == tag.status ? css.active : ""
              }`}
              onClick={(e) => setStatus(tag.status)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className={`${css.grid} ${isLoading ? css.loading : ""}`}>
        {promotionsList}
        {isLoading && skeletonList}
      </div>

      {hasNextPage ? (
        <Button
          disabled={isLoading}
          callBack={loadMore}
          title="Показати більше"
          class={`${css.load_more}`}
        >
          <span className={css.arrow}>
            <Arrow></Arrow>
          </span>
        </Button>
      ) : null}
    </section>
  );
};

export default Welcome;
