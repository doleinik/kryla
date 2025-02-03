import React, { useEffect, useState } from "react";

import Welcome from "./welcome/Welcome";
import Description from "./description/Description";
import More from "./more/More";
import { useParams } from "react-router-dom";
import { getPromotion } from "../../api/queries";
import store from "../../redux/state";

const SinglePromotion = (props) => {
  const { slug } = useParams();
  const [data, setData] = useState(false);
  const { need_update } = store.getState();

  async function fetchData() {
    let promotion = await getPromotion(slug);
    setData(promotion);
    store.setUpdate(false);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  useEffect(() => {
    if (need_update == "update_promo") {
      fetchData();
    }
    return () => {};
  }, [need_update]);

  useEffect(() => {
    data && localStorage.setItem("promo_id", data?.promotion?.databaseId);
    return () => {
      localStorage.removeItem("promo_id");
    };
  }, [data]);

  if (!data) return null;

  return (
    <>
      <Welcome data={data?.promotion} />
      <Description
        data={data?.promotion?.promotion_options}
        autotId={data?.promotion?.authorDatabaseId}
      />
      <More />
    </>
  );
};

export default SinglePromotion;
