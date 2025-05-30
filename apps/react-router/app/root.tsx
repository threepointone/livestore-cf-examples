import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { makePersistedAdapter } from "@livestore/adapter-web";
import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import { LiveStoreProvider } from "@livestore/react";
import type React from "react";
import { unstable_batchedUpdates as batchUpdates } from "react-dom";

import LiveStoreWorker from "./livestore/livestore.worker?worker";
import { schema } from "./livestore/schema";

import type { Route } from "./+types/root";
import "./app.css";

export const getStoreId = () => {
  if (typeof window === "undefined") return "unused";

  const searchParams = new URLSearchParams(window.location.search);
  const storeId = searchParams.get("storeId");
  if (storeId !== null) return storeId;

  const newAppId = crypto.randomUUID();
  searchParams.set("storeId", newAppId);

  window.location.search = searchParams.toString();
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// const storeId = getStoreId();
// let's just use a sample store id for now
const storeId = "sample-store";

const adapter = makePersistedAdapter({
  storage: { type: "opfs" },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <LiveStoreProvider
          schema={schema}
          adapter={adapter}
          renderLoading={(_) => <div>Loading LiveStore ({_.stage})...</div>}
          batchUpdates={batchUpdates}
          storeId={storeId}
          syncPayload={{ authToken: "insecure-token-change-me" }}
        >
          {children}
          <ScrollRestoration />
        </LiveStoreProvider>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
