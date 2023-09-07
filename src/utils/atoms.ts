import { atom } from "jotai";

type JsonPrimitive = string | number | boolean | null;
type JsonMap = {
  [key: string]: JsonPrimitive | JsonMap | JsonArray;
};
type JsonArray = Array<JsonPrimitive | JsonMap | JsonArray>;
export type Json = JsonPrimitive | JsonMap | JsonArray;

export const atomWithSessionStorage = <T extends Json>(
  key: string,
  initialValue: T
) => {
  const getInitialValue = () => {
    const item = sessionStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item) as T;
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: ((_: T) => T) | T) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      sessionStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};
