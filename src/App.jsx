import React, { useEffect, Suspense, useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.scss";
import "webp-in-css/polyfill";

import DataContext from "./context/DataProvider";
import AuthContext from "./context/AuthProvider";
import RequireAuth from "./layout/RequireAuth";
import Layout from "./layout/Layout";
import Preloader from "./components/preloader/Preloader";
import NotFound from "./components/not-found/NotFound";
import Profile from "./pages/profile/Profile";

export default function App({ IS_LOGGED = false, state, ...props }) {
  const { data, isLoaded } = useContext(DataContext);
  const { auth, setAuth } = useContext(AuthContext);
  const [routes, setRoutes] = useState();
  const setLogin = (t = true) => state.setLogin(t);

  useEffect(() => {
    auth?.token ? setTimeout(setLogin, 500) : setLogin(false);
  }, [auth]);

  useEffect(() => {
    if (data && data.routes) {
      // console.log(data.routes);
      const routes = data.routes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<Preloader />}>
              <Component {...props} />
            </Suspense>
          }
        />
      ));

      setRoutes(routes);
    }
  }, [data]);

  if (!isLoaded) {
    return <Preloader />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            {...props}
            siteData={data.site}
            state={state}
            isLogin={IS_LOGGED}
          />
        }
      >
        {routes}
        <Route element={<RequireAuth />}>
          <Route path="profile/*" element={<Profile {...props} />} />
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <Suspense fallback={<Preloader />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}
