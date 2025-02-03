import React, { useState, useRef, useEffect } from "react";
import fs from "../form/Form.module.scss";
import Trash from "../../assets/img/icon/trash.svg";
import NoIcon from "../../assets/img/icon/no_ico.svg";

export default function ImageLabel({ label, invalid, change, def }) {
  const [fileURL, setFileURL] = useState(false);
  const fileRef = useRef(null);

  const { name, title, accept, type } = label;

  const changeHandler = (e) => {
    const file = e.target.files[0];
    let fileReader;
    let isCancel = false;

    change(e);

    fileReader = new FileReader();
    fileReader.onload = (e) => {
      const { result } = e.target;
      if (result && !isCancel) setFileURL(result);
    };

    fileReader.readAsDataURL(file);

    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) fileReader.abort();
    };
  };

  const updateFileUrl = (e) => {
    let url = def?.promo_featured_image_arr?.src;
    url && setFileURL(url);
  };
  const removePhoto = (e) => {
    setFileURL(null);
    fileRef.current.value = "";
    updateFileUrl();
  };

  useEffect(() => {
    updateFileUrl();
    return () => {};
  }, [def]);

  return (
    <>
      <div className={`${fs.avatar} ${invalid[name] ? fs.error : null}`}>
        <div className={fs.icon}>
          {fileURL ? <img src={fileURL} alt="" /> : <NoIcon />}
        </div>
        <div className={fs.buttons}>
          {fileURL && fileRef.current.files[0] ? (
            <button className={fs.remove} onClick={removePhoto}>
              <Trash />
            </button>
          ) : null}

          <label className={`link ${fs.change}`} title={title}>
            <input
              ref={fileRef}
              type={type}
              accept={accept}
              name={name}
              onChange={changeHandler}
            />
            {title}
          </label>
        </div>
      </div>
    </>
  );
}
