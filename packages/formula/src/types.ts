export enum ParamType {
  NUMBER,
  STRING,
  BOOLEAN,
  DATE,
  ANY,
  VARIADIC, // 用于表示可变参数
}

export type FunctionDefinition = string

export type FunctionExpressionResult = {
  type: "functionCall"
  name: string
  arguments: ExpressionResult[]
  returnType: ParamType
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
