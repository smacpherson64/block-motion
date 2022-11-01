import * as esbuild from "https://deno.land/x/esbuild@v0.15.12/mod.js";
import * as fs from "https://deno.land/std@0.160.0/fs/mod.ts";
import httpFetch from "https://deno.land/x/esbuild_plugin_http_fetch@v1.0.2/index.js";

fs.emptyDirSync("./system/public/js");

const entryPoints = Deno.args;

const buildESM = () =>
  esbuild.build({
    entryPoints,
    outdir: "./system/public/js/module/",
    outbase: "./system/ui/components",
    format: "esm",
    bundle: true,
    minify: true,
    treeShaking: true,
    sourcemap: true,
    logLevel: "verbose",
  });

const buildNonModule = () =>
  esbuild.build({
    entryPoints,
    outdir: "./system/public/js/classic",
    outbase: "./system/ui/components",
    format: "esm",
    bundle: true,
    minify: true,
    treeShaking: true,
    sourcemap: true,
    platform: "browser",
    target: "es6",
    metafile: true,
    plugins: [httpFetch],
  });

function main() {
  return Promise.allSettled([buildESM(), buildNonModule()]);
}

main().catch((error) => {
  console.error(error);
});
