// src/stores/todoStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = 1 | 2 | 3;

export type TodoItem = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  priority: Priority;
  isCompleted: boolean; //  追加: 完了したかどうか
  createdAt: number;
  updatedAt: number;
};

type TodoInput = Omit<TodoItem, "id" | "createdAt" | "updatedAt" | "isCompleted">;

type TodoState = {
  todos: TodoItem[];

  addTodo: (input: TodoInput) => string;
  updateTodo: (
    id: string,
    patch: Partial<Omit<TodoItem, "id" | "createdAt">>
  ) => void;
  toggleTodo: (id: string) => void; //  追加: 完了/未完了を切り替える関数
  removeTodo: (id: string) => void;
  clearAll: () => void;
};

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `t_${Date.now()}_${Math.random()}`;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({ // (se, get) => ({
      todos: [],

      addTodo: (input) => {
        const id = newId();
        const now = Date.now();
        // ✨ isCompleted: false を初期値として設定
        const item: TodoItem = { 
          id, 
          ...input, 
          isCompleted: false, 
          createdAt: now, 
          updatedAt: now 
        };

        set((s) => ({ todos: [...s.todos, item] }));
        return id;
      },

      updateTodo: (id, patch) => {
        const now = Date.now();
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id
              ? { ...t, ...patch, updatedAt: now }
              : t
          ),
        }));
      },

      // ✨ 追加: 完了状態を反転させるアクション
      toggleTodo: (id) => {
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
          ),
        }));
      },

      removeTodo: (id) => {
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
      },

      clearAll: () => set({ todos: [] }),
    }),
    { name: "todo-store-v1" }
  )
);