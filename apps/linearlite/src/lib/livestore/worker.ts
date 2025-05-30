import { schema } from "@/lib/livestore/schema";
import { makeWorker } from "@livestore/adapter-web/worker";
import { makeCfSync } from "@livestore/sync-cf";

makeWorker({
  schema,
  sync: {
    backend: makeCfSync({
      url: import.meta.env.VITE_LIVESTORE_SYNC_URL as string
    }),
    initialSyncOptions: { _tag: "Blocking", timeout: 5000 }
  }
});
