// Generated from src/grammar/FormulaParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { FormulaParserListener } from "./FormulaParserListener";
import { FormulaParserVisitor } from "./FormulaParserVisitor";


export class FormulaParser extends Parser {
	public static readonly ADD = 1;
	public static readonly SUBTRACT = 2;
	public static readonly MULTIPLY = 3;
	public static readonly DIVIDE = 4;
	public static readonly MODULO = 5;
	public static readonly POWER = 6;
	public static readonly EQUAL = 7;
	public static readonly NOT_EQUAL = 8;
	public static readonly LESS = 9;
	public static readonly LESS_EQUAL = 10;
	public static readonly GREATER = 11;
	public static readonly GREATER_EQUAL = 12;
	public static readonly AND = 13;
	public static readonly OR = 14;
	public static readonly NOT = 15;
	public static readonly LPAREN = 16;
	public static readonly RPAREN = 17;
	public static readonly LBRACE = 18;
	public static readonly RBRACE = 19;
	public static readonly LBRACKET = 20;
	public static readonly RBRACKET = 21;
	public static readonly COMMA = 22;
	public static readonly SEMICOLON = 23;
	public static readonly COLON = 24;
	public static readonly DOT = 25;
	public static readonly IDENTIFIER = 26;
	public static readonly NUMBER = 27;
	public static readonly STRING = 28;
	public static readonly TRUE = 29;
	public static readonly FALSE = 30;
	public static readonly NULL = 31;
	public static readonly DATE = 32;
	public static readonly TIME = 33;
	public static readonly DATETIME = 34;
	public static readonly WS = 35;
	public static readonly COMMENT = 36;
	public static readonly MULTILINE_COMMENT = 37;
	public static readonly RULE_formula = 0;
	public static readonly RULE_expression = 1;
	public static readonly RULE_functionCall = 2;
	public static readonly RULE_argumentList = 3;
	public static readonly RULE_variable = 4;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"formula", "expression", "functionCall", "argumentList", "variable",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'+'", "'-'", "'*'", "'/'", "'%'", "'^'", "'='", "'!='", "'<'", 
		"'<='", "'>'", "'>='", undefined, undefined, undefined, "'('", "')'", 
		"'{'", "'}'", "'['", "']'", "','", "';'", "':'", "'.'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "MODULO", "POWER", 
		"EQUAL", "NOT_EQUAL", "LESS", "LESS_EQUAL", "GREATER", "GREATER_EQUAL", 
		"AND", "OR", "NOT", "LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", 
		"RBRACKET", "COMMA", "SEMICOLON", "COLON", "DOT", "IDENTIFIER", "NUMBER", 
		"STRING", "TRUE", "FALSE", "NULL", "DATE", "TIME", "DATETIME", "WS", "COMMENT", 
		"MULTILINE_COMMENT",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(FormulaParser._LITERAL_NAMES, FormulaParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return FormulaParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "FormulaParser.g4"; }

