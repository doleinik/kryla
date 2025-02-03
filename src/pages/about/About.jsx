import React, { useState, useEffect } from "react";

import Welcome from "./welcome/Welcome";
import Values from "./values/Values";
import Volunteers from "./volunteers/Volunteers";
import WhatWeDo from "../../components/sections/we-do/WeDo";
import Support from "../../components/sections/support/Support";
import { getPageAboutFund } from "../../api/queries/pages";

const FondPage = (props) => {
  const [content, setContent] = useState(false);

  async function fetchData() {
    let data = await getPageAboutFund();
    setContent(data);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  return (
    <>
      <Welcome data={content?.welcome} />
      <Values data={content?.values} />
      <WhatWeDo />
      <Volunteers data={content?.teams} />
      <Support></Support>
    </>
  );
};

export default FondPage;
