import React from "react";

import Support from "../../components/sections/support/Support";
import Welcome from "./welcome/Welcome";
import store from "../../redux/state";

const Promotions = (props) => {
  return (
    <>
      <Welcome state={store} />
      <Support />
    </>
  );
};

export default Promotions;
