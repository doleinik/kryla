import React, { useState, useEffect } from "react";
import { LinkNav, LinkCustom } from "../../../components/button/Button";

import SwiperCore, { FreeMode, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
SwiperCore.use([FreeMode, Scrollbar]);
import "swiper/css";

import Project from "../../../components/project/Project";

import css from "./Projects.module.scss";
import { getProjects } from "../../../api/queries";

const Projects = ({ data }) => {
  const [projects, setProjects] = useState([]);

  async function fetchData() {
    let prom = await getProjects(5);
    setProjects(prom.edges);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  if (!projects.length) return;

  return (
    <section className={css.fond_project}>
      <div className={css.text_content}>
        <h1 className={`small ${css.title}`}>{data?.title}</h1>
        {data?.button.target ? (
          <>
            <LinkCustom
              link={data?.button.url}
              title={data?.button.title}
              class="yellow_button"
            />
          </>
        ) : (
          <LinkNav
            link={data?.button.url}
            title={data?.button.title}
            class="yellow_button"
          />
        )}
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
            {projects?.map(({ node }) => (
              <Project {...node} key={node.uri}></Project>
            ))}
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Projects;
