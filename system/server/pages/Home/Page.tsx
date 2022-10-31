import { React } from "../../../dependencies/isometric.ts";
import Demo from "../../../ui/components/Game/Demo.tsx";

const rows = 5;
const columns = 9;
const theme = { gap: 1, blockSize: 50 };

export default function Page() {
  return (
    <html lang="en-us" className="h-full w-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Block motion is a live action strategy game where two players aim blocks at each other's bases."
        />

        <title>Block motion ⬅️</title>

        <style>{`body {overflow: hidden !important; -webkit-overflow-scrolling: touch;`}</style>

        <link rel="stylesheet" href="/public/styles.css" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⬅️</text></svg>"
        />

        <script></script>
        <script
          type="module"
          src="/public/js/module/Home/home-page.client.js"
        />
        <script noModule src="/public/js/classic/Home/home-page.client.js" />
      </head>

      <body className="bg-slate-800 h-full min-h-screen w-full grid place-items-center text-gray-100">
        <div>
          <Demo theme={theme} rows={rows} columns={columns} />
        </div>
      </body>
    </html>
  );
}
