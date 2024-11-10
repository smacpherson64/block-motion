import { route, type Route } from "@std/http/unstable-route";
import { serveDir } from "@std/http/file-server";
import home from "./routes/home.tsx";
import game from "./routes/game.tsx";

export const routes: Route[] = [
  {
    method: ["GET"],
    pattern: new URLPattern({ pathname: "/public/*" }),
    handler: (req: Request) => serveDir(req, { fsRoot: "./system" }),
  },
  {
    method: ["GET"],
    pattern: new URLPattern({ pathname: "/" }),
    handler: home,
  },
  {
    method: ["GET"],
    pattern: new URLPattern({ pathname: "/game" }),
    handler: game,
  },
  {
    method: ["GET"],
    pattern: new URLPattern({ pathname: "*" }),
    handler: (req: Request) => serveDir(req, { fsRoot: "./system" }),
  },
];

export function defaultHandler(_req: Request) {
  return new Response("Not found", { status: 404 });
}

const port = 8000;

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);

Deno.serve(route(routes, defaultHandler));
