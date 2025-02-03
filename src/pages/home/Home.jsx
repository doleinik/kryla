import React, { useState, useEffect } from "react";

import Welcome from "./welcome/Welcome";
import About from "./about/About";
import Projects from "./projects/Projects";
import Help from "./help/Help";
import Support from "../../components/sections/support/Support";
import News from "./news/News";
import WhatWeDo from "../../components/sections/we-do/WeDo";
import { getPageHome } from "../../api/queries/pages";
const HomePage = (props) => {
  const [content, setContent] = useState(false);

  async function fetchData() {
    let data = await getPageHome();
    setContent(data);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  // if (!content) return;

  return (
    <>
      <Welcome data={content?.welcome} />
      <WhatWeDo />
      <Projects data={content?.fund} />
      <Help data={content?.help} />
      <Support />
      <News data={content?.news} />
    </>
  );
};

export default HomePage;
