import { $ } from "bun"

await $`antlr4ts -visitor src/grammar/*.g4`
