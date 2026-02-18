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

  setHappyMode: () => void;
  setSadMode: () => void;
  setAngryMode: () => void;

  // 達成率に応じて自動で機嫌を変えるアクション
  setMoodByWeeklyRate: (rate: number) => void;

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

const PRESETS = {
  happy: {
    state: "happy" as CharacterStateKey,
    comment: "今日もいい天気だね！",
  },
  sad: {
    state: "sad" as CharacterStateKey,
    comment: "なんだかやる気が出ないなぁ...",
  },
  angry: {
    state: "angry" as CharacterStateKey,
    comment: "もう！なんでうまくいかないの！",
  },
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

      setHappyMode: () =>
        set((s) => ({
          current: { ...s.current, ...PRESETS.happy, updatedAt: Date.now() },
        })),

      setSadMode: () =>
        set((s) => ({
          current: { ...s.current, ...PRESETS.sad, updatedAt: Date.now() },
        })),

      setAngryMode: () =>
        set((s) => ({
          current: { ...s.current, ...PRESETS.angry, updatedAt: Date.now() },
        })),

      // ▼ 小数点を含めて正しく判定するように修正されたバージョン
      setMoodByWeeklyRate: (rate: number) =>
        set((s) => {
          // 条件1: 0% ～ 3.99...% (ほぼ3%以下) -> Sad
          if (rate < 4) {
            if (s.current.state === "sad") return s;
            return {
              current: { ...s.current, ...PRESETS.sad, updatedAt: Date.now() },
            };
          }

          // 条件2: 4% ～ 33.99...% (34%未満) -> Angry
          else if (rate < 34) {
            if (s.current.state === "angry") return s;
            return {
              current: { ...s.current, ...PRESETS.angry, updatedAt: Date.now() },
            };
          }

          // 条件3: 34%以上 -> Happy
          else {
            if (s.current.state === "happy") return s;
            return {
              current: { ...s.current, ...PRESETS.happy, updatedAt: Date.now() },
            };
          }
        }),

      reset: () => set(() => ({ current: DEFAULT })),
    }),
    { name: "character-store-v1" }
  )
);