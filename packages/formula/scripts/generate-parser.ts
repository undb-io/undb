import { $ } from "bun"

await $`antlr -Dlanguage=TypeScript -visitor -no-listener src/grammar/*.g4`
