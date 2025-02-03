import React, { useEffect, useState, useRef } from "react";
import { LinkNav, Button } from "../../components/button/Button";
import css from "./News.module.scss";

import Arrow from "../../assets/img/arrow.svg";

import Support from "../../components/sections/support/Support";
import New from "../../components/new/New";
import { getPosts } from "../../api/queries";

const NewsPage = (props) => {
  const [categories, setCategories] = useState(false);
  const [posts, setPosts] = useState([]);
  const [categoryId, setCatId] = useState(false);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [count, setCount] = useState(3);
  const skeleton = new Array(count).fill(0);

  async function fetchData(end = endCursor, clear = false) {
    setLoading(true);

    let ps = await getPosts(count, end, categoryId, categories);

    setPosts(clear ? ps.posts.edges : [...posts, ...ps.posts.edges]);
    !categories && setCategories(ps?.categories.nodes);
    setEndCursor(ps?.posts.pageInfo?.endCursor);
    setHasNextPage(ps?.posts.pageInfo?.hasNextPage);
    setCount(4);
    setLoading(false);
  }

  const changeCategory = () => fetchData(null, true);

  const loadMore = () => fetchData();

  useEffect(() => {
    // fetchData();
    setPosts([]);
    setCount(3);
    changeCategory();
    return () => {};
  }, [categoryId]);

  let postsList = posts.map((post, idx) => (
    <New
      key={idx}
      title={post.node.title}
      date={post.node.date}
      subtitle={post.node?.subtitle}
      icon={post.node.featuredImage.node}
      link={post.node.uri}
      tags={post.node?.tags}
      class={css.grid_icon}
    ></New>
  ));

  let skeletonList = skeleton.map((e, idx) => (
    <div key={idx} className={`${css.skeleton} ${css.grid_icon}`}>
      <div className={`${css.icon} ${css.bg}`}></div>
      <div className={css.information}>
        <div className={css.tags}>
          <div className={`${css.tag} ${css.bg}`}></div>
          <div className={`${css.tag} ${css.bg}`}></div>
          <div className={`${css.tag} ${css.bg}`}></div>
        </div>
        <div className={`${css.date} ${css.bg}`}></div>
        <h4 className={`${css.bg}`}></h4>
        <div className={`${css.subtitle} ${css.bg}`}></div>
      </div>
    </div>
  ));

  return (
    <>
      <section className={css.shares}>
        <div className={css.text_content}>
          <div>
            <h1 className={`${css.title}`}>Новини</h1>
            <div className={`${css.tags} ${isLoading ? css.loading : ""}`}>
              {categories ? (
                <>
                  <button
                    className={`link ${css.tag} ${
                      !categoryId ? css.active : ""
                    }`}
                    onClick={() => setCatId(false)}
                  >
                    Усі
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.databaseId}
                      className={`link ${css.tag} ${
                        categoryId == cat.databaseId ? css.active : ""
                      }`}
                      onClick={() => setCatId(cat.databaseId)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </>
              ) : (
                skeleton.map((e, i) => (
                  <div key={i} className={`${css.sk_tag} ${css.bg}`}></div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={css.grid}>
          {postsList}
          {isLoading && skeletonList}
        </div>

        {hasNextPage ? (
          <Button
            disabled={isLoading}
            callBack={loadMore}
            title="Показати більше"
            class={`${css.load_more}`}
          >
            <span className={css.arrow}>
              <Arrow></Arrow>
            </span>
          </Button>
        ) : null}
      </section>

      <Support />
    </>
  );
};

export default NewsPage;
