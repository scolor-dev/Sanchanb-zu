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
  createdAt: number;
  updatedAt: number;
};

type TodoInput = Omit<TodoItem, "id" | "createdAt" | "updatedAt">;

type TodoState = {
  todos: TodoItem[];

  addTodo: (input: TodoInput) => string;
  updateTodo: (
    id: string,
    patch: Partial<Omit<TodoItem, "id" | "createdAt">>
  ) => void;
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
        const item: TodoItem = { id, ...input, createdAt: now, updatedAt: now };

        set((s) => ({ todos: [...s.todos, item] })); // immutable
        return id;
      },

      updateTodo: (id, patch) => {
        const now = Date.now();
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...patch,
                  id: t.id,
                  createdAt: t.createdAt,
                  updatedAt: now,
                }
              : t
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
