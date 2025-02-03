import React, { useEffect, useState } from "react";

import css from "./Reports.module.scss";

import { Button } from "../../components/button/Button";
import Arrow from "../../assets/img/arrow.svg";
import { getReports } from "../../api/queries";

const ReportsPage = (props) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [pageContent, setContent] = useState(false);
  const [years, setYears] = useState(false);
  const [index, setIndex] = useState(0);

  async function fetchData(year) {
    setLoading(true);

    let data = await getReports(year);

    if (!year) {
      setYears(data.years.nodes.map((y) => y.name).sort((a, b) => b - a));
      setContent(data.page.page_reports.pageContent);
    } else {
      setReports([...reports, { year: year, data: data.reports.nodes }]);
      setIndex(index + 1);
    }
    setLoading(false);
  }

  const loadMore = () => {
    fetchData(years[index]);
  };

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  useEffect(() => {
    // console.log("years", years.length);
    if (years[index]) loadMore();
    return () => {};
  }, [years]);

  return (
    <>
      <section className={css.reports}>
        <div className={css.text_content}>
          <h1 className={css.title}>{pageContent?.title}</h1>
          <p className={css.subtitle}>{pageContent?.subtitle}</p>
        </div>

        <div className={css.documents}>
          {reports &&
            reports?.map((report, idx) => (
              <div key={idx} className={css.year}>
                <h3 className={css.num}>{report.year}</h3>

                {report?.data.map(
                  ({ report_options: { pageContent } }, idx) => (
                    <a
                      key={idx}
                      className={css.document}
                      href={pageContent.file.sourceUrl}
                      target="_blank"
                    >
                      <h4 className={css.title}>{pageContent.title}</h4>
                      <div className={css.info}>
                        <div className={`${css.date} ${css.column}`}>
                          <span className={css.t}>Додано</span>
                          <span className={css.d}>{pageContent.data}</span>
                        </div>
                        <div className={`${css.momey} ${css.column}`}>
                          <span className={css.t}>Зібрано</span>
                          <span className={css.d}>{pageContent.money} грн</span>
                        </div>
                      </div>
                    </a>
                  )
                )}
              </div>
            ))}
          {pageContent && isLoading ? (
            <>
              <div className={`${css.year} ${css.skeleton}`}>
                <div className={`${css.num_sc} ${css.bg}`}> </div>
                <div className={`${css.sc} ${css.bg}`}></div>
                <div className={`${css.sc} ${css.bg}`}></div>
                <div className={`${css.sc} ${css.bg}`}></div>
              </div>
            </>
          ) : null}

          {!isLoading && !years.length ? (
            <h4 className={css.not_reports}>
              Звіти відсутні. Все буде у свій час
            </h4>
          ) : null}
        </div>

        {reports.length && index !== years.length ? (
          <Button
            disabled={isLoading}
            title="Показати більше"
            class={`${css.load_more}`}
            callBack={loadMore}
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

export default ReportsPage;
