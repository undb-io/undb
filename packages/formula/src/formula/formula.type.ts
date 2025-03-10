export type FormulaFunction =
  // 数学运算
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | "SUM"
  | "CONCAT"
  | "MOD"
  | "POWER"
  | "SQRT"
  | "ABS"
  | "ROUND"
  | "FLOOR"
  | "CEILING"
  | "MIN"
  | "MAX"
  | "AVERAGE"
  // | "MEDIAN"

  // 文本处理
  | "UPPER"
  | "LOWER"
  | "TRIM"
  | "LEFT"
  | "RIGHT"
  | "MID"
  | "LEN"
  | "REPLACE"
  | "SUBSTITUTE"
  | "REPEAT"
  | "SEARCH"
  | "SUBSTR"

  // 日期时间
  | "DATE_ADD"
  | "DATE_SUBTRACT"
  | "DATE_DIFF"
  | "YEAR"
  | "MONTH"
  | "DAY"
  // | "NOW"
  // | "TODAY"
  | "HOUR"
  | "MINUTE"
  | "SECOND"
  | "WEEKDAY"
  // | "DATE"

  // 逻辑运算
  | "AND"
  | "OR"
  | "XOR"
  | "NOT"
  | "IF"
  | "SWITCH"
  | "ISBLANK"
  | "ISNUMBER"
  | "ISTEXT"

  // 统计函数
  | "COUNT"
  | "COUNTA"
  | "COUNTIF"
  | "SUMIF"
  | "CORREL"
  | "JSON_EXTRACT"

  // System Field
  | "RECORD_ID"
  | "AUTO_INCREMENT"
