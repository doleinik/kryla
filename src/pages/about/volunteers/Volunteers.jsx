import React from "react";
import { Button } from "../../../components/button/Button";
import SwiperCore, { FreeMode, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
SwiperCore.use([FreeMode, Scrollbar]);
import "swiper/css";

import css from "./Volunteers.module.scss";
import LoadImage from "../../../components/load-image/Image";
import { activeTeam } from "../../../redux/state";

const Volunteers = ({ data }) => {
  if (!data) return;

  return (
    <section className={css.volunteers}>
      <div className={css.text_content}>
        <h1 className={`small ${css.title}`}>{data.title}</h1>
        <Button
          title={data.button}
          class={`yellow_button ${css.link}`}
          callBack={activeTeam}
        />
      </div>

      <div className={css.volunteers_grid}>
        <Swiper
          className={`slider_projects ${css.volunteers_slider}`}
          scrollbar={true}
          slidesPerView={"auto"}
          freeMode={true}
          grabCursor={true}
        >
          <SwiperSlide className={css.volunteers_slide}>
            {data.teams.map(({ data, icon }, idx) => (
              <div key={idx} className={css.volunteer}>
                <div className={css.icon}>
                  <LoadImage icon={icon} />
                </div>
                <div className={css.information}>
                  <h4 className={css.title}>{data.name}</h4>
                  <p className={css.position}>{data.description}</p>
                </div>
              </div>
            ))}
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Volunteers;
