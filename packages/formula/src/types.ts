import { z } from "@undb/zod"

export const paramType = z.enum(["number", "string", "boolean", "date", "any", "variadic"])

export type ParamType = z.infer<typeof paramType>

const returnTypeEnum = z.enum(["number", "string", "boolean", "date", "any"])
export const returnType = returnTypeEnum.or(z.array(returnTypeEnum))

export type ReturnType = z.infer<typeof returnType>

export type FormulaDefinition = string

export type FunctionExpressionResult = {
  type: "functionCall"
  name: string
  arguments: ExpressionResult[]
  returnType: ReturnType
  value: FormulaDefinition
}

export type ArgumentListResult = {
  type: "argumentList"
  arguments: ExpressionResult[]
}

export type VariableResult = {
  type: "variable"
  value: string
  variable: string
  returnType: ReturnType
}

export type NumberResult = {
  type: "number"
  value: number
}

export type StringResult = {
  type: "string"
  value: string
}

export type BooleanResult = {
  type: "boolean"
  value: boolean
}

export type NullResult = {
  type: "null"
}

export type ExpressionResult =
  | FunctionExpressionResult
  | ArgumentListResult
  | VariableResult
  | NumberResult
  | StringResult
  | BooleanResult
  | NullResult

export type ExpressionResultType = ExpressionResult["type"]
