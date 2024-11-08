import {
  AddSubExprContext,
  AndExprContext,
  ArgumentListContext,
  ComparisonExprContext,
  FormulaContext,
  FormulaParserVisitor,
  FunctionCallContext,
  FunctionExprContext,
  MulDivModExprContext,
  NotExprContext,
  NumberExprContext,
  OrExprContext,
  ParenExprContext,
  StringExprContext,
  VariableContext,
  VariableExprContext,
  type FormulaFunction,
} from "@undb/formula"
import { AUTO_INCREMENT_TYPE, FieldIdVo, ID_TYPE, type TableDo } from "@undb/table"
import { match } from "ts-pattern"

export class UnderlyingFormulaVisitor extends FormulaParserVisitor<string> {
  constructor(private readonly table: TableDo) {
    super()
  }

  protected defaultResult(): string {
    return ""
  }

  visitNumberExpr = (ctx: NumberExprContext): string => {
    return ctx.NUMBER().getText()
  }

  visitStringExpr = (ctx: StringExprContext): string => {
    return ctx.STRING().getText()
  }

  visitComparisonExpr = (ctx: ComparisonExprContext): string => {
    return this.visit(ctx.expression(0)) + ctx._op.text + this.visit(ctx.expression(1))
  }

  visitAndExpr = (ctx: AndExprContext): string => {
    return this.visit(ctx.expression(0)) + " AND " + this.visit(ctx.expression(1))
  }

  visitOrExpr = (ctx: OrExprContext): string => {
    return this.visit(ctx.expression(0)) + " OR " + this.visit(ctx.expression(1))
  }

  visitNotExpr = (ctx: NotExprContext): string => {
    return "NOT " + this.visit(ctx.expression())
  }

  visitAddSubExpr = (ctx: AddSubExprContext): string => {
    return this.visit(ctx.expression(0)) + ctx._op.text + this.visit(ctx.expression(1))
  }

  visitMulDivModExpr = (ctx: MulDivModExprContext): string => {
    return this.visit(ctx.expression(0)) + ctx._op.text + this.visit(ctx.expression(1))
  }

  visitVariable = (ctx: VariableContext): string => {
    const fieldId = ctx.IDENTIFIER().getText()
    const field = this.table.schema
      .getFieldById(new FieldIdVo(fieldId))
      .expect(`variable ${fieldId} not found in table ${this.table.name.value}`)
    if (field.type === "currency") {
      return `(${fieldId}/100)`
    } else if (field.type === "autoIncrement") {
      return `[${fieldId}]`
    }
    return fieldId
  }

  visitFormula = (ctx: FormulaContext): string => {
    const expr = ctx.expression()
    return this.visit(expr)
  }

  visitFunctionExpr = (ctx: FunctionExprContext): string => {
    return this.visit(ctx.functionCall())
  }

  visitVariableExpr = (ctx: VariableExprContext): string => {
    return this.visit(ctx.variable())
  }

  visitParenExpr = (ctx: ParenExprContext): string => {
    return this.visit(ctx.expression())
  }

