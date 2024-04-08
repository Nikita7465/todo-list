import { useState, useEffect } from "react";

const useLocalStorage = (key: string, defData: string) => {
  const [state, setState] = useState(() => {
    const localData = localStorage.getItem(key);
    return localData || defData;
  });
  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);
  return [state, setState];
};

export default useLocalStorage;
