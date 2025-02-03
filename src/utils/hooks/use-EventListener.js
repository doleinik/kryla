import React, { useEffect, useRef } from "react";

const useEventListener = (event, fun, element = window) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = fun;
  }, [fun]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(event, eventListener);
    return () => {
      element.removeEventListener(event, eventListener);
    };
  }, [event, element]);
};

export default useEventListener;
