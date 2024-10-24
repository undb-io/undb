// Generated from src/grammar/FormulaParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { MulDivModExprContext } from "./FormulaParser";
import { AddSubExprContext } from "./FormulaParser";
import { PowerExprContext } from "./FormulaParser";
import { ComparisonExprContext } from "./FormulaParser";
import { AndExprContext } from "./FormulaParser";
import { OrExprContext } from "./FormulaParser";
import { NotExprContext } from "./FormulaParser";
import { FunctionExprContext } from "./FormulaParser";
import { VariableExprContext } from "./FormulaParser";
import { NumberExprContext } from "./FormulaParser";
import { StringExprContext } from "./FormulaParser";
import { TrueExprContext } from "./FormulaParser";
import { FalseExprContext } from "./FormulaParser";
import { NullExprContext } from "./FormulaParser";
import { DateExprContext } from "./FormulaParser";
import { TimeExprContext } from "./FormulaParser";
import { DateTimeExprContext } from "./FormulaParser";
import { ParenExprContext } from "./FormulaParser";
import { FormulaContext } from "./FormulaParser";
import { ExpressionContext } from "./FormulaParser";
import { FunctionCallContext } from "./FormulaParser";
import { ArgumentListContext } from "./FormulaParser";
import { VariableContext } from "./FormulaParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `FormulaParser`.
 */
export interface FormulaParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `MulDivModExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterMulDivModExpr?: (ctx: MulDivModExprContext) => void;
	/**
	 * Exit a parse tree produced by the `MulDivModExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitMulDivModExpr?: (ctx: MulDivModExprContext) => void;

	/**
	 * Enter a parse tree produced by the `AddSubExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterAddSubExpr?: (ctx: AddSubExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AddSubExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitAddSubExpr?: (ctx: AddSubExprContext) => void;

	/**
	 * Enter a parse tree produced by the `PowerExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterPowerExpr?: (ctx: PowerExprContext) => void;
	/**
	 * Exit a parse tree produced by the `PowerExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitPowerExpr?: (ctx: PowerExprContext) => void;

	/**
	 * Enter a parse tree produced by the `ComparisonExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterComparisonExpr?: (ctx: ComparisonExprContext) => void;
	/**
	 * Exit a parse tree produced by the `ComparisonExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitComparisonExpr?: (ctx: ComparisonExprContext) => void;

	/**
	 * Enter a parse tree produced by the `AndExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterAndExpr?: (ctx: AndExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AndExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitAndExpr?: (ctx: AndExprContext) => void;

	/**
	 * Enter a parse tree produced by the `OrExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterOrExpr?: (ctx: OrExprContext) => void;
	/**
	 * Exit a parse tree produced by the `OrExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitOrExpr?: (ctx: OrExprContext) => void;

	/**
	 * Enter a parse tree produced by the `NotExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNotExpr?: (ctx: NotExprContext) => void;
	/**
	 * Exit a parse tree produced by the `NotExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNotExpr?: (ctx: NotExprContext) => void;

	/**
	 * Enter a parse tree produced by the `FunctionExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterFunctionExpr?: (ctx: FunctionExprContext) => void;
	/**
	 * Exit a parse tree produced by the `FunctionExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitFunctionExpr?: (ctx: FunctionExprContext) => void;

	/**
	 * Enter a parse tree produced by the `VariableExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterVariableExpr?: (ctx: VariableExprContext) => void;
	/**
	 * Exit a parse tree produced by the `VariableExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitVariableExpr?: (ctx: VariableExprContext) => void;

	/**
	 * Enter a parse tree produced by the `NumberExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNumberExpr?: (ctx: NumberExprContext) => void;
	/**
	 * Exit a parse tree produced by the `NumberExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNumberExpr?: (ctx: NumberExprContext) => void;

	/**
	 * Enter a parse tree produced by the `StringExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterStringExpr?: (ctx: StringExprContext) => void;
	/**
	 * Exit a parse tree produced by the `StringExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitStringExpr?: (ctx: StringExprContext) => void;

	/**
	 * Enter a parse tree produced by the `TrueExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterTrueExpr?: (ctx: TrueExprContext) => void;
	/**
	 * Exit a parse tree produced by the `TrueExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitTrueExpr?: (ctx: TrueExprContext) => void;

	/**
	 * Enter a parse tree produced by the `FalseExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterFalseExpr?: (ctx: FalseExprContext) => void;
	/**
	 * Exit a parse tree produced by the `FalseExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitFalseExpr?: (ctx: FalseExprContext) => void;

	/**
	 * Enter a parse tree produced by the `NullExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNullExpr?: (ctx: NullExprContext) => void;
	/**
	 * Exit a parse tree produced by the `NullExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNullExpr?: (ctx: NullExprContext) => void;

	/**
	 * Enter a parse tree produced by the `DateExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterDateExpr?: (ctx: DateExprContext) => void;
	/**
	 * Exit a parse tree produced by the `DateExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitDateExpr?: (ctx: DateExprContext) => void;

	/**
	 * Enter a parse tree produced by the `TimeExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterTimeExpr?: (ctx: TimeExprContext) => void;
	/**
	 * Exit a parse tree produced by the `TimeExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitTimeExpr?: (ctx: TimeExprContext) => void;

	/**
	 * Enter a parse tree produced by the `DateTimeExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterDateTimeExpr?: (ctx: DateTimeExprContext) => void;
	/**
	 * Exit a parse tree produced by the `DateTimeExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitDateTimeExpr?: (ctx: DateTimeExprContext) => void;

	/**
	 * Enter a parse tree produced by the `ParenExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterParenExpr?: (ctx: ParenExprContext) => void;
	/**
	 * Exit a parse tree produced by the `ParenExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitParenExpr?: (ctx: ParenExprContext) => void;

	/**
	 * Enter a parse tree produced by `FormulaParser.formula`.
	 * @param ctx the parse tree
	 */
	enterFormula?: (ctx: FormulaContext) => void;
	/**
	 * Exit a parse tree produced by `FormulaParser.formula`.
	 * @param ctx the parse tree
	 */
	exitFormula?: (ctx: FormulaContext) => void;

	/**
	 * Enter a parse tree produced by `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `FormulaParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `FormulaParser.functionCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `FormulaParser.functionCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;

	/**
	 * Enter a parse tree produced by `FormulaParser.argumentList`.
	 * @param ctx the parse tree
	 */
	enterArgumentList?: (ctx: ArgumentListContext) => void;
	/**
	 * Exit a parse tree produced by `FormulaParser.argumentList`.
	 * @param ctx the parse tree
	 */
	exitArgumentList?: (ctx: ArgumentListContext) => void;

	/**
	 * Enter a parse tree produced by `FormulaParser.variable`.
	 * @param ctx the parse tree
	 */
	enterVariable?: (ctx: VariableContext) => void;
	/**
	 * Exit a parse tree produced by `FormulaParser.variable`.
	 * @param ctx the parse tree
	 */
	exitVariable?: (ctx: VariableContext) => void;
}

