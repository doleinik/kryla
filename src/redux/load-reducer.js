const PAGE_IS_LOADED = "PAGE_IS_LOADED";
const PRELOADER_IS_LOADED = "PRELOADER_IS_LOADED";

export default function preloaderReducer(state, action) {

  if (action.type === PAGE_IS_LOADED) {
    state = action.bool;
  }

  return state;
};


export const pageLoadedAC = (bool) => {
  return {
    type: PAGE_IS_LOADED,
    bool,
  };
};