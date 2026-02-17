import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CharacterStateKey = "idle" | "normal" | "happy" | "sad" | "angry";

export type CharacterModel = {
  characterId: string;
  name: string;
  state: CharacterStateKey;
  comment: string;
  updatedAt: number;
};

type CharacterStore = {
  current: CharacterModel;

  setCharacterId: (characterId: string) => void;
  setName: (name: string) => void;
  setState: (state: CharacterStateKey) => void;
  setComment: (comment: string) => void;
  setAll: (patch: Partial<Omit<CharacterModel, "updatedAt">>) => void;

  getIconSrc: () => string;
  getStandSrc: () => string;

  reset: () => void;
};

const ICON_BY_STATE: Record<CharacterStateKey, string> = {
  idle: "/character/icon_sun_good.png",
  normal: "/character/icon_sun_good.png",
  happy: "/character/icon_sun_good.png",
  sad: "/character/icon_sun_good.png",
  angry: "/character/icon_sun_good.png",
};

const STAND_BY_STATE: Record<CharacterStateKey, string> = {
  idle: "/character/sun_sad.png",
  normal: "/character/sun_happy.png",
  happy: "/character/sun_happy.png",
  sad: "/character/sun_sad.png",
  angry: "/character/sun_angry.png",
};

const DEFAULT: CharacterModel = {
  characterId: "sanchan",
  name: "三日月",
  state: "happy",
  comment: "今日もがんばろう。",
  updatedAt: Date.now(),
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      current: DEFAULT,

      setCharacterId: (characterId) =>
        set((s) => ({
          current: { ...s.current, characterId, updatedAt: Date.now() },
        })),

      setName: (name) =>
        set((s) => ({
          current: { ...s.current, name, updatedAt: Date.now() },
        })),

      setState: (state) =>
        set((s) => ({
          current: { ...s.current, state, updatedAt: Date.now() },
        })),

      setComment: (comment) =>
        set((s) => ({
          current: { ...s.current, comment, updatedAt: Date.now() },
        })),

      setAll: (patch) =>
        set((s) => ({
          current: { ...s.current, ...patch, updatedAt: Date.now() },
        })),

      getIconSrc: () => {
        const st = get().current.state;
        return ICON_BY_STATE[st] ?? ICON_BY_STATE.normal;
      },

      getStandSrc: () => {
        const st = get().current.state;
        return STAND_BY_STATE[st] ?? STAND_BY_STATE.normal;
      },

      reset: () => set(() => ({ current: DEFAULT })),
    }),
    { name: "character-store-v1" }
  )
);
