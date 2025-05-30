import { createRequestHandler } from "react-router";
import { makeDurableObject, makeWorker } from "@livestore/sync-cf/cf-worker";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

export interface Env {
  DB: D1Database;
  ADMIN_SECRET: string;
  WEBSOCKET_SERVER: DurableObjectNamespace<WebSocketServer>;
  VALUE_FROM_CLOUDFLARE: string;
}

export class WebSocketServer extends makeDurableObject({
  onPush: async (message) => {
    console.log("onPush", message.batch);
  },
  onPull: async (message) => {
    console.log("onPull", message);
  }
}) {}

const requestHandler = createRequestHandler(
  // @ts-expect-error eh whatever
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

const livestoreWorker = makeWorker({
  validatePayload: (payload: any) => {
    if (payload?.authToken !== "insecure-token-change-me") {
      throw new Error("Invalid auth token");
    }
  }
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (
      url.pathname.startsWith("/websocket")
      // || url.pathname.startsWith("/_livestore")
    ) {
      return livestoreWorker.fetch(request, env, ctx);
    }

    return requestHandler(request, {
      cloudflare: { env, ctx }
    });
  }
} satisfies ExportedHandler<Env>;
