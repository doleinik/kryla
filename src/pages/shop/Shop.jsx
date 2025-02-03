import React, { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import css from "./Shop.module.scss";
import pp from "../../components/pop-ups/PopUp.module.scss";

import Arrow from "../../assets/img/arrow.svg";
import Close from "../../assets/img/icon/close.svg";

import { getPageShop } from "../../api/queries/pages";
import LoadImage from "../../components/load-image/Image";
import LiqPayCheckout from "../../components/liqpay-checkout/LiqPayCheckout";

{/* <LiqPayCheckout id={594} amount={1} description={"description"} /> */}

const ShopPage = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [pageContent, setContent] = useState(false);
  const [goods, setGoods] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [count, setCount] = useState(4);
  const [moreDetails, setMore] = useState({ open: false });
  const skeleton = new Array(count).fill(0);

  const ESCAPE_KEYS = ["27", "Escape"];

  const loadMore = () => fetchData();

  const openMoreDetails = (title, image, { excerpt, price }) => {
    setMore({
      open: true,
      title,
      image,
      excerpt,
      price,
    });
  };
  const closeMoreDetails = () => {
    setMore({ ...moreDetails, open: false });
  };

  const keyHandler = ({ key }) => {
    console.log("key", key);
    ESCAPE_KEYS.includes(String(key)) && closeMoreDetails();
  };

  // Close moreDetails PopUp on Escape
  useEffect(() => {
    moreDetails.open && document.addEventListener("keydown", keyHandler, false);

    return () => document.removeEventListener("keydown", keyHandler, false);
  }, [moreDetails]);

  async function fetchData(page = false) {
    setLoading(true);

    let data = await getPageShop(count, endCursor, page);

    setGoods([...goods, ...data.goods.edges]);
    setEndCursor(data.goods.pageInfo.endCursor);
    setHasNextPage(data.goods.pageInfo.hasNextPage);
    !pageContent && setContent(data.page.page_shop);

    setLoading(false);
  }

  useEffect(() => {
    fetchData(true);
  }, []);

  const Gift = ({ node: { title, featuredImage, goods_options } }, i) => (
    <div key={i} className={css.gift}>
      <div className={css.icon}>
        <LoadImage icon={featuredImage?.node} />
      </div>
      <div className={css.information}>
        <h5 className={css.price}>{goods_options.price} грн</h5>
        <h4 className={css.title}>{title}</h4>
        <div className={css.buttons}>
          <Button
            class={"yellow_button"}
            title="Подарувати"
            callBack={(e) =>
              openMoreDetails(title, featuredImage?.node, goods_options)
            }
          />
        </div>
      </div>
    </div>
  );

  const postsList = goods.map((post, idx) => Gift(post, idx));

  const skeletonList = skeleton.map((e, idx) => (
    <div key={idx} className={`${css.skeleton} ${css.gift}`}>
      <div className={`${css.icon} ${css.bg}`}></div>
      <div className={css.information}>
        <h5 className={`${css.price} ${css.bg}`}></h5>
        <h4 className={`${css.title} ${css.bg}`}></h4>
        <div className={`${css.buttons} ${css.bg}`}></div>
      </div>
    </div>
  ));

  if (!pageContent) return;

  return (
    <>
      <section className={css.shop}>
        <div className={css.text_content}>
          <h1 className={`${css.title}`}>{pageContent.title}</h1>
          <p className={css.subtitle}>{pageContent.subtitle}</p>
        </div>

        {!isLoading && !goods.length ? (
          <div className={css.no_res}>
            <h4>Люди молодці, все розкупили</h4>
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>

      <div
        className={`${pp.pop_up} ${css.more_details} ${
          moreDetails.open ? pp.active : ""
        }`}
      >
        <div className={pp.content}>
          <div className={pp.content__scroll}>
            <div className={css.content}>
              <div className={css.icon}>
                <LoadImage icon={moreDetails.image} />
              </div>
              <div className={css.information}>
                <h5 className={css.price}>{moreDetails.price} грн</h5>
                <h5 className={css.title}>{moreDetails.title}</h5>
                <p
                  className={css.excerpt}
                  dangerouslySetInnerHTML={{ __html: moreDetails.excerpt }}
                ></p>
                <div className={css.buttons}>
                  <Button
                    class={"light_button"}
                    title="Скасувати"
                    callBack={closeMoreDetails}
                  />
                  <Button class={"yellow_button"} title="Подарувати" />
                </div>
              </div>
            </div>
          </div>
          <button onClick={closeMoreDetails} className={pp.close}>
            <Close />
          </button>
        </div>
      </div>
    </>
  );
};

export default ShopPage;
