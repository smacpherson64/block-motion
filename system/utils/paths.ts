import * as path from "https://deno.land/std@0.160.0/path/mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

export const rootPath = path.resolve(
  "..",
  __dirname.replace(/system\/utils\/?$/, "")
);
export const systemPath = path.resolve(rootPath, "system");
export const publicPath = path.resolve(rootPath, "system", "public");

console.log({ rootPath });
