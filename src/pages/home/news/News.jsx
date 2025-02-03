import React, { useEffect, useState } from "react";
import { LinkNav, LinkCustom } from "../../../components/button/Button";

import css from "./News.module.scss";
import SwiperCore, { FreeMode, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
SwiperCore.use([FreeMode, Scrollbar]);
import "swiper/css";

import New from "../../../components/new/New";

import { getPosts } from "../../../api/queries";

const News = ({ data }) => {
  const [posts, setPosts] = useState([]);

  async function fetchData() {
    let ps = await getPosts(3);
    setPosts(ps.posts.edges);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  if (!posts.length) return;

  return (
    <section className={css.news}>
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

      <Swiper
        className={`slider_projects ${css.news_column}`}
        scrollbar={true}
        slidesPerView={"auto"}
        freeMode={true}
        grabCursor={true}
      >
        <SwiperSlide className={css.news_slide}>
          {posts.map((post, idx) => (
            <New
              key={idx}
              title={post.node.title}
              date={post.node.date}
              subtitle={post.node?.subtitle}
              icon={post.node.featuredImage.node}
              link={post.node.uri}
              tags={post.node?.tags}
              class={css.new_icon}
            ></New>
          ))}
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default News;
