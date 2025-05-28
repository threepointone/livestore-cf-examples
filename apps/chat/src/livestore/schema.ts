import {
  Events,
  makeSchema,
  Schema,
  SessionIdSymbol,
  State
} from "@livestore/livestore";

// You can model your state as SQLite tables (https://docs.livestore.dev/reference/state/sqlite-schema)
export const tables = {
  messages: State.SQLite.table({
    name: "messages",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      content: State.SQLite.text({ default: "" }),
      role: State.SQLite.text({ default: "user" }), // 'user' or 'assistant'
      timestamp: State.SQLite.integer({
        default: new Date(),
        schema: Schema.DateFromNumber
      }),
      deletedAt: State.SQLite.integer({
        nullable: true,
        schema: Schema.DateFromNumber
      })
    }
  }),
  // Client documents can be used for local-only state (e.g. form inputs)
  uiState: State.SQLite.clientDocument({
    name: "uiState",
    schema: Schema.Struct({
      inputText: Schema.String,
      isTyping: Schema.Boolean,
      selectedModel: Schema.String
    }),
    default: {
      id: SessionIdSymbol,
      value: {
        inputText: "",
        isTyping: false,
        selectedModel: "gpt-3.5-turbo"
      }
    }
  })
};

// Events describe data changes (https://docs.livestore.dev/reference/events)
export const events = {
  messageCreated: Events.synced({
    name: "v1.MessageCreated",
    schema: Schema.Struct({
      id: Schema.String,
      content: Schema.String,
      role: Schema.String,
      timestamp: Schema.Date
    })
  }),
  messageDeleted: Events.synced({
    name: "v1.MessageDeleted",
    schema: Schema.Struct({
      id: Schema.String,
      deletedAt: Schema.Date
    })
  }),
  conversationCleared: Events.synced({
    name: "v1.ConversationCleared",
    schema: Schema.Struct({
      deletedAt: Schema.Date
    })
  }),
  uiStateSet: tables.uiState.set
};

// Materializers are used to map events to state (https://docs.livestore.dev/reference/state/materializers)
const materializers = State.SQLite.materializers(events, {
  "v1.MessageCreated": ({ id, content, role, timestamp }) =>
    tables.messages.insert({ id, content, role, timestamp }),
  "v1.MessageDeleted": ({ id, deletedAt }) =>
    tables.messages.update({ deletedAt }).where({ id }),
  "v1.ConversationCleared": ({ deletedAt }) =>
    tables.messages.update({ deletedAt }).where({ deletedAt: null })
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });
