import { $ } from "bun"

await $`antlr4ts -visitor -no-listener src/grammar/*.g4`
