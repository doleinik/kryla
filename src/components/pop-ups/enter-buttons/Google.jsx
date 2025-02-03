import React, { useEffect, useState } from "react";
import css from "../General.module.scss";
import { useGoogleLogin } from "@react-oauth/google";

import GG from "../../../assets/img/icon/socials/google.svg";
import useForm from "../../../utils/hooks/useForm";
import getFileFromUrl from "../../../utils/getFileFromUrl";

const fields = ["email", "id", "given_name", "family_name", "picture"];
// const fields = ["email", "id", "given_name", "family_name"];

const Google = ({ title }) => {
  const { handleSubmit } = useForm({}, "user/login-google");

  const login = useGoogleLogin({
    onSuccess: (res) => {
      const formData = new FormData();
      const headers = {
        Authorization: `Bearer ${res.access_token}`,
        Accept: "application/json",
      };
      fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers,
      })
        .then((res) => res.json())
        .then((profile) => {
          fields.forEach((f) => formData.append(f, profile?.[f]));
          handleSubmit(formData);
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <button onClick={login} className={`${css.enter_button} link`}>
      <span className={css.i}>
        <GG></GG>
      </span>
      <span className={css.text}>
        <span className={css.text}>{title ? title : "Увійти з Google"}</span>
      </span>
    </button>
  );
};

export default Google;
