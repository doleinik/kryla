import React, { useState, useEffect } from "react";
import css from "../General.module.scss";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useGoogleLogin } from "@react-oauth/google";

import useForm from "../../../utils/hooks/useForm";

import FB from "../../../assets/img/icon/socials/facebook2.svg";
import GG from "../../../assets/img/icon/socials/google.svg";

const fields = [
  "social_key",
  "social_id",
  "first_name",
  "last_name",
  "user_email",
  "user_social_photo",
];

const EnterViaSocials = ({ setPopUp, title }) => {
  const { handleSubmit, isSuccess } = useForm({}, "user/login-social");

  useEffect(() => {
    isSuccess && setPopUp();

    return () => {};
  }, [isSuccess]);

  const initLogin = (...args) => {
    const data = new FormData();

    fields.forEach((f, ix) => data.append(f, args[ix]));

    handleSubmit(data);
  };

  const responseGoogle = useGoogleLogin({
    onSuccess: (res) => {
      const headers = {
        Authorization: `Bearer ${res.access_token}`,
        Accept: "application/json",
      };
      fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers,
      })
        .then((res) => res.json())
        .then((profile) => {
          const { id, given_name, family_name, email, picture } = profile;
          initLogin("google", id, given_name, family_name, email, picture);
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const responseFacebook = (profile) => {
    if (!profile.accessToken) return;

    const { id, name, email, picture } = profile;
    let u = name.split(" ");
    initLogin("facebook", id, u[0], u[1], email, picture.data.url);
  };

  return (
    <>
      <button onClick={responseGoogle} className={`${css.enter_button} link`}>
        <span className={css.i}>
          <GG></GG>
        </span>
        <span className={css.text}>
          <span className={css.text}>{title ? title : "Увійти з Google"}</span>
        </span>
      </button>

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
    </>
  );
};

export default EnterViaSocials;
