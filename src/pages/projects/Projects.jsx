import React, { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import Project from "../../components/project/Project";
import css from "./Projects.module.scss";

import Arrow from "../../assets/img/arrow.svg";
import { getProjects } from "../../api/queries";
import { ButtonSupport } from "../../components/action-buttons/Button";

const ProjectsPage = (props) => {
  const [projects, setProjects] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [count, setCount] = useState(5);
  const skeleton = new Array(count).fill(0);

  async function fetchData(end = endCursor) {
    setLoading(true);

    let prom = await getProjects(count, end);

    setProjects([...projects, ...prom.edges]);
    setEndCursor(prom?.pageInfo?.endCursor);
    setHasNextPage(prom?.pageInfo?.hasNextPage);

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    setCount(3);
    return () => {};
  }, []);

  let skeletonList = skeleton.map((e, idx) => (
    <div key={idx} className={css.skeleton}>
      <div className={`${css.icon} ${css.bg}`}></div>
      <div className={css.information}>
        <h4 className={`${css.bg}`}></h4>
        <div className={css.buttons}>
          <div className={`${css.b} ${css.bg}`}></div>
          <div className={`${css.b} ${css.bg}`}></div>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <section className={css.projects}>
        <div className={css.text_content}>
          <h1 className={`${css.title}`}>
            Проекти <br /> фонду
          </h1>
          <ButtonSupport title="Підтримати всі" />
        </div>

        <div className={css.grid}>
          {projects &&
            projects?.map(({ node }) => (
              <Project {...node} key={node.uri} class={css.grid_icon}></Project>
            ))}
          {isLoading && skeletonList}
        </div>

        {hasNextPage ? (
          <Button
            disabled={isLoading}
            callBack={fetchData}
            title="Показати більше"
            class={`${css.load_more}`}
          >
            <span className={css.arrow}>
              <Arrow></Arrow>
            </span>
          </Button>
        ) : null}
      </section>
    </>
  );
};

export default ProjectsPage;
