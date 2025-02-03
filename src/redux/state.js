const IS_LOADING = "IS_LOADING";
const IS_LOADED = "IS_LOADED";
const PAGE_LOADED = "PAGE_LOADED";
const SET_PAGE_DATA = "SET_PAGE_DATA";

const POPUP_LOGIN = "login";
const POPUP_REGISTRATION = "registr";
const POPUP_SUPPORT = "support";
const POPUP_SUPPORT_PROMO = "support_promo";
const POPUP_RESET = "reset";
const POPUP_CLOSE = "POPUP_CLOSE";
const POPUP_PROMOTION = "promo";
const POPUP_PROM_UP = "prom_up";
const POPUP_TEAM = "join";
const POPUP_ALERT = "alert";

let store = {
  _state: {
    basePath:
      window.location.origin === "https://tests.bambus.com.ua"
        ? "/kryla/"
        : "/",
    IS_LOGGED: false,
    active_pop_up: false,
    alert: false,
    need_update: false,
  },

  _callSubscriber() {},

  getState() {
    return this._state;
  },

  subscribe(observer) {
    this._callSubscriber = observer;
  },
  setActivePopUp(type) {
    this._state.active_pop_up = type;
    this._callSubscriber(this.getState());
  },
  setLogin(type) {
    this._state.IS_LOGGED = type;
    this._callSubscriber(this.getState());
  },
  setAlert(type) {
    this._state.alert = type;
    type && this.setActivePopUp(POPUP_ALERT);
    this._callSubscriber(this.getState());
  },
  setUpdate(type) {
    this._state.need_update = type;
    this._callSubscriber(this.getState());
  },

  dispatch(action) {
    switch (action.type) {
      case IS_LOADED:
        this._state.isLoaded = action.bool;
        this._callSubscriber(this.getState());
        break;
      case PAGE_LOADED:
        this._state.pageLoaded = action.bool;
        this._callSubscriber(this.getState());
        break;
      case IS_LOADING:
        this._state.isLoading = action.bool;
        this._callSubscriber(this.getState());
        break;
      case SET_PAGE_DATA:
        this._state.page = action.data;
        this._callSubscriber(this.getState());
        break;
      default:
        break;
    }
  },
};

const closeAllPopUps = () => store.setActivePopUp(false);
const activeReg = () => store.setActivePopUp(POPUP_REGISTRATION);
const activeLog = () => store.setActivePopUp(POPUP_LOGIN);
const activeSup = () => store.setActivePopUp(POPUP_SUPPORT);
const activeSupPromo = () => store.setActivePopUp(POPUP_SUPPORT_PROMO);
const activeRes = () => store.setActivePopUp(POPUP_RESET);
const activeProm = () => store.setActivePopUp(POPUP_PROMOTION);
const activePromUpdate = () => store.setActivePopUp(POPUP_PROM_UP);
const activeTeam = () => store.setActivePopUp(POPUP_TEAM);
const activeAlert = (boo) => store.setAlert(boo);

export default store;
export {
  closeAllPopUps,
  activeReg,
  activeLog,
  activeSup,
  activeSupPromo,
  activeRes,
  activeProm,
  activePromUpdate,
  activeTeam,
  activeAlert,
};
