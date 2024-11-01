import { CharStream, CommonTokenStream } from "antlr4"
import FormulaLexer from "./grammar/FormulaLexer"
import FormulaParser from "./grammar/FormulaParser"

export function createParser(input: string) {
  const inputStream = new CharStream(input)
  const lexer = new FormulaLexer(inputStream)
  const tokenStream = new CommonTokenStream(lexer)
  return new FormulaParser(tokenStream)
}
