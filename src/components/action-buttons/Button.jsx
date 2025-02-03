import React, { useEffect, useContext } from "react";
import Close from "../../assets/img/icon/close.svg";
import { Button } from "../button/Button";
import { useNavigate } from "react-router-dom";
import { closeAllPopUps, activeSup } from "../../redux/state";
import useForm from "../../utils/hooks/useForm";
import AuthContext from "../../context/AuthProvider";

const ButtonClose = ({ addClass }) => {
  return (
    <>
      <button className={addClass} onClick={closeAllPopUps}>
        <Close />
      </button>
    </>
  );
};

const DeleteButton = ({ action, onSuccess }) => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { isSending, isSuccess, handleSubmit } = useForm({}, `user/${action}`);

  function onDelete() {
    const data = new FormData();
    data.append("user_id", auth.user_id);
    handleSubmit(data);
  }

  useEffect(() => {
    if (!isSuccess) return;
    onSuccess && onSuccess();

    if (action == "delete") {
      navigate("/");
      setAuth({});
      localStorage.removeItem("auth");
    }

    return () => {};
  }, [isSuccess]);

  return (
    <Button
      title="Видалити"
      class={"dark_button"}
      disabled={isSending}
      callBack={onDelete}
    />
  );
};

const LogoutButton = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const navigate = useNavigate();
  const { isSending, isSuccess, handleSubmit } = useForm({}, "user/logout");

  useEffect(() => {
    if (!isSuccess) return;
    navigate("/");
    setAuth({});
    localStorage.removeItem("auth");
    return () => {};
  }, [isSuccess]);

  function onLogout() {
    const data = new FormData();
    data.append("user_id", auth.user_id);
    handleSubmit(data);
  }

  return (
    <Button
      title="Вийти"
      class={"light_button"}
      disabled={isSending}
      callBack={onLogout}
    />
  );
};

const ButtonSupport = ({ title, ...props }) => {
  return (
    <Button
      title={title ? title : "Підтримати фонд"}
      callBack={activeSup}
      class={props.class ? props.class : "yellow_button"}
    />
  );
};

export { ButtonClose, DeleteButton, LogoutButton, ButtonSupport };
