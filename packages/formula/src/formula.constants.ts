import { FormulaFunction } from "./formula/formula.type"

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
  "REPLACE",
  "SUBSTITUTE",
  "REPEAT",
  "SEARCH",
  "SUBSTR",

  // 日期时间
  "DATE_ADD",
  "DATE_SUBTRACT",
  "DATE_DIFF",
  "YEAR",
  "MONTH",
  "DAY",
  "HOUR",
  "MINUTE",
  "SECOND",
  "WEEKDAY",

  // 逻辑运算
  "AND",
  "OR",
  "NOT",
  "XOR",
  "IF",
  "SWITCH",
  // "ISBLANK",
  // "ISNUMBER",
  // "ISTEXT",

  // 统计函数
  // "COUNT",
  // "COUNTA",
  // "COUNTIF",
  // "SUMIF",
  // "CORREL",

  "JSON_EXTRACT",

  "RECORD_ID",
  "AUTO_INCREMENT",
] as const
