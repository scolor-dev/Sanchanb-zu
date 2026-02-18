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

  setMoodByWeeklyRate: (rate: number) => void;
  
  // ✨ 追加: ランダムに喋る機能
  sayRandomLine: () => void;

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
  name: "さんちゃん",
  state: "happy",
  comment: "今日もがんばろう。",
  updatedAt: Date.now(),
};

const PRESETS = {
  happy: {
    state: "happy" as CharacterStateKey,
    comment: "すごいすごーい！その調子！",
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

// ✨ 追加: ランダム台詞リスト
const RANDOM_COMMENTS = [
  "えらーい！",
  "その調子！",
  "ちょっと休憩する？",
  "おやつ食べたいな〜",
  "...",
  "水分補給も忘れないでね！",
  "見てるよ〜！",
  "すごい集中力…！",
  "昨日超かぐや姫のチケ買ってたら午前2時になってた…",
];

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

      // ✨ 修正: Todo操作時に必ず台詞を元に戻すように if (s.current.state === ...) のガードを削除
      setMoodByWeeklyRate: (rate: number) =>
        set((s) => {
          if (rate < 4) {
             // ガード節を削除し、常に上書き更新する
             return {
               current: { ...s.current, ...PRESETS.sad, updatedAt: Date.now() },
             };
          } else if (rate < 34) {
             return {
               current: { ...s.current, ...PRESETS.angry, updatedAt: Date.now() },
             };
          } else {
             return {
               current: { ...s.current, ...PRESETS.happy, updatedAt: Date.now() },
             };
          }
        }),

      // ✨ 追加: ランダム台詞をセットするアクション
      sayRandomLine: () => 
        set((s) => {
          const randomText = RANDOM_COMMENTS[Math.floor(Math.random() * RANDOM_COMMENTS.length)];
          return {
            current: { ...s.current, comment: randomText, updatedAt: Date.now() }
          };
        }),

      reset: () => set(() => ({ current: DEFAULT })),
    }),
    { name: "character-store-v2" }
  )
);