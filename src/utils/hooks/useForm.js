import { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

import { fetchREST } from "../../api/fetchAPI";

export default function useForm(initialState = {}, endpoint) {
  const { auth, setAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialState);

  const [invalidFields, setInvalidFields] = useState({});
  const [isSending, setSending] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [formResponse, setResponse] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("handleChange", formData);
  // }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });

    // console.log("formData", formData);

    if (!invalidFields[name]) return;
    const i = invalidFields;
    delete i[name];
    setInvalidFields({ ...i });
  };

  const onSuccess = ({ user_data }) => {
    const user = user_data;

    setInvalidFields({});
    setFormData({});
    setSuccess(true);

    user ? setAuth(user) : null;
    user ? localStorage.setItem("auth", JSON.stringify(user)) : null;
    // : localStorage.removeItem("auth");

    // navigate to home page
    // !user && navigate("/");
  };

  const handleSubmit = async (event, url = endpoint) => {
    let data = event;

    if (data.target) {
      data.preventDefault();
      data = new FormData(data.target);
    }

    setInvalidFields({});
    setSending(true);
    setSuccess(false);

    const response = await fetchREST(url, data);

    switch (response.code) {
      case "validation_error":
        setInvalidFields(response.fields);
        break;
      case "success":
        onSuccess(response);
        setResponse(response);
        break;

      default:
        // closePopUps();
        break;
    }
    setSending(false);
  };

  return {
    formData,
    formResponse,
    invalidFields,
    isSuccess,
    isSending,
    setInvalidFields,
    setFormData,
    handleChange,
    handleSubmit,
  };
}
