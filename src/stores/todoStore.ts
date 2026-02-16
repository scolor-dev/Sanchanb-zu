import { create } from "zustand";
import { persist } from "zustand/middleware";

type Priority = 1 | 2 | 3;

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
  byId: Record<string, TodoItem>;
  allIds: string[];

  idsByDate: Record<string, string[]>;
  idsByPriority: Record<Priority, string[]>;
  idsByDatePriority: Record<string, Record<Priority, string[]>>;

  // getters
  getById: (id: string) => TodoItem | undefined;
  getAll: () => TodoItem[];
  getByDate: (date: string) => TodoItem[];
  getByPriority: (priority: Priority) => TodoItem[];
  getByDateAndPriority: (date: string, priority: Priority) => TodoItem[];

  // actions
  addTodo: (input: TodoInput) => string;
  updateTodo: (
    id: string,
    patch: Partial<Omit<TodoItem, "id" | "createdAt">>
  ) => void;
  removeTodo: (id: string) => void;
  clearAll: () => void;
};

function ensureDatePriorityObj(
  map: Record<string, Record<Priority, string[]>>,
  date: string
): Record<Priority, string[]> {
  return map[date] ?? { 1: [], 2: [], 3: [] };
}

function uniqAdd(arr: string[], id: string): string[] {
  return arr.includes(id) ? arr : [...arr, id];
}

