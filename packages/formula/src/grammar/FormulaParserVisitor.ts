// Generated from src/grammar/FormulaParser.g4 by ANTLR 4.13.2

import {ParseTreeVisitor} from 'antlr4';


import { FormulaContext } from "./FormulaParser.js";
import { AndExprContext } from "./FormulaParser.js";
import { StringExprContext } from "./FormulaParser.js";
import { FunctionExprContext } from "./FormulaParser.js";
import { TrueExprContext } from "./FormulaParser.js";
import { TimeExprContext } from "./FormulaParser.js";
import { ComparisonExprContext } from "./FormulaParser.js";
import { DateExprContext } from "./FormulaParser.js";
import { OrExprContext } from "./FormulaParser.js";
import { FalseExprContext } from "./FormulaParser.js";
import { NullExprContext } from "./FormulaParser.js";
import { DateTimeExprContext } from "./FormulaParser.js";
import { PowerExprContext } from "./FormulaParser.js";
import { NumberExprContext } from "./FormulaParser.js";
import { MulDivModExprContext } from "./FormulaParser.js";
import { VariableExprContext } from "./FormulaParser.js";
import { NotExprContext } from "./FormulaParser.js";
import { ParenExprContext } from "./FormulaParser.js";
import { AddSubExprContext } from "./FormulaParser.js";
import { FunctionCallContext } from "./FormulaParser.js";
import { ArgumentListContext } from "./FormulaParser.js";
import { VariableContext } from "./FormulaParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `FormulaParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class FormulaParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `FormulaParser.formula`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormula?: (ctx: FormulaContext) => Result;
	/**
	 * Visit a parse tree produced by the `AndExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAndExpr?: (ctx: AndExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `StringExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringExpr?: (ctx: StringExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `FunctionExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionExpr?: (ctx: FunctionExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `TrueExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTrueExpr?: (ctx: TrueExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `TimeExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTimeExpr?: (ctx: TimeExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `ComparisonExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComparisonExpr?: (ctx: ComparisonExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `DateExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDateExpr?: (ctx: DateExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `OrExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOrExpr?: (ctx: OrExprContext) => Result;
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
	 * Visit a parse tree produced by the `DateTimeExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDateTimeExpr?: (ctx: DateTimeExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `PowerExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPowerExpr?: (ctx: PowerExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `NumberExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumberExpr?: (ctx: NumberExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `MulDivModExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMulDivModExpr?: (ctx: MulDivModExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `VariableExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableExpr?: (ctx: VariableExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `NotExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNotExpr?: (ctx: NotExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `ParenExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenExpr?: (ctx: ParenExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `AddSubExpr`
	 * labeled alternative in `FormulaParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAddSubExpr?: (ctx: AddSubExprContext) => Result;
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

