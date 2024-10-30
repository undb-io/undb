parser grammar FormulaParser;

options {
	tokenVocab = FormulaLexer;
}

formula: expression EOF;

expression:
	expression op = (MULTIPLY | DIVIDE | MODULO) expression	# MulDivModExpr
	| expression op = (ADD | SUBTRACT) expression			# AddSubExpr
	| expression POWER expression							# PowerExpr
	| expression op = (
		EQUAL
		| NOT_EQUAL
		| LESS
		| LESS_EQUAL
		| GREATER
		| GREATER_EQUAL
	) expression				# ComparisonExpr
	| expression AND expression	# AndExpr
	| expression OR expression	# OrExpr
	| NOT expression			# NotExpr
	| functionCall				# FunctionExpr
	| variable					# VariableExpr
	| NUMBER					# NumberExpr
	| STRING					# StringExpr
	| TRUE						# TrueExpr
	| FALSE						# FalseExpr
	| NULL						# NullExpr
	| DATE						# DateExpr
	| TIME						# TimeExpr
	| DATETIME					# DateTimeExpr
	| LPAREN expression RPAREN	# ParenExpr;

functionCall: IDENTIFIER LPAREN argumentList? RPAREN;

argumentList: expression (COMMA expression)*;
// 这个表达式定义了一个参数列表，由一个或多个表达式组成，表达式之间用逗号分隔。例如：func(1, 2, 3) 中，1, 2, 3 就是参数列表。

variable: LBRACE LBRACE IDENTIFIER RBRACE RBRACE;