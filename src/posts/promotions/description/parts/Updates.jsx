import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../../../context/AuthProvider";
import DataContext from "../../../../context/DataProvider";
import { Button } from "../../../../components/button/Button";
import file from "../../../../assets/img/file.png";
import store, {
  activePromUpdate,
  activeAlert,
  closeAllPopUps,
} from "../../../../redux/state";
import Close from "../../../../assets/img/icon/close.svg";
import useForm from "../../../../utils/hooks/useForm";

const Update = ({ update, id, css }) => {
  const {
    data: { forms },
  } = useContext(DataContext);
  const [post_id, setP] = useState(localStorage.getItem("promo_id"));

  const [r_ID, setID] = useState(null);
  const { auth, setAuth } = useContext(AuthContext);

  const { endpoint, confirm_message } = forms.promo_history_delete;

  const { isSending, isSuccess, handleSubmit } = useForm({}, endpoint);

  useEffect(() => {
    if (isSuccess) {
      closeAllPopUps();
      store.setUpdate("update_promo");
      setID(null);
    }
    return () => {};
  }, [isSuccess]);

  useEffect(() => {
    isSending && openAlert();
    return () => {};
  }, [isSending]);

  const openAlert = (id) => {
    activeAlert({
      ...confirm_message,
      close_title: "Скасувати",
      danger: () => (
        <Button
          title="Видалити"
          class={"dark_button"}
          disabled={isSending}
          callBack={() => onRemoved(id)}
        />
      ),
    });
  };

  const onRemoved = (id) => {
    const data = new FormData();
    data.append("promo_id", post_id);
    data.append("promo_delete_item", id + 1);
    handleSubmit(data);
    setID(id);
  };

  const getdate = (date, id) => {
    return date.date ? date.date.split(",")[id] : null;
  };

  return (
    <div className={css.column_update}>
      {update ? (
        update.map(({ item }, idx) => (
          <div
            key={idx}
            className={`${css.update} ${r_ID == idx ? css.removed : null}`}
          >
            <div className={css.date}>
              <span className={css.n}>{getdate(item, 0)}</span>
              <span className={css.mounth}>{getdate(item, 1)}</span>
            </div>
            <h4 className={css.title}>{item.title}</h4>
            <p className={css.subtitle}>{item.text}</p>
            {item.gallery ? (
              <a
                className={css.file}
                href={item.gallery.mediaItemUrl}
                target="_blank"
                title={item.title}
              >
                <img src={item.gallery.sourceUrl || file} alt={item.title} />
              </a>
            ) : null}
            {id === auth.user_id ? (
              <button
                className={css.remove}
                title="Видалити"
                onClick={() => openAlert(idx)}
              >
                <Close />
              </button>
            ) : null}
          </div>
        ))
      ) : (
        <h3>This promotion does not contain updates yet</h3>
      )}
      {id === auth.user_id ? (
        <Button
          title={"Додати оновлення"}
          class={`yellow_button ${css.add_update}`}
          callBack={activePromUpdate}
        />
      ) : null}
    </div>
  );
};

export default Update;
