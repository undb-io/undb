// Generated from src/grammar/FormulaParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `FormulaParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface FormulaParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by the `MulDivModExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMulDivModExpr?: (ctx: MulDivModExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `AddSubExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAddSubExpr?: (ctx: AddSubExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `PowerExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPowerExpr?: (ctx: PowerExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `ComparisonExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComparisonExpr?: (ctx: ComparisonExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `AndExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAndExpr?: (ctx: AndExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `OrExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOrExpr?: (ctx: OrExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `NotExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNotExpr?: (ctx: NotExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `FunctionExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionExpr?: (ctx: FunctionExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `VariableExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableExpr?: (ctx: VariableExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `NumberExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumberExpr?: (ctx: NumberExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `StringExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringExpr?: (ctx: StringExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `TrueExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTrueExpr?: (ctx: TrueExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `FalseExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFalseExpr?: (ctx: FalseExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `NullExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNullExpr?: (ctx: NullExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `DateExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDateExpr?: (ctx: DateExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `TimeExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTimeExpr?: (ctx: TimeExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `DateTimeExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDateTimeExpr?: (ctx: DateTimeExprContext) => Result;

	/**
	 * Visit a parse tree produced by the `ParenExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenExpr?: (ctx: ParenExprContext) => Result;

	/**
	 * Visit a parse tree produced by `FormulaParser.formula`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormula?: (ctx: FormulaContext) => Result;

	/**
	 * Visit a parse tree produced by `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `FormulaParser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;

	/**
	 * Visit a parse tree produced by `FormulaParser.argumentList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgumentList?: (ctx: ArgumentListContext) => Result;

	/**
	 * Visit a parse tree produced by `FormulaParser.variable`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariable?: (ctx: VariableContext) => Result;
}

