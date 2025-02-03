import React, { useState, useEffect } from "react";
import css from "../General.module.scss";
// import FacebookLogin from "react-facebook-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import useForm from "../../../utils/hooks/useForm";

import FB from "../../../assets/img/icon/socials/facebook2.svg";

const fields = ["email", "id", "name"];

const Facebook = ({ title }) => {
  const { handleSubmit } = useForm({}, "user/login-fb");

  const responseFacebook = (profile) => {
    const data = new FormData();

    fields.forEach((f) => data.append(f, profile?.[f]));

    fetch(profile?.picture.data.url)
      .then((res) => res.blob())
      .then((res) => {
        // console.log(res);
        let blob = new Blob([res], { type: res.type });
        let link = URL.createObjectURL(blob);
        data.append("picture", link);

        handleSubmit(data);
      });

    // data.append("picture", profile?.picture.data.url);

    // handleSubmit(data);
  };

  return (
    <FacebookLogin
      appId="868406717594069"
      fields="name, email, picture"
      autoLoad={false}
      scope="public_profile, email"
      render={(r) => (
        <button className={`${css.enter_button} link`} onClick={r.onClick}>
          <span className={css.i}>
            <FB></FB>
          </span>
          <span className={css.text}>
            {title ? title : "Увійти з Facebook"}
          </span>
        </button>
      )}
      // onClick={()=>{}}
      callback={responseFacebook}
    />
  );
};

export default Facebook;
