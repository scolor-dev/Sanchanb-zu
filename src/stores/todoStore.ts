// src/stores/todoStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Priority = 1 | 2 | 3;

export type TodoItem = {
  id: string;
  date: string;
  title: string;
  content: string;
  priority: Priority;
  isCompleted: boolean;
  createdAt: number;
  updatedAt: number;
};

type TodoInput = Omit<TodoItem, "id" | "createdAt" | "updatedAt" | "isCompleted">;

type TodoState = {
  todos: TodoItem[];
  lastPersistError: string | null;

  addTodo: (input: TodoInput) => string;
  updateTodo: (id: string, patch: Partial<Omit<TodoItem, "id" | "createdAt">>) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearAll: () => void;

  setPersistError: (msg: string | null) => void;
};

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `t_${Date.now()}_${Math.random()}`;
}

const SOFT_LIMIT_BYTES = 4.5 * 1024 * 1024;
const MAX_TODOS_TO_PERSIST = 200;

function estimateBytes(str: string) {
  return new Blob([str]).size;
}

const safeLocalStorage = {
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    if (estimateBytes(value) > SOFT_LIMIT_BYTES) {
      throw new Error("StorageSoftLimitExceeded");
    }
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // noop
    }
  },
};

// ✅ store外参照（onRehydrateStorage から使う）
let setPersistErrorRef: ((msg: string | null) => void) | null = null;

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      lastPersistError: null,

      setPersistError: (msg) => set({ lastPersistError: msg }),

      addTodo: (input) => {
        const id = newId();
        const now = Date.now();
        const item: TodoItem = {
          id,
          ...input,
          isCompleted: false,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ todos: [...s.todos, item] }));
        return id;
      },

      updateTodo: (id, patch) => {
        const now = Date.now();
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now } : t)),
        }));
      },

      toggleTodo: (id) => {
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
        }));
      },

      removeTodo: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
      clearAll: () => set({ todos: [] }),
    }),
    {
      name: "todo-store-v1",
      partialize: (state) => ({
        todos: [...state.todos]
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, MAX_TODOS_TO_PERSIST),
      }),
      storage: createJSONStorage(() => safeLocalStorage),

      // ✅ ここで state.setState は使わない
      onRehydrateStorage: () => (_state, error) => {
        // store が作られた後なら ref が入っている
        if (error) {
          setPersistErrorRef?.("保存データの読み込みに失敗しました");
        } else {
          setPersistErrorRef?.(null);
        }
      },
    }
  )
);

// ✅ store生成後に ref を埋める（モジュールロード時に1回実行される）
setPersistErrorRef = useTodoStore.getState().setPersistError;
