import React from "https://esm.sh/react@18.2.0";
import { renderPageAsStream } from "../utils/jsx.tsx";
import { errorResponse } from "../utils/responses.tsx";

import HomePage from "../ui/components/HomePage/HomePage.tsx";

export default async function home() {
  try {
    return new Response(await renderPageAsStream(<HomePage />), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error(error);
    return errorResponse;
  }
}
