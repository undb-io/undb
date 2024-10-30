import { z } from "@undb/zod"

export const paramType = z.enum(["number", "string", "boolean", "date", "any", "variadic"])

export type ParamType = z.infer<typeof paramType>

export const returnType = z.enum(["number", "string", "boolean", "date", "any"])

export type ReturnType = z.infer<typeof returnType>

export type FunctionDefinition = string

export type FunctionExpressionResult = {
  type: "functionCall"
  name: string
  arguments: ExpressionResult[]
  returnType: ReturnType
  value: FunctionDefinition
}

export type ArgumentListResult = {
  type: "argumentList"
  arguments: ExpressionResult[]
}

export type VariableResult = {
  type: "variable"
  value: string
  variable: string
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

export type ExpressionResult =
  | FunctionExpressionResult
  | ArgumentListResult
  | VariableResult
  | NumberResult
  | StringResult
  | BooleanResult
