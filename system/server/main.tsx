import { serve } from "https://deno.land/std@0.160.0/http/server.ts";
import router from "./routes.tsx";

const port = 8080;

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);

await serve(router, { port });
