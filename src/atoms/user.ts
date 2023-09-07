import { atom } from "jotai";
import { atomWithSessionStorage } from "~/utils/atoms";

export const loggedInAtom = atom(false);
export const nameAtom = atom("");
