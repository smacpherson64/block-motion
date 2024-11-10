import * as esbuild from "https://deno.land/x/esbuild@v0.24.0/mod.js";
import * as fs from "@std/fs";
import httpFetch from "https://deno.land/x/esbuild_plugin_http_fetch@v1.0.2/index.js";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.0";

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
    plugins: [...denoPlugins()],
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
    plugins: [httpFetch, ...denoPlugins()],
  });

function main() {
  return Promise.allSettled([buildESM(), buildNonModule()]);
}

main().catch((error) => {
  console.error(error);
});
