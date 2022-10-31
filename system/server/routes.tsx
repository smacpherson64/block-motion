import { join } from "https://deno.land/std@0.160.0/path/mod.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.160.0/streams/mod.ts";
import * as mimeTypes from "https://deno.land/std@0.160.0/media_types/mod.ts";

import React from "https://esm.sh/react@18.2.0/react.js";
import Home from "./pages/Home/Page.tsx";
import Router, { CallbackHandler } from "../utils/router.ts";
import { renderPageAsStream, renderPageAsString } from "../utils/jsx.tsx";

const router = new Router();

const errorResponse = new Response(
  renderPageAsString(
    <html>
      <head>
        <title>Whoops...</title>
      </head>
      <body>Something went wrong...</body>
    </html>
  ),
  {
    status: 404,
    headers: {
      "Content-Type": `text/html; charset="UTF-8"`,
    },
  }
);

const missingResponse = new Response(
  renderPageAsString(
    <html>
      <head>
        <title>Whoops...</title>
      </head>
      <body>That doesn't seem to exist yet...</body>
    </html>
  ),
  {
    status: 500,
    headers: {
      "Content-Type": `text/html; charset="UTF-8"`,
    },
  }
);

const publicRequest: CallbackHandler = async (request) => {
  const { pathname } = new URL(request.url);

  try {
    let filePath = join(`./system`, pathname);
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
};

const home: CallbackHandler = async (request, urlParams) => {
  try {
    return new Response(await renderPageAsStream(<Home />), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error(error);
    return errorResponse;
  }
};

const game: CallbackHandler = async (request, urlParams) => {
  const gameId = urlParams["gameId"];

  if (!gameId) {
    console.error(
      `Game handler requires a gameId in the url: "${request.url.toString()}"`
    );
    return errorResponse;
  }

  const isSocket =
    (request.headers.get("upgrade") || "").toLowerCase() === "websocket";

  if (isSocket) {
    const { socket, response } = Deno.upgradeWebSocket(request);

    socket.onopen = () => console.log("socket opened");
    socket.onmessage = (e) => {
      console.log("socket message:", e.data);
      socket.send(new Date().toString());
    };
    socket.onerror = (e) => console.warn("socket errored:", e);
    socket.onclose = () => console.log("socket closed");

    return await response;
  }

  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  return await new Response(body, { status: 200 });
};

router.add("get", "/public/*", publicRequest);
router.add("get", "/", home);
router.add("get", "/games/:gameId", game);
router.add("*", "*", () => Promise.resolve(missingResponse));

export default router.handler.bind(router);
