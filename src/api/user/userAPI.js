import React from 'react'
import { fetchREST } from '../fetchAPI';
import AuthContext from '../../context/AuthProvider';

export default function userAPI() {

}

let sending = false;

export async function userLoginSubmit(formData, calback) {




  if (sending) return;

  // setInvalid({});

  // setSend(true);

  const data = new FormData(formData);
  // data.append("remember_me", isRemember);

  const response = await fetchREST("user/login", data);

  console.log(response);

  switch (response.code) {
    case "validation_error":
      // onInvalid(response);
      break;
    case "success":
      // onSuccess(response);
      break;

    default:
      // closePopUps();
      break;
  }
  // setSend(false);

}


