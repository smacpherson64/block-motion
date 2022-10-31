import { ReactDomServer } from "../dependencies/server.ts";

export type PageProps = {
  request: Request;
  urlParams: Record<string, string>;
};

export async function renderPageAsStream(page: React.ReactElement) {
  const controller = new AbortController();

  const stream = await ReactDomServer.renderToReadableStream(page, {
    signal: controller.signal,
    onError(error) {
      throw error;
    },
  });

  await stream.allReady;
  return stream;
}

export function renderPageAsString(node: React.ReactElement) {
  return `<!DOCTYPE html>\n${ReactDomServer.renderToStaticMarkup(node)}`;
}
