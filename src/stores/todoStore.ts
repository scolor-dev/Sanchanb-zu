import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** =========================
 * Types
 * ========================= */

export type Tag = {
  id: string;
  name: string;
  color: string; // "#RRGGBB"
  createdAt: number;
};

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;

  tagIds: string[]; // 紐づくタグID
  scheduledAt: number; // 予定日時（Unix ms）
};

type TodoState = {
  // data
  todos: Todo[];
  tags: Tag[];
  selected: Record<string, boolean>;

  // todo CRUD
  addTodo: (title: string, opts?: { tagIds?: string[]; dateKey?: string; time?: string }) => void;
  toggleDone: (id: string) => void;
  updateTodoTitle: (id: string, title: string) => void;
  updateTodoSchedule: (id: string, patch: { dateKey?: string; time?: string }) => void;

  // tag relations
  setTodoTags: (todoId: string, tagIds: string[]) => void;
  addTagToTodo: (todoId: string, tagId: string) => void;
  removeTagFromTodo: (todoId: string, tagId: string) => void;

  // calendar queries
  getTodosByDate: (dateKey: string) => Todo[];
  getTodayTodos: () => Todo[];
  getDateKeysWithTodos: () => string[];

  // selection
  setSelected: (id: string, checked: boolean) => void;
  clearSelected: () => void;
  toggleAll: (checked: boolean) => void;

  // delete
  deleteSelected: () => void;
  deleteOne: (id: string) => void;

  // tags CRUD
  addTag: (name: string, color: string) => void;
  updateTag: (tagId: string, patch: Partial<Pick<Tag, "name" | "color">>) => void;
  deleteTag: (tagId: string) => void;
};

/** =========================
 * Utils
 * ========================= */

function uid(prefix = ""): string {
  return `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeName(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function normalizeColor(input: string): string {
  const c = input.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  return "#64748b";
}

/** ms -> "YYYY-MM-DD" */
function toDateKey(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "YYYY-MM-DD" + "HH:mm" -> ms */
function combineDateTime(dateKey: string, time: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);

  const hour = Number.isFinite(hh) ? hh : 0;
  const min = Number.isFinite(mm) ? mm : 0;

  return new Date(y, m - 1, d, hour, min, 0, 0).getTime();
}

/** ms -> "HH:mm" */
function toTimeHM(ms: number): string {
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** =========================
 * Store
 * ========================= */

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      tags: [],
      selected: {},

      /** ---------- Todo ---------- */

      addTodo: (title, opts) => {
        const t = normalizeName(title);
        if (!t) return;

        const now = Date.now();
        const dateKey = opts?.dateKey ?? toDateKey(now);
        const time = opts?.time ?? "09:00";
        const scheduledAt = combineDateTime(dateKey, time);

        const tagIds = Array.from(new Set(opts?.tagIds ?? []));

        set((s) => ({
          todos: [
            {
              id: uid("todo_"),
              title: t,
              done: false,
              createdAt: now,
              tagIds,
              scheduledAt,
            },
            ...s.todos,
          ],
        }));
      },

      toggleDone: (id) => {
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        }));
      },

      updateTodoTitle: (id, title) => {
        const t = normalizeName(title);
        if (!t) return;

        set((s) => ({
          todos: s.todos.map((x) => (x.id === id ? { ...x, title: t } : x)),
        }));
      },

      updateTodoSchedule: (id, patch) => {
        set((s) => ({
          todos: s.todos.map((t) => {
            if (t.id !== id) return t;

            const currentDateKey = toDateKey(t.scheduledAt);
            const currentTime = toTimeHM(t.scheduledAt);

            const nextDateKey = patch.dateKey ?? currentDateKey;
            const nextTime = patch.time ?? currentTime;

            return { ...t, scheduledAt: combineDateTime(nextDateKey, nextTime) };
          }),
        }));
      },

      /** ---------- Tag relations ---------- */

      setTodoTags: (todoId, tagIds) => {
        const existing = new Set(get().tags.map((t) => t.id));
        const next = Array.from(new Set(tagIds)).filter((id) => existing.has(id));

        set((s) => ({
          todos: s.todos.map((t) => (t.id === todoId ? { ...t, tagIds: next } : t)),
        }));
      },

      addTagToTodo: (todoId, tagId) => {
        if (!get().tags.some((t) => t.id === tagId)) return;

        set((s) => ({
          todos: s.todos.map((t) => {
            if (t.id !== todoId) return t;
            if (t.tagIds.includes(tagId)) return t;
            return { ...t, tagIds: [...t.tagIds, tagId] };
          }),
        }));
      },

      removeTagFromTodo: (todoId, tagId) => {
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === todoId ? { ...t, tagIds: t.tagIds.filter((id) => id !== tagId) } : t
          ),
        }));
      },

      /** ---------- Calendar queries ---------- */

      getTodosByDate: (dateKey) => {
        return get()
          .todos.filter((t) => toDateKey(t.scheduledAt) === dateKey)
          .sort((a, b) => a.scheduledAt - b.scheduledAt);
      },

      getTodayTodos: () => {
        return get().getTodosByDate(toDateKey(Date.now()));
      },

      getDateKeysWithTodos: () => {
        const keys = new Set<string>();
        for (const t of get().todos) keys.add(toDateKey(t.scheduledAt));
        return Array.from(keys);
      },

      /** ---------- Selection ---------- */

      setSelected: (id, checked) => {
        set((s) => ({ selected: { ...s.selected, [id]: checked } }));
      },

      clearSelected: () => set({ selected: {} }),

      toggleAll: (checked) => {
        const { todos } = get();
        if (!checked) return set({ selected: {} });

        const next: Record<string, boolean> = {};
        for (const t of todos) next[t.id] = true;
        set({ selected: next });
      },

      /** ---------- Delete ---------- */

      deleteSelected: () => {
        const { selected } = get();
        const ids = Object.entries(selected)
          .filter(([, v]) => v)
          .map(([k]) => k);

        if (ids.length === 0) return;

        set((s) => ({
          todos: s.todos.filter((t) => !ids.includes(t.id)),
          selected: {},
        }));
      },

      deleteOne: (id) => {
        set((s) => {
          const { [id]: _unused, ...rest } = s.selected;
          return { todos: s.todos.filter((t) => t.id !== id), selected: rest };
        });
      },

      /** ---------- Tags ---------- */

      addTag: (name, color) => {
        const n = normalizeName(name);
        if (!n) return;

        const exists = get().tags.some((t) => t.name.toLowerCase() === n.toLowerCase());
        if (exists) return;

        set((s) => ({
          tags: [
            ...s.tags,
            { id: uid("tag_"), name: n, color: normalizeColor(color), createdAt: Date.now() },
          ],
        }));
      },

      updateTag: (tagId, patch) => {
        set((s) => ({
          tags: s.tags.map((t) => {
            if (t.id !== tagId) return t;
            return {
              ...t,
              name: patch.name !== undefined ? normalizeName(patch.name) : t.name,
              color: patch.color !== undefined ? normalizeColor(patch.color) : t.color,
            };
          }),
        }));
      },

      deleteTag: (tagId) => {
        set((s) => ({
          tags: s.tags.filter((t) => t.id !== tagId),
          todos: s.todos.map((todo) => ({
            ...todo,
            tagIds: todo.tagIds.filter((id) => id !== tagId),
          })),
        }));
      },
    }),
    {
      name: "sanchan_todos_v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
