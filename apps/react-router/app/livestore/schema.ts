import {
  Events,
  makeSchema,
  Schema,
  SessionIdSymbol,
  State
} from "@livestore/livestore";

// Define a simple counter table
export const tables = {
  counter: State.SQLite.table({
    name: "counter",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      value: State.SQLite.integer({ default: 0 })
    }
  })
};

// Events for incrementing and decrementing the counter
export const events = {
  counterIncremented: Events.synced({
    name: "v1.CounterIncremented",
    schema: Schema.Struct({ amount: Schema.Number })
  }),
  counterDecremented: Events.synced({
    name: "v1.CounterDecremented",
    schema: Schema.Struct({ amount: Schema.Number })
  })
};

// Materializers to handle counter events
const materializers = State.SQLite.materializers(events, {
  "v1.CounterIncremented": ({ amount }) =>
    tables.counter
      .insert({ id: "main", value: amount })
      .onConflict("id", "replace"),
  "v1.CounterDecremented": ({ amount }) =>
    tables.counter
      .insert({ id: "main", value: amount })
      .onConflict("id", "replace")
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });
