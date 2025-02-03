import React, { useEffect, useState, useRef, useContext } from "react";
import css from "./Data.module.scss";
import { Button } from "../../../components/button/Button";
import Trash from "../../../assets/img/icon/trash.svg";
import fs from "../../../components/form/Form.module.scss";
import IconProfile from "../../../assets/img/icon/profile.svg";
import useForm from "../../../utils/hooks/useForm";

import PhoneLabel from "../../../components/form-labels/phone";
import InputLabel from "../../../components/form-labels/input";
const PersonalData = ({ auth, alert, forms }) => {
  const { endpoint, fields, success_message } = forms.profile_update;
  const deletePhoto = forms.delete_photo;

  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(auth?.user_photo);

  const { invalidFields, isSuccess, isSending, handleChange, handleSubmit } =
    useForm({}, endpoint);

  // on input file change
  const changeHandler = (e) => {
    const file = e.target.files[0];
    file ? setFile(file) : updatePhoto();
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    if (!fileRef.current.files[0]) data.delete("user_photo");
    handleSubmit(data);
  };

  const updatePhoto = (url = auth?.user_photo) => {
    setFileDataURL(url);
    setFile(null);
    fileRef.current.value = "";
  };

  const removePhoto = () => {
    file
      ? updatePhoto()
      : alert({
          ...deletePhoto.confirm_message,
          action: deletePhoto.endpoint,
          close_title: "Скасувати",
        });
  };

  const initLabels = (label) => {
    const obj = {
      key: label.name,
      label: label,
      invalid: invalidFields,
      def: auth,
      change: handleChange,
    };

    switch (label.name) {
      case "user_photo":
        return (
          <label key={label.name} className={fs.hidden}>
            <input
              ref={fileRef}
              type={label.type}
              accept={label.accept}
              name={label.name}
              onChange={changeHandler}
            />
          </label>
        );
      case "user_phone":
        return <PhoneLabel {...obj} />;

      default:
        return <InputLabel {...obj} />;
    }
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  // when photo deleted
  useEffect(() => {
    !auth?.user_photo ? updatePhoto(null) : setFileDataURL(auth?.user_photo);
    return () => {};
  }, [auth]);

  // on Success
  useEffect(() => {
    if (isSuccess) {
      alert({ ...success_message });
      updatePhoto();
    }

    return () => {};
  }, [isSuccess]);

  return (
    <>
      <div className={css.data_content}>
        <div className={css.avatar}>
          <div className={css.icon}>
            {fileDataURL ? <img src={fileDataURL} alt="" /> : <IconProfile />}
          </div>
          <div className={css.buttons}>
            {fileDataURL ? (
              <button className={css.remove} onClick={removePhoto}>
                <Trash />
              </button>
            ) : null}
            <button
              className={`link ${css.change}`}
              onClick={(e) => fileRef.current.click()}
              title={file?.name ?? "Змінити фото"}
            >
              Змінити фото
            </button>
          </div>
        </div>

        <div className={css.labels}>
          <form className={css.labels} onSubmit={onFormSubmit}>
            <label className={fs.hidden}>
              <input type="text" name="user_id" value={auth.user_id} readOnly />
            </label>

            {fields.map((f) => initLabels(f))}

            <Button
              type={"submit"}
              disabled={isSending}
              class={`${css.save} yellow_button`}
              title={"Зберегти дані"}
            ></Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalData;
