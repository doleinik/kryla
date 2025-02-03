import { width } from "cli-color/window-size";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LoadImage = ({ icon }) => {

  const attr = { ...icon };

  if (typeof icon === "string") return;

  const rename = [
    { old_k: "altText", new_k: "alt" },
    { old_k: "sourceUrl", new_k: "src" },
    { old_k: "srcset", new_k: "srcSet" },
  ];

  rename.forEach(({ old_k, new_k }) => {
    if (!attr.hasOwnProperty(old_k)) return;
    attr[new_k] = attr[old_k];
    delete attr[old_k];
  });

  return (
    <>
      <LazyLoadImage
        wrapperProps={{ style: { width: "100%", height: "100%" } }}
        {...attr}
        effect="blur"
      />
    </>
  );
};

export default LoadImage;
