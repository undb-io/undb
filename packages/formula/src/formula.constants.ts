import { FormulaFunction } from "./function/type"

export const FORMULA_FUNCTIONS: FormulaFunction[] = [
  "ADD",
  "SUBTRACT",
  "MULTIPLY",
  "DIVIDE",
  "SUM",
  "CONCAT",
  "MOD",
  "POWER",
  "SQRT",
  "ABS",
  "ROUND",
  "FLOOR",
  "CEILING",
  "MIN",
  "MAX",
  "AVERAGE",
  // "MEDIAN",

  // 文本处理
  "UPPER",
  "LOWER",
  "TRIM",
  "LEFT",
  "RIGHT",
  "MID",
  "LEN",
  "FIND",
  "REPLACE",
  "SUBSTITUTE",

  // 逻辑运算
  "AND",
  "OR",
  "NOT",
  "IF",
  "SWITCH",
  "ISBLANK",
  "ISNUMBER",
  "ISTEXT",
  "ISERROR",

  // 统计函数
  "COUNT",
  "COUNTA",
  "COUNTIF",
  "SUMIF",
  "AVERAGE",
  "STDEV",
  "VAR",
  "CORREL",
] as const
