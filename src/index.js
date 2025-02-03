import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import store from "./redux/state";
import { DataProvider } from "./context/DataProvider";
import { AuthProvider } from "./context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

let rerenderEntireTree = (state) => {
  root.render(
    <DataProvider>
      <GoogleOAuthProvider clientId="837411321679-cgnr28oavedi7jabeiha7elsbcdq8adh.apps.googleusercontent.com">
        <BrowserRouter basename={state.basePath}>
          <AuthProvider>
            <App {...state} state={store} />
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </DataProvider>
  );
};

rerenderEntireTree(store.getState());

store.subscribe(rerenderEntireTree);

