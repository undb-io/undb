import { CharStreams, CommonTokenStream } from "antlr4ts"
import { FormulaLexer } from "./grammar/FormulaLexer"
import { FormulaParser } from "./grammar/FormulaParser"
import { CustomFormulaVisitor } from "./visitor"

export function parseFormula(input: string) {
  const inputStream = CharStreams.fromString(input)
  const lexer = new FormulaLexer(inputStream)
  const tokenStream = new CommonTokenStream(lexer)
  const parser = new FormulaParser(tokenStream)

  const tree = parser.formula()

  const visitor = new CustomFormulaVisitor()
  const parsedFormula = visitor.visit(tree)

  console.log(JSON.stringify(parsedFormula, null, 2))
}
