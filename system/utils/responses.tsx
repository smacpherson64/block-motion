import React from "react";
import { renderPageAsStream } from "./jsx.tsx";

export const errorResponse = new Response(
  await renderPageAsStream(
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

export const missingResponse = new Response(
  await renderPageAsStream(
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
