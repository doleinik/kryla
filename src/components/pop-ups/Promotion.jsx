import React, { useState, useEffect, useContext } from "react";
import css from "./PopUp.module.scss";
import { ButtonClose } from "../action-buttons/Button";
import useForm from "../../utils/hooks/useForm";
import AuthContext from "../../context/AuthProvider";
import { Button } from "../button/Button";
import { fetchREST } from "../../api/fetchAPI";
import { closeAllPopUps } from "../../redux/state";
import PhoneLabel from "../form-labels/phone";
import InputLabel from "../form-labels/input";
import HiddenLabel from "../form-labels/hidden";
import EditorLabel from "../form-labels/editor";
import ImageLabel from "../form-labels/promo-image";

const imageLabel = "promo_featured_image";

const Promotion = ({ state, form }) => {
  const { auth } = useContext(AuthContext);

  const {
    title,
    subtitle,
    endpoint,
    fields,
    success_message,
    confirm_message,
  } = form;
  const [isEdit, setEdit] = useState(localStorage.getItem("edit_post_id"));

  const {
    formData,
    invalidFields,
    isSuccess,
    isSending,
    setFormData,
    handleChange,
    handleSubmit,
  } = useForm({}, endpoint);

  // on form submit
  const onFormSubmit = (e) => {
    isEdit ? promotionUpdate(e) : promotionCreate(e);
  };

  // create Promotion
  const promotionCreate = (e) => {
    handleSubmit(e);
  };

  // update Promotion
  const promotionUpdate = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    data.append("post_id", isEdit);

    if (!data.get(imageLabel).name) data.delete(imageLabel);
    handleSubmit(data, "promotion/update");
  };

  const initLabels = (label, idx) => {
    const obj = {
      key: label.name,
      label: label,
      invalid: invalidFields,
      def: formData,
      change: handleChange,
    };
    switch (label.name) {
      case "promo_featured_image":
        return <ImageLabel {...obj} />;
      case "promo_description":
        return <EditorLabel {...obj} />;
      case "promo_contact_phone":
        return <PhoneLabel {...obj} />;
      default:
        return <InputLabel {...obj} />;
    }
  };

  const editedPost = async () => {
    const d = new FormData();
    d.append("post_id", isEdit);
    const response = await fetchREST("promotion/get", d);
    setFormData(response);
  };

  useEffect(() => {
    if (isSuccess) {
      state.setAlert({
        title: isEdit ? confirm_message.title : success_message.title,
        subtitle: success_message.subtitle,
      });
    }
    return () => {};
  }, [isSuccess]);

  useEffect(() => {
    if (isEdit) editedPost();

    return () => {
      localStorage.removeItem("edit_post_id");
    };
  }, [isEdit]);

  return (
    <>
      <div className={`${css.content} ${css.content__create}`}>
        <div className={css.content__scroll}>
          <h5 className={css.title}>{isEdit ? subtitle : title}</h5>

          <form className={css.form} onSubmit={onFormSubmit}>
            <HiddenLabel name={"user_id"} def={auth.user_id} />
            {fields.map((f, i) => initLabels(f, i))}
            <div className={css.buttons}>
              <Button
                type={"button"}
                class={`light_button`}
                title={"Скасувати"}
                callBack={closeAllPopUps}
              ></Button>
              <Button
                type={"submit"}
                disabled={isSending}
                class={`${css.save} yellow_button`}
                title={isEdit ? "Оновити" : "Створити"}
              ></Button>
            </div>
          </form>
        </div>
        <ButtonClose addClass={css.close} />
      </div>
    </>
  );
};

export default Promotion;
