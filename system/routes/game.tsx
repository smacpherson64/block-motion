import { React } from "../dependencies/isometric.ts";
import { CallbackHandler } from "../utils/router.ts";
import { errorResponse } from "../utils/responses.tsx";
import { renderPageAsStream } from "../utils/jsx.tsx";
import GamePage from "../ui/components/GamePage/GamePage.tsx";
import { hash } from "../utils/hash.ts";

const game: CallbackHandler = async function game(request, urlParams) {
  const gameId = urlParams["gameId"] ?? "";
  const gameHash = await hash(gameId);

  if (!gameId || !gameHash) {
    console.error(
      `Game handler requires a gameId in the url: "${request.url.toString()}"`
    );
    return errorResponse;
  }

  const isSocket =
    request.headers.get("upgrade")?.toLowerCase() === "websocket";

  if (isSocket) {
    const { socket, response } = Deno.upgradeWebSocket(request);

    socket.onopen = () => console.log("socket opened");
    socket.onmessage = (e) => {
      console.log("socket message:", e.data);
      socket.send(new Date().toString());
    };
    socket.onerror = (e) => console.warn("socket errored:", e);
    socket.onclose = () => console.log("socket closed");

    return await response;
  }

  return new Response(
    await renderPageAsStream(<GamePage gameHash={gameHash} />),
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
};

export default game;
