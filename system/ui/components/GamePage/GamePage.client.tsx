import { React, ReactDOM } from "../../../dependencies/isometric.ts";
import GamePage from "./GamePage.tsx";

declare global {
  interface Window {
    gameHash: string;
  }
}

ReactDOM.hydrateRoot(document, <GamePage gameHash={window.gameHash} />);
