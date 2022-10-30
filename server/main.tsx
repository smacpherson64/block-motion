import { serve } from "https://deno.land/std@0.160.0/http/server.ts";
import { join } from "https://deno.land/std@0.160.0/path/mod.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.160.0/streams/mod.ts";
import * as mimeTypes from "https://deno.land/std@0.160.0/media_types/mod.ts";

import React from "https://esm.sh/react@18.2.0/react.js";
import Home from "./pages/Home/Page.tsx";
import Router from "./utils/router.ts";
import { renderPageAsStream, renderPageAsString } from "./utils/jsx.tsx";

const port = 8080;

const router = new Router();

router.add("get", "/public/*", async (request) => {
  const { pathname } = new URL(request.url);

  try {
    let filePath = join(`./`, pathname);
    let file = await Deno.open(filePath, { read: true });
    const stat = await file.stat();

    if (stat.isDirectory) {
      file.close();
      filePath = join("./", pathname, "index.html");
      file = await Deno.open(filePath, { read: true });
    }

    const mimeType = mimeTypes.contentType(filePath.split(".").pop() ?? "");
    const response = new Response(readableStreamFromReader(file), {
      status: 200,
      headers: { "Content-Type": mimeType ?? "text/plain" },
    });

    return await response;
  } catch {
    return await new Response("404", { status: 404 });
  }
});

router.add("get", "/", async (request, urlParams) => {
  try {
    return new Response(await renderPageAsStream(<Home />), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return new Response(
      renderPageAsString(
        <html>
          <head>
            <title>Whoops...</title>
          </head>
          <body>Something went wrong...</body>
        </html>
      ),
      {
        status: 500,
        headers: {
          "Content-Type": `text/html; charset="UTF-8"`,
        },
      }
    );
  }
});

// const upgrade = request.headers.get("upgrade") || "";

// if (upgrade.toLowerCase() != "websocket") {
//   return new Response("request isn't trying to upgrade to websocket.");
// }
// const { socket, response } = Deno.upgradeWebSocket(request);
// socket.onopen = () => console.log("socket opened");
// socket.onmessage = (e) => {
//   console.log("socket message:", e.data);
//   socket.send(new Date().toString());
// };
// socket.onerror = (e) => console.log("socket errored:", e.message);
// socket.onclose = () => console.log("socket closed");
// return response;

//   const body = `Your user-agent is:\n\n${
//     request.headers.get("user-agent") ?? "Unknown"
//   }`;

//   return new Response(body, { status: 200 });
// };

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(router.handler.bind(router), { port });
