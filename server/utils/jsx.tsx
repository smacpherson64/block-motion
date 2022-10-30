import React from "https://esm.sh/react@18.2.0/react.js";
import {
  renderToReadableStream,
  renderToStaticMarkup,
} from "https://esm.sh/react-dom@18.2.0/server.js";

export type PageProps = {
  request: Request;
  urlParams: Record<string, string>;
};

export async function renderPageAsStream(page: React.ReactElement) {
  const controller = new AbortController();

  const stream = await renderToReadableStream(page, {
    signal: controller.signal,
    onError(error) {
      throw error;
    },
  });

  await stream.allReady;
  return stream;
}

export function renderPageAsString(node: React.ReactElement) {
  return `<!DOCTYPE html>\n${renderToStaticMarkup(node)}`;
}