	// @Override
	public get ruleNames(): string[] { return FormulaParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return FormulaParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(FormulaParser._ATN, this);
	}
	// @RuleVersion(0)
	public formula(): FormulaContext {
		let _localctx: FormulaContext = new FormulaContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, FormulaParser.RULE_formula);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 10;
			this.expression(0);
			this.state = 11;
			this.match(FormulaParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, _parentState);
		let _prevctx: ExpressionContext = _localctx;
		let _startState: number = 2;
		this.enterRecursionRule(_localctx, 2, FormulaParser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 30;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case FormulaParser.NOT:
				{
				_localctx = new NotExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 14;
				this.match(FormulaParser.NOT);
				this.state = 15;
				this.expression(12);
				}
				break;
			case FormulaParser.IDENTIFIER:
				{
				_localctx = new FunctionExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 16;
				this.functionCall();
				}
				break;
			case FormulaParser.LBRACE:
				{
				_localctx = new VariableExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 17;
				this.variable();
				}
				break;
			case FormulaParser.NUMBER:
				{
				_localctx = new NumberExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 18;
				this.match(FormulaParser.NUMBER);
				}
				break;
			case FormulaParser.STRING:
				{
				_localctx = new StringExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 19;
				this.match(FormulaParser.STRING);
				}
				break;
			case FormulaParser.TRUE:
				{
				_localctx = new TrueExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 20;
				this.match(FormulaParser.TRUE);
				}
				break;
			case FormulaParser.FALSE:
				{
				_localctx = new FalseExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 21;
				this.match(FormulaParser.FALSE);
				}
				break;
			case FormulaParser.NULL:
				{
				_localctx = new NullExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 22;
				this.match(FormulaParser.NULL);
				}
				break;
			case FormulaParser.DATE:
				{
				_localctx = new DateExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 23;
				this.match(FormulaParser.DATE);
				}
				break;
			case FormulaParser.TIME:
				{
				_localctx = new TimeExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 24;
				this.match(FormulaParser.TIME);
				}
				break;
			case FormulaParser.DATETIME:
				{
				_localctx = new DateTimeExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 25;
				this.match(FormulaParser.DATETIME);
				}
				break;
			case FormulaParser.LPAREN:
				{
				_localctx = new ParenExprContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 26;
				this.match(FormulaParser.LPAREN);
				this.state = 27;
				this.expression(0);
				this.state = 28;
				this.match(FormulaParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 52;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 50;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
					case 1:
						{
						_localctx = new MulDivModExprContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expression);
						this.state = 32;
						if (!(this.precpred(this._ctx, 18))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 18)");
						}
						this.state = 33;
						(_localctx as MulDivModExprContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << FormulaParser.MULTIPLY) | (1 << FormulaParser.DIVIDE) | (1 << FormulaParser.MODULO))) !== 0))) {
							(_localctx as MulDivModExprContext)._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 34;
						this.expression(19);
						}
						break;

					case 2:
						{
						_localctx = new AddSubExprContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expression);
						this.state = 35;
						if (!(this.precpred(this._ctx, 17))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
						}
						this.state = 36;
						(_localctx as AddSubExprContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === FormulaParser.ADD || _la === FormulaParser.SUBTRACT)) {
							(_localctx as AddSubExprContext)._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 37;
						this.expression(18);
						}
						break;

					case 3:
						{
						_localctx = new PowerExprContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expression);
						this.state = 38;
						if (!(this.precpred(this._ctx, 16))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 16)");
						}
						this.state = 39;
						this.match(FormulaParser.POWER);
						this.state = 40;
						this.expression(17);
						}
						break;

					case 4:
						{
						_localctx = new ComparisonExprContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expression);
						this.state = 41;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 42;
						(_localctx as ComparisonExprContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << FormulaParser.EQUAL) | (1 << FormulaParser.NOT_EQUAL) | (1 << FormulaParser.LESS) | (1 << FormulaParser.LESS_EQUAL) | (1 << FormulaParser.GREATER) | (1 << FormulaParser.GREATER_EQUAL))) !== 0))) {
							(_localctx as ComparisonExprContext)._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 43;
						this.expression(16);
						}
						break;

					case 5:
						{
						_localctx = new AndExprContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expression);
						this.state = 44;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 45;
						this.match(FormulaParser.AND);
						this.state = 46;
						this.expression(15);
						}
						break;

					case 6:
						{
						_localctx = new OrExprContext(new ExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, FormulaParser.RULE_expression);
						this.state = 47;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 48;
						this.match(FormulaParser.OR);
						this.state = 49;
						this.expression(14);
						}
						break;
					}
					}
				}
				this.state = 54;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionCall(): FunctionCallContext {
		let _localctx: FunctionCallContext = new FunctionCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, FormulaParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 55;
			this.match(FormulaParser.IDENTIFIER);
			this.state = 56;
			this.match(FormulaParser.LPAREN);
			this.state = 58;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 15)) & ~0x1F) === 0 && ((1 << (_la - 15)) & ((1 << (FormulaParser.NOT - 15)) | (1 << (FormulaParser.LPAREN - 15)) | (1 << (FormulaParser.LBRACE - 15)) | (1 << (FormulaParser.IDENTIFIER - 15)) | (1 << (FormulaParser.NUMBER - 15)) | (1 << (FormulaParser.STRING - 15)) | (1 << (FormulaParser.TRUE - 15)) | (1 << (FormulaParser.FALSE - 15)) | (1 << (FormulaParser.NULL - 15)) | (1 << (FormulaParser.DATE - 15)) | (1 << (FormulaParser.TIME - 15)) | (1 << (FormulaParser.DATETIME - 15)))) !== 0)) {
				{
				this.state = 57;
				this.argumentList();
				}
			}

			this.state = 60;
			this.match(FormulaParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argumentList(): ArgumentListContext {
		let _localctx: ArgumentListContext = new ArgumentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, FormulaParser.RULE_argumentList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 62;
			this.expression(0);
			this.state = 67;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === FormulaParser.COMMA) {
				{
				{
				this.state = 63;
				this.match(FormulaParser.COMMA);
				this.state = 64;
				this.expression(0);
				}
				}
				this.state = 69;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variable(): VariableContext {
		let _localctx: VariableContext = new VariableContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, FormulaParser.RULE_variable);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 70;
			this.match(FormulaParser.LBRACE);
			this.state = 71;
			this.match(FormulaParser.LBRACE);
			this.state = 72;
			this.match(FormulaParser.IDENTIFIER);
			this.state = 73;
			this.match(FormulaParser.RBRACE);
			this.state = 74;
			this.match(FormulaParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 1:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 18);

		case 1:
			return this.precpred(this._ctx, 17);

		case 2:
			return this.precpred(this._ctx, 16);

		case 3:
			return this.precpred(this._ctx, 15);

		case 4:
			return this.precpred(this._ctx, 14);

		case 5:
			return this.precpred(this._ctx, 13);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\'O\x04\x02\t" +
		"\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x03\x02\x03" +
		"\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x05\x03!\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x07\x035\n\x03\f\x03\x0E\x038\v\x03\x03\x04\x03\x04" +
		"\x03\x04\x05\x04=\n\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05\x07\x05" +
		"D\n\x05\f\x05\x0E\x05G\v\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x03\x06\x02\x02\x03\x04\x07\x02\x02\x04\x02\x06\x02\b\x02\n\x02\x02" +
		"\x05\x03\x02\x05\x07\x03\x02\x03\x04\x03\x02\t\x0E\x02\\\x02\f\x03\x02" +
		"\x02\x02\x04 \x03\x02\x02\x02\x069\x03\x02\x02\x02\b@\x03\x02\x02\x02" +
		"\nH\x03\x02\x02\x02\f\r\x05\x04\x03\x02\r\x0E\x07\x02\x02\x03\x0E\x03" +
		"\x03\x02\x02\x02\x0F\x10\b\x03\x01\x02\x10\x11\x07\x11\x02\x02\x11!\x05" +
		"\x04\x03\x0E\x12!\x05\x06\x04\x02\x13!\x05\n\x06\x02\x14!\x07\x1D\x02" +
		"\x02\x15!\x07\x1E\x02\x02\x16!\x07\x1F\x02\x02\x17!\x07 \x02\x02\x18!" +
		"\x07!\x02\x02\x19!\x07\"\x02\x02\x1A!\x07#\x02\x02\x1B!\x07$\x02\x02\x1C" +
		"\x1D\x07\x12\x02\x02\x1D\x1E\x05\x04\x03\x02\x1E\x1F\x07\x13\x02\x02\x1F" +
		"!\x03\x02\x02\x02 \x0F\x03\x02\x02\x02 \x12\x03\x02\x02\x02 \x13\x03\x02" +
		"\x02\x02 \x14\x03\x02\x02\x02 \x15\x03\x02\x02\x02 \x16\x03\x02\x02\x02" +
		" \x17\x03\x02\x02\x02 \x18\x03\x02\x02\x02 \x19\x03\x02\x02\x02 \x1A\x03" +
		"\x02\x02\x02 \x1B\x03\x02\x02\x02 \x1C\x03\x02\x02\x02!6\x03\x02\x02\x02" +
		"\"#\f\x14\x02\x02#$\t\x02\x02\x02$5\x05\x04\x03\x15%&\f\x13\x02\x02&\'" +
		"\t\x03\x02\x02\'5\x05\x04\x03\x14()\f\x12\x02\x02)*\x07\b\x02\x02*5\x05" +
		"\x04\x03\x13+,\f\x11\x02\x02,-\t\x04\x02\x02-5\x05\x04\x03\x12./\f\x10" +
		"\x02\x02/0\x07\x0F\x02\x0205\x05\x04\x03\x1112\f\x0F\x02\x0223\x07\x10" +
		"\x02\x0235\x05\x04\x03\x104\"\x03\x02\x02\x024%\x03\x02\x02\x024(\x03" +
		"\x02\x02\x024+\x03\x02\x02\x024.\x03\x02\x02\x0241\x03\x02\x02\x0258\x03" +
		"\x02\x02\x0264\x03\x02\x02\x0267\x03\x02\x02\x027\x05\x03\x02\x02\x02" +
		"86\x03\x02\x02\x029:\x07\x1C\x02\x02:<\x07\x12\x02\x02;=\x05\b\x05\x02" +
		"<;\x03\x02\x02\x02<=\x03\x02\x02\x02=>\x03\x02\x02\x02>?\x07\x13\x02\x02" +
		"?\x07\x03\x02\x02\x02@E\x05\x04\x03\x02AB\x07\x18\x02\x02BD\x05\x04\x03" +
		"\x02CA\x03\x02\x02\x02DG\x03\x02\x02\x02EC\x03\x02\x02\x02EF\x03\x02\x02" +
		"\x02F\t\x03\x02\x02\x02GE\x03\x02\x02\x02HI\x07\x14\x02\x02IJ\x07\x14" +
		"\x02\x02JK\x07\x1C\x02\x02KL\x07\x15\x02\x02LM\x07\x15\x02\x02M\v\x03" +
		"\x02\x02\x02\x07 46<E";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!FormulaParser.__ATN) {
			FormulaParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(FormulaParser._serializedATN));
		}

		return FormulaParser.__ATN;
	}

}