function removeId(arr: string[], id: string): string[] {
  return arr.filter((x) => x !== id);
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `t_${Date.now()}_${Math.random()}`;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      byId: {},
      allIds: [],
      idsByDate: {},
      idsByPriority: { 1: [], 2: [], 3: [] },
      idsByDatePriority: {},

      // getters
      getById: (id) => get().byId[id],
      getAll: () => get().allIds.map((id) => get().byId[id]).filter(Boolean),
      getByDate: (date) => {
        const ids = get().idsByDate[date] ?? [];
        const byId = get().byId;
        return ids.map((id) => byId[id]).filter(Boolean);
      },
      getByPriority: (priority) => {
        const ids = get().idsByPriority[priority] ?? [];
        const byId = get().byId;
        return ids.map((id) => byId[id]).filter(Boolean);
      },
      getByDateAndPriority: (date, priority) => {
        const dp = get().idsByDatePriority[date];
        const ids = dp?.[priority] ?? [];
        const byId = get().byId;
        return ids.map((id) => byId[id]).filter(Boolean);
      },

      // actions
      addTodo: (input) => {
        const id = newId();
        const now = Date.now();
        const item: TodoItem = { id, ...input, createdAt: now, updatedAt: now };

        set((s) => {
          // byId / allIds
          const byId = { ...s.byId, [id]: item };
          const allIds = [...s.allIds, id];

          // idsByDate
          const prevDateIds = s.idsByDate[item.date] ?? [];
          const nextDateIds = uniqAdd(prevDateIds, id);
          const idsByDate = { ...s.idsByDate, [item.date]: nextDateIds };

          // idsByPriority
          const prevPrioIds = s.idsByPriority[item.priority] ?? [];
          const nextPrioIds = uniqAdd(prevPrioIds, id);
          const idsByPriority = {
            ...s.idsByPriority,
            [item.priority]: nextPrioIds,
          } as Record<Priority, string[]>;

          // idsByDatePriority
          const prevDpForDate = ensureDatePriorityObj(s.idsByDatePriority, item.date);
          const nextDpForDate: Record<Priority, string[]> = {
            ...prevDpForDate,
            [item.priority]: uniqAdd(prevDpForDate[item.priority] ?? [], id),
          };
          const idsByDatePriority = {
            ...s.idsByDatePriority,
            [item.date]: nextDpForDate,
          };

          return { byId, allIds, idsByDate, idsByPriority, idsByDatePriority };
        });

        return id;
      },

      updateTodo: (id, patch) => {
        const prev = get().byId[id];
        if (!prev) return;

        const next: TodoItem = {
          ...prev,
          ...patch,
          id: prev.id,
          createdAt: prev.createdAt,
          updatedAt: Date.now(),
        };

        const dateChanged = prev.date !== next.date;
        const prioChanged = prev.priority !== next.priority;

        set((s) => {
          // byId は必ず更新
          let byId = { ...s.byId, [id]: next };

          let idsByDate = s.idsByDate;
          let idsByPriority = s.idsByPriority;
          let idsByDatePriority = s.idsByDatePriority;

          // 日付変更があれば date系index を移動
          if (dateChanged) {
            const oldDateIds = s.idsByDate[prev.date] ?? [];
            const newDateIds = s.idsByDate[next.date] ?? [];

            idsByDate = {
              ...s.idsByDate,
              [prev.date]: removeId(oldDateIds, id),
              [next.date]: uniqAdd(newDateIds, id),
            };

            const oldDp = ensureDatePriorityObj(s.idsByDatePriority, prev.date);
            const newDp = ensureDatePriorityObj(s.idsByDatePriority, next.date);

            const oldDpUpdated: Record<Priority, string[]> = {
              ...oldDp,
              [prev.priority]: removeId(oldDp[prev.priority] ?? [], id),
            };
            const newDpUpdated: Record<Priority, string[]> = {
              ...newDp,
              [next.priority]: uniqAdd(newDp[next.priority] ?? [], id),
            };

            idsByDatePriority = {
              ...s.idsByDatePriority,
              [prev.date]: oldDpUpdated,
              [next.date]: newDpUpdated,
            };
          }

          // 重要度変更があれば priority系index を移動
          if (prioChanged) {
            const oldPrioIds = (idsByPriority[prev.priority] ?? []);
            const newPrioIds = (idsByPriority[next.priority] ?? []);

            idsByPriority = {
              ...idsByPriority,
              [prev.priority]: removeId(oldPrioIds, id),
              [next.priority]: uniqAdd(newPrioIds, id),
            } as Record<Priority, string[]>;

            // dateChanged のときは上で date+priority を更新済みなので、ここでは dateChanged=false の場合だけ更新
            if (!dateChanged) {
              const dp = ensureDatePriorityObj(idsByDatePriority, next.date);
              const dpUpdated: Record<Priority, string[]> = {
                ...dp,
                [prev.priority]: removeId(dp[prev.priority] ?? [], id),
                [next.priority]: uniqAdd(dp[next.priority] ?? [], id),
              };
              idsByDatePriority = { ...idsByDatePriority, [next.date]: dpUpdated };
            }
          }

          return { byId, idsByDate, idsByPriority, idsByDatePriority };
        });
      },

      removeTodo: (id) => {
        const prev = get().byId[id];
        if (!prev) return;

        set((s) => {
          // byId
          const { [id]: _removed, ...byId } = s.byId;

          // allIds
          const allIds = removeId(s.allIds, id);

          // idsByDate
          const dateIds = s.idsByDate[prev.date] ?? [];
          const idsByDate = { ...s.idsByDate, [prev.date]: removeId(dateIds, id) };

          // idsByPriority
          const prioIds = s.idsByPriority[prev.priority] ?? [];
          const idsByPriority = {
            ...s.idsByPriority,
            [prev.priority]: removeId(prioIds, id),
          } as Record<Priority, string[]>;

          // idsByDatePriority
          const dp = ensureDatePriorityObj(s.idsByDatePriority, prev.date);
          const dpUpdated: Record<Priority, string[]> = {
            ...dp,
            [prev.priority]: removeId(dp[prev.priority] ?? [], id),
          };
          const idsByDatePriority = {
            ...s.idsByDatePriority,
            [prev.date]: dpUpdated,
          };

          return { byId, allIds, idsByDate, idsByPriority, idsByDatePriority };
        });
      },

      clearAll: () =>
        set(() => ({
          byId: {},
          allIds: [],
          idsByDate: {},
          idsByPriority: { 1: [], 2: [], 3: [] },
          idsByDatePriority: {},
        })),
    }),
    {
      name: "todo-store-v1",
    }
  )
);
