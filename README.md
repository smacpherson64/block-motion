# Prototype Block Motion

Concept block game for sending blocks around a screen.

My main goals with this are more technical in nature:
1. Experiment with react and Deno (rendering client vs server side)
1. Experiment with esbuild and Deno (rendering out client pages)
1. Experiment with xstate
1. Experiment with simple game state
1. Various react and ui experiments

> [!WARNING]
> I have accomplished my goals, but this is not in a working state.

## Development

To develop:

- run: `deno task dev` - starts the dev server
- run: `deno task dev:style` - starts tailwind, I have tw set on my path to work as tw
- run: `deno run -A --watch="./**/*.tsx" bin/bundle.ts **/*.client.tsx` - starts the bundler