export class FormulaContext extends ParserRuleContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public EOF(): TerminalNode { return this.getToken(FormulaParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_formula; }
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterFormula) {
			listener.enterFormula(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitFormula) {
			listener.exitFormula(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitFormula) {
			return visitor.visitFormula(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_expression; }
	public copyFrom(ctx: ExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class MulDivModExprContext extends ExpressionContext {
	public _op!: Token;
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public MULTIPLY(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.MULTIPLY, 0); }
	public DIVIDE(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.DIVIDE, 0); }
	public MODULO(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.MODULO, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterMulDivModExpr) {
			listener.enterMulDivModExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitMulDivModExpr) {
			listener.exitMulDivModExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitMulDivModExpr) {
			return visitor.visitMulDivModExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AddSubExprContext extends ExpressionContext {
	public _op!: Token;
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public ADD(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.ADD, 0); }
	public SUBTRACT(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.SUBTRACT, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterAddSubExpr) {
			listener.enterAddSubExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitAddSubExpr) {
			listener.exitAddSubExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitAddSubExpr) {
			return visitor.visitAddSubExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PowerExprContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public POWER(): TerminalNode { return this.getToken(FormulaParser.POWER, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterPowerExpr) {
			listener.enterPowerExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitPowerExpr) {
			listener.exitPowerExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitPowerExpr) {
			return visitor.visitPowerExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ComparisonExprContext extends ExpressionContext {
	public _op!: Token;
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public EQUAL(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.EQUAL, 0); }
	public NOT_EQUAL(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.NOT_EQUAL, 0); }
	public LESS(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.LESS, 0); }
	public LESS_EQUAL(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.LESS_EQUAL, 0); }
	public GREATER(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.GREATER, 0); }
	public GREATER_EQUAL(): TerminalNode | undefined { return this.tryGetToken(FormulaParser.GREATER_EQUAL, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterComparisonExpr) {
			listener.enterComparisonExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitComparisonExpr) {
			listener.exitComparisonExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitComparisonExpr) {
			return visitor.visitComparisonExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AndExprContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public AND(): TerminalNode { return this.getToken(FormulaParser.AND, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterAndExpr) {
			listener.enterAndExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitAndExpr) {
			listener.exitAndExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitAndExpr) {
			return visitor.visitAndExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class OrExprContext extends ExpressionContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public OR(): TerminalNode { return this.getToken(FormulaParser.OR, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterOrExpr) {
			listener.enterOrExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitOrExpr) {
			listener.exitOrExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitOrExpr) {
			return visitor.visitOrExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NotExprContext extends ExpressionContext {
	public NOT(): TerminalNode { return this.getToken(FormulaParser.NOT, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterNotExpr) {
			listener.enterNotExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitNotExpr) {
			listener.exitNotExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitNotExpr) {
			return visitor.visitNotExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FunctionExprContext extends ExpressionContext {
	public functionCall(): FunctionCallContext {
		return this.getRuleContext(0, FunctionCallContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterFunctionExpr) {
			listener.enterFunctionExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitFunctionExpr) {
			listener.exitFunctionExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitFunctionExpr) {
			return visitor.visitFunctionExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VariableExprContext extends ExpressionContext {
	public variable(): VariableContext {
		return this.getRuleContext(0, VariableContext);
	}
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterVariableExpr) {
			listener.enterVariableExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitVariableExpr) {
			listener.exitVariableExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitVariableExpr) {
			return visitor.visitVariableExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NumberExprContext extends ExpressionContext {
	public NUMBER(): TerminalNode { return this.getToken(FormulaParser.NUMBER, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterNumberExpr) {
			listener.enterNumberExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitNumberExpr) {
			listener.exitNumberExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitNumberExpr) {
			return visitor.visitNumberExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class StringExprContext extends ExpressionContext {
	public STRING(): TerminalNode { return this.getToken(FormulaParser.STRING, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterStringExpr) {
			listener.enterStringExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitStringExpr) {
			listener.exitStringExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitStringExpr) {
			return visitor.visitStringExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TrueExprContext extends ExpressionContext {
	public TRUE(): TerminalNode { return this.getToken(FormulaParser.TRUE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterTrueExpr) {
			listener.enterTrueExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitTrueExpr) {
			listener.exitTrueExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitTrueExpr) {
			return visitor.visitTrueExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FalseExprContext extends ExpressionContext {
	public FALSE(): TerminalNode { return this.getToken(FormulaParser.FALSE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterFalseExpr) {
			listener.enterFalseExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitFalseExpr) {
			listener.exitFalseExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitFalseExpr) {
			return visitor.visitFalseExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NullExprContext extends ExpressionContext {
	public NULL(): TerminalNode { return this.getToken(FormulaParser.NULL, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterNullExpr) {
			listener.enterNullExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitNullExpr) {
			listener.exitNullExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitNullExpr) {
			return visitor.visitNullExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DateExprContext extends ExpressionContext {
	public DATE(): TerminalNode { return this.getToken(FormulaParser.DATE, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterDateExpr) {
			listener.enterDateExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitDateExpr) {
			listener.exitDateExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitDateExpr) {
			return visitor.visitDateExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TimeExprContext extends ExpressionContext {
	public TIME(): TerminalNode { return this.getToken(FormulaParser.TIME, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterTimeExpr) {
			listener.enterTimeExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitTimeExpr) {
			listener.exitTimeExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitTimeExpr) {
			return visitor.visitTimeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DateTimeExprContext extends ExpressionContext {
	public DATETIME(): TerminalNode { return this.getToken(FormulaParser.DATETIME, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterDateTimeExpr) {
			listener.enterDateTimeExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitDateTimeExpr) {
			listener.exitDateTimeExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitDateTimeExpr) {
			return visitor.visitDateTimeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenExprContext extends ExpressionContext {
	public LPAREN(): TerminalNode { return this.getToken(FormulaParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(FormulaParser.RPAREN, 0); }
	constructor(ctx: ExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterParenExpr) {
			listener.enterParenExpr(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitParenExpr) {
			listener.exitParenExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitParenExpr) {
			return visitor.visitParenExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionCallContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(FormulaParser.IDENTIFIER, 0); }
	public LPAREN(): TerminalNode { return this.getToken(FormulaParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(FormulaParser.RPAREN, 0); }
	public argumentList(): ArgumentListContext | undefined {
		return this.tryGetRuleContext(0, ArgumentListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_functionCall; }
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterFunctionCall) {
			listener.enterFunctionCall(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitFunctionCall) {
			listener.exitFunctionCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitFunctionCall) {
			return visitor.visitFunctionCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentListContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(FormulaParser.COMMA);
		} else {
			return this.getToken(FormulaParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_argumentList; }
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterArgumentList) {
			listener.enterArgumentList(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitArgumentList) {
			listener.exitArgumentList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitArgumentList) {
			return visitor.visitArgumentList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableContext extends ParserRuleContext {
	public LBRACE(): TerminalNode[];
	public LBRACE(i: number): TerminalNode;
	public LBRACE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(FormulaParser.LBRACE);
		} else {
			return this.getToken(FormulaParser.LBRACE, i);
		}
	}
	public IDENTIFIER(): TerminalNode { return this.getToken(FormulaParser.IDENTIFIER, 0); }
	public RBRACE(): TerminalNode[];
	public RBRACE(i: number): TerminalNode;
	public RBRACE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(FormulaParser.RBRACE);
		} else {
			return this.getToken(FormulaParser.RBRACE, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return FormulaParser.RULE_variable; }
	// @Override
	public enterRule(listener: FormulaParserListener): void {
		if (listener.enterVariable) {
			listener.enterVariable(this);
		}
	}
	// @Override
	public exitRule(listener: FormulaParserListener): void {
		if (listener.exitVariable) {
			listener.exitVariable(this);
		}
	}
	// @Override
	public accept<Result>(visitor: FormulaParserVisitor<Result>): Result {
		if (visitor.visitVariable) {
			return visitor.visitVariable(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


