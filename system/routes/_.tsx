import Router from "../utils/router.ts";

import staticFilesInPublicFolder from "./public.tsx";
import { missingResponse } from "../utils/responses.tsx";
import home from "./home.tsx";
import game from "./game.tsx";

const router = new Router();

router.add("get", "/public/*", staticFilesInPublicFolder);
router.add("get", "/", home);
router.add("get", "/games/:gameId", game);
router.add("*", "*", () => Promise.resolve(missingResponse));

export default router.handler.bind(router);