  private arguments(ctx: FunctionCallContext): string[] {
    return ctx
      .argumentList()!
      .expression_list()
      .map((expr) => this.visit(expr))
  }
  visitFunctionCall = (ctx: FunctionCallContext): string => {
    const functionName = ctx.IDENTIFIER().getText() as FormulaFunction
    return match(functionName)
      .with("IF", () => {
        const args = ctx.argumentList()!.expression_list()
        const condition = this.visit(args[0])
        const thenExpr = this.visit(args[1])
        const elseExpr = this.visit(args[2])
        return `(CASE WHEN ${condition} THEN ${thenExpr} ELSE ${elseExpr} END)`
      })
      .with("SWITCH", () => {
        const args = ctx.argumentList()!.expression_list()
        const expr = args[0]
        const pairs = args.slice(1, -1)
        const defaultValue = args[args.length - 1]

        let sql = "CASE " + this.visit(expr)
        for (let i = 0; i < pairs.length; i += 2) {
          sql += ` WHEN ${this.visit(pairs[i])} THEN ${this.visit(pairs[i + 1])}`
        }
        sql += ` ELSE ${this.visit(defaultValue)} END`
        return `(${sql})`
      })
      .with("ADD", "SUM", () => {
        const fn = this.arguments(ctx).join(" + ")
        return `(${fn})`
      })
      .with("SUBTRACT", () => {
        const fn = this.arguments(ctx).join(" - ")
        return `(${fn})`
      })
      .with("MULTIPLY", () => {
        const fn = this.arguments(ctx).join(" * ")
        return `(${fn})`
      })
      .with("DIVIDE", () => {
        const fn = this.arguments(ctx).join(" / ")
        return `(${fn})`
      })
      .with("CONCAT", () => {
        const fn = this.arguments(ctx)
          .map((arg) => `COALESCE(${arg}, '')`)
          .join(" || ")
        return `(${fn})`
      })
      .with("AVERAGE", () => {
        const args = this.arguments(ctx)
        return `(
        (${args.map((arg) => `COALESCE(${arg}, 0)`).join(" + ")})
        /
        (NULLIF(
          ${args.map((arg) => `(CASE WHEN ${arg} IS NULL THEN 0 ELSE 1 END)`).join(" + ")}
        , 0)
        ))`
      })
      .with("LEFT", () => {
        const args = this.arguments(ctx)
        return `SUBSTR(${args[0]}, 1, ${args[1]})`
      })
      .with("RIGHT", () => {
        const args = this.arguments(ctx)
        return `SUBSTR(${args[0]}, -${args[1]}, ${args[1]})`
      })
      .with("MID", () => {
        const args = this.arguments(ctx)
        return `SUBSTR(${args[0]}, ${args[1]}, ${args[2]})`
      })
      .with("AND", () => {
        const args = this.arguments(ctx)
        return `(${args.map((arg) => `COALESCE(${arg}, FALSE)`).join(" AND ")})`
      })
      .with("OR", () => {
        const args = this.arguments(ctx)
        return `(${args.map((arg) => `COALESCE(${arg}, FALSE)`).join(" OR ")})`
      })
      .with("NOT", () => {
        const args = this.arguments(ctx)
        return `NOT ${args[0]}`
      })
      .with("SEARCH", () => {
        const args = this.arguments(ctx)
        return `COALESCE(INSTR(LOWER(COALESCE(${args[0]}, '')), LOWER(COALESCE(${args[1]}, ''))), 0)`
      })
      .with("LEN", () => {
        const args = this.arguments(ctx)
        return `LENGTH(${args[0]})`
      })
      .with("REPEAT", () => {
        const args = this.arguments(ctx)
        // args[0] 是要重复的字符串，args[1] 是重复次数
        return `SUBSTR(REPLACE(HEX(ZEROBLOB(${args[1]})), '00', ${args[0]}), 1, LENGTH(${args[0]}) * ${args[1]})`
      })
      .with("XOR", () => {
        const args = this.arguments(ctx)
        // 对多个参数递归应用 XOR
        // XOR(A,B,C) = XOR(XOR(A,B), C)
        return args.reduce((result, arg, index) => {
          if (index === 0) return arg
          return `((${result} OR ${arg}) AND NOT (${result} AND ${arg}))`
        })
      })
      .with("DATE_ADD", () => {
        const args = this.arguments(ctx)
        // args[0] 是日期时间戳
        // args[1] 是要增加的数值
        // args[2] 是单位 ('year', 'month', 'day', 'hour', 'minute', 'second')
        return `datetime(${args[0]}/1000, 'unixepoch', '+' || ${args[1]} || ' ' || ${args[2]})`
      })
      .with("DATE_SUBTRACT", () => {
        const args = this.arguments(ctx)
        return `datetime(${args[0]}/1000, 'unixepoch', '-' || ${args[1]} || ' ' || ${args[2]})`
      })
      .with("DATE_DIFF", () => {
        const args = this.arguments(ctx)
        // args[0] 是开始日期
        // args[1] 是结束日期
        // args[2] 是单位 ('year', 'month', 'day')
        return `CAST(
          CASE ${args[2]}
            WHEN 'day' THEN JULIANDAY(${args[1]}/1000, 'unixepoch') - JULIANDAY(${args[0]}/1000, 'unixepoch')
            WHEN 'month' THEN (
              (CAST(strftime('%Y', ${args[1]}/1000, 'unixepoch') AS INTEGER) - CAST(strftime('%Y', ${args[0]}/1000, 'unixepoch') AS INTEGER)) * 12 +
              (CAST(strftime('%m', ${args[1]}/1000, 'unixepoch') AS INTEGER) - CAST(strftime('%m', ${args[0]}/1000, 'unixepoch') AS INTEGER))
            )
            WHEN 'year' THEN (
              CAST(strftime('%Y', ${args[1]}/1000, 'unixepoch') AS INTEGER) - CAST(strftime('%Y', ${args[0]}/1000, 'unixepoch') AS INTEGER)
            )
          END AS INTEGER
        )`
      })
      .with("YEAR", () => {
        const args = this.arguments(ctx)
        return `CAST(strftime('%Y', ${args[0]}/1000, 'unixepoch') AS INTEGER)`
      })
      .with("MONTH", () => {
        const args = this.arguments(ctx)
        return `CAST(strftime('%m', ${args[0]}/1000, 'unixepoch') AS INTEGER)`
      })
      .with("DAY", () => {
        const args = this.arguments(ctx)
        return `CAST(strftime('%d', ${args[0]}/1000, 'unixepoch') AS INTEGER)`
      })
      .with("HOUR", () => {
        const args = this.arguments(ctx)
        return `CAST(strftime('%H', ${args[0]}/1000, 'unixepoch') AS INTEGER)`
      })
      .with("MINUTE", () => {
        const args = this.arguments(ctx)
        return `CAST(strftime('%M', ${args[0]}/1000, 'unixepoch') AS INTEGER)`
      })
      .with("SECOND", () => {
        const args = this.arguments(ctx)
        return `CAST(strftime('%S', ${args[0]}/1000, 'unixepoch') AS INTEGER)`
      })
      .with("WEEKDAY", () => {
        const args = this.arguments(ctx)
        return `CAST(strftime('%w', ${args[0]}/1000, 'unixepoch') AS INTEGER)`
      })
      .with("RECORD_ID", () => {
        return ID_TYPE
      })
      .with("AUTO_INCREMENT", () => {
        return `[${AUTO_INCREMENT_TYPE}]`
      })
      .with("CEILING", () => {
        const args = this.arguments(ctx)
        return `CAST(ROUND(${args[0]} + 0.499999999999999) AS INTEGER)`
      })
      .with("FLOOR", () => {
        const args = this.arguments(ctx)
        return `CAST(ROUND(${args[0]} - 0.499999999999999) AS INTEGER)`
      })
      .with("ROUND", () => {
        const args = this.arguments(ctx)
        return `CAST(ROUND(${args[0]}) AS INTEGER)`
      })
      .with("ABS", () => {
        const args = this.arguments(ctx)
        return `ABS(${args[0]})`
      })
      .with("SQRT", () => {
        const args = this.arguments(ctx)
        // 使用幂运算来实现平方根: x^0.5 = √x
        return `POWER(${args[0]}, 0.5)`
      })
      .with("POWER", () => {
        const args = this.arguments(ctx)
        // 使用 exp 和 ln 实现幂运算: a^b = e^(b*ln(a))
        return `POWER(${args[0]}, ${args[1]})`
      })
      .with("MOD", () => {
        const args = this.arguments(ctx)
        return `(${args[0]} % ${args[1]})`
      })
      .otherwise(() => {
        const args = ctx.argumentList() ? this.visit(ctx.argumentList()!) : ""
        return `${functionName}(${args})`
      })
  }

  visitArgumentList = (ctx: ArgumentListContext): string => {
    return ctx
      .expression_list()
      .map((expr) => this.visit(expr))
      .join(", ")
  }
}
