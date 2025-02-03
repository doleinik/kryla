import React, { useState, useEffect } from "react";
import { fetchREST } from "../../api/fetchAPI";
import LiqPayEmbeddedCheckout from "./LiqPayEmbeddedCheckout";

const LiqPayCheckout = ({ id, amount, description }) => {
  const [pay, setPay] = useState("");

  const getLiqPayForm = async () => {
    const data = new FormData();
    data.append("id", id);
    data.append("amount", amount);
    data.append("description", description);

    const response = await fetchREST("buy-good", data);
    response && setPay(response);
  };

  useEffect(() => {
    getLiqPayForm();
  }, []);

  return (
    pay && <LiqPayEmbeddedCheckout data={pay.data} signature={pay.signature} />
  );

};

export default LiqPayCheckout;
