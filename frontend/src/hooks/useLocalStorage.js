import { useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const updateValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(value) : value;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [value, updateValue];
};
