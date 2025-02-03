import React, { useState, useEffect } from "react";

import Welcome from "./welcome/Welcome";
import Help from "./help/Help";
import Support from "./support/Support";
import Direct from "./direct/Direct";
import Faq from "./faq/Faq";
import { getPageBeneficiaries } from "../../api/queries/pages";

const BeneficiariesPage = (props) => {
  const [content, setContent] = useState(false);

  async function fetchData() {
    let data = await getPageBeneficiaries();

    setContent(data);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  if (!content) return;
  return (
    <>
      <Welcome data={content.welcome} />
      <Help data={content.values} />
      <Support data={content.weHelp} />
      <Direct data={content.direct} />
      <Faq data={content.faq} />
    </>
  );
};

export default BeneficiariesPage;
