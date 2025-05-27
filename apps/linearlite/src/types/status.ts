import { Schema } from "@livestore/livestore";

export const Status = Schema.Literal(0, 1, 2, 3, 4).annotations({
  title: "Status"
});

export type Status = typeof Status.Type;
