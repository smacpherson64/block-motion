export type CallbackHandler = (
  request: Request,
  urlParams: Record<string, string>
) => Promise<Response>;

export default class Router {
  #routes: [string, URLPattern, any][] = [];

  add(method: string, pathname: string, handler: CallbackHandler) {
    this.#routes.push([method, new URLPattern({ pathname }), handler]);
  }

  handler(req: Request): Promise<Response> {
    const route = this.#routes.find(
      ([method, pattern]) =>
        method.toLowerCase() === "*" ||
        (method.toLowerCase() === req.method.toLowerCase() &&
          pattern.test(req.url))
    );

    if (!route) {
      return Promise.resolve(new Response(null, { status: 404 }));
    }

    const [, pattern, handler] = route;

    let params: Record<string, string> = {};

    if (pattern && pattern.test(req.url)) {
      params = pattern.exec(req.url)?.pathname.groups ?? {};
    }

    return handler(req, params);
  }
}
