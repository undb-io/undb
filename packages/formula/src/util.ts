import { CharStreams, CommonTokenStream } from "antlr4ts"
import { FormulaLexer } from "./grammar/FormulaLexer"
import { FormulaParser } from "./grammar/FormulaParser"
import { CustomFormulaVisitor } from "./visitor"

export function createParser(input: string) {
  const inputStream = CharStreams.fromString(input)
  const lexer = new FormulaLexer(inputStream)
  const tokenStream = new CommonTokenStream(lexer)
  return new FormulaParser(tokenStream)
}

export function parseFormula(input: string) {
  const parser = createParser(input)

  const tree = parser.formula()

  const visitor = new CustomFormulaVisitor()
  const parsedFormula = visitor.visit(tree)

  return parsedFormula
}
