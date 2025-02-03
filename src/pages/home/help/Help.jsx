import React, { useEffect, useState } from "react";

import { ButtonSupport } from "../../../components/action-buttons/Button";

import SwiperCore, { FreeMode, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
SwiperCore.use([FreeMode, Scrollbar]);
import "swiper/css";

import HelpSlide from "../../../components/need-help/Help";

import css from "./Help.module.scss";
import { getPromotions } from "../../../api/queries";

const Help = ({ data }) => {
  const [promotions, setPromotions] = useState([]);

  async function fetchData() {
    let prom = await getPromotions(10, null, "active");
    setPromotions(prom.edges);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  if (!promotions.length) return;

  return (
    <section className={css.need_help}>
      <div className={css.text_content}>
        <h1 className={`small ${css.title}`}>{data?.title}</h1>
        <ButtonSupport
          title={data?.button}
          class={`yellow_button ${css.link}`}
        />
      </div>

      <div className={css.projects}>
        <Swiper
          className={`slider_projects ${css.projects_slider}`}
          scrollbar={true}
          slidesPerView={"auto"}
          freeMode={true}
          grabCursor={true}
        >
          <SwiperSlide className={css.project_slide}>
            {promotions?.map(({ node }) => (
              <HelpSlide
                title={node.title}
                subtitle={node.promotion_options.excerpt}
                icon={node.featuredImage?.node}
                post_id={node.databaseId}
                key={node.databaseId}
                link={node.uri}
                status={node.promotion_options.status}
                sum={node.promotion_options.sum}
                collected={node.promotion_options.collected}
              ></HelpSlide>
            ))}
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Help;
