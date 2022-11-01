import { join } from "https://deno.land/std@0.160.0/path/mod.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.160.0/streams/mod.ts";
import * as mimeTypes from "https://deno.land/std@0.160.0/media_types/mod.ts";

import { CallbackHandler } from "../utils/router.ts";
import { systemPath } from "../utils/paths.ts";
import { missingResponse } from "../utils/responses.tsx";

/**
 * Holds the public routes for static files
 */
const publicRequest: CallbackHandler = async function publicRequest(request) {
  const { pathname } = new URL(request.url);

  try {
    const filePath = join(systemPath, pathname);
    const file = await Deno.open(filePath, { read: true });
    const stat = await file.stat();

    if (stat.isDirectory) {
      file.close();
      return await missingResponse;
    }

    const mimeType = mimeTypes.contentType(filePath.split(".").pop() ?? "");
    const response = new Response(readableStreamFromReader(file), {
      status: 200,
      headers: { "Content-Type": mimeType ?? "text/plain" },
    });

    return await response;
  } catch {
    return await missingResponse;
  }
};

export default publicRequest;
