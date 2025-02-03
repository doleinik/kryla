import React, { useEffect } from "react";

export default function LiqPayEmbeddedCheckout({ data, signature }) {


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//static.liqpay.ua/libjs/checkout.js";
    script.async = true;

    const onLiqPayCheckoutCallback = () => {

      // Sandbox credentials
      const data = "eyJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXkiLCJhbW91bnQiOjUsImN1cnJlbmN5IjoiVUFIIiwiZGVzY3JpcHRpb24iOiLQnNGW0Lkg0YLQvtCy0LDRgCIsInB1YmxpY19rZXkiOiJpMzc2NDQ0ODk4NTEiLCJsYW5ndWFnZSI6InVrIn0=";
      const signature = "C7l7ckZipDQ6nS8SNy7wrziBghQ=";

      window.LiqPayCheckout.init({
        data,
        signature,
        embedTo: "#liqpay_checkout",
        language: "uk",
        mode: "embed", // embed || popup
      })
        .on("liqpay.callback", function (data) {
          // console.log(data.status);
          // console.log(data);
        })
        .on("liqpay.ready", function (data) {
          // ready
        })
        .on("liqpay.close", function (data) {
          // close
        });
    };

    script.addEventListener("load", onLiqPayCheckoutCallback);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      script.removeEventListener("load", onLiqPayCheckoutCallback);
    };
  }, []);

  return <div id="liqpay_checkout"></div>;
}
