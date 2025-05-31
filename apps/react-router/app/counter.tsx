import { useStore } from "@livestore/react";
import { queryDb } from "@livestore/livestore";
import { tables, events } from "./livestore/schema";

const counter$ = queryDb(tables.counter.where({ id: "main" }), {
  label: "counter"
});

export function Counter() {
  const { store } = useStore();
  const counter = store.useQuery(counter$)?.[0]?.value ?? 0;

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-8 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold">Counter: {counter}</h1>
        <div className="flex gap-4">
          <button
            onClick={() =>
              store.commit(events.counterDecremented({ amount: counter - 1 }))
            }
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Decrement
          </button>
          <button
            onClick={() =>
              store.commit(events.counterIncremented({ amount: counter + 1 }))
            }
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Increment
          </button>
        </div>
      </div>
    </main>
  );
}
