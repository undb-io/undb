// Generated from src/grammar/FormulaParser.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import FormulaParserVisitor from "./FormulaParserVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class FormulaParser extends Parser {
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
	public static readonly UNDERSCORE = 26;
	public static readonly IDENTIFIER = 27;
	public static readonly NUMBER = 28;
	public static readonly STRING = 29;
	public static readonly TRUE = 30;
	public static readonly FALSE = 31;
	public static readonly NULL = 32;
	public static readonly DATE = 33;
	public static readonly TIME = 34;
	public static readonly DATETIME = 35;
	public static readonly WS = 36;
	public static readonly COMMENT = 37;
	public static readonly MULTILINE_COMMENT = 38;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_formula = 0;
	public static readonly RULE_expression = 1;
	public static readonly RULE_functionCall = 2;
	public static readonly RULE_argumentList = 3;
	public static readonly RULE_variable = 4;
	public static readonly literalNames: (string | null)[] = [ null, "'+'", 
                                                            "'-'", "'*'", 
                                                            "'/'", "'%'", 
                                                            "'^'", "'='", 
                                                            "'!='", "'<'", 
                                                            "'<='", "'>'", 
                                                            "'>='", null, 
                                                            null, null, 
                                                            "'('", "')'", 
                                                            "'{'", "'}'", 
                                                            "'['", "']'", 
                                                            "','", "';'", 
                                                            "':'", "'.'", 
                                                            "'_'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "ADD", 
                                                             "SUBTRACT", 
                                                             "MULTIPLY", 
                                                             "DIVIDE", "MODULO", 
                                                             "POWER", "EQUAL", 
                                                             "NOT_EQUAL", 
                                                             "LESS", "LESS_EQUAL", 
                                                             "GREATER", 
                                                             "GREATER_EQUAL", 
                                                             "AND", "OR", 
                                                             "NOT", "LPAREN", 
                                                             "RPAREN", "LBRACE", 
                                                             "RBRACE", "LBRACKET", 
                                                             "RBRACKET", 
                                                             "COMMA", "SEMICOLON", 
                                                             "COLON", "DOT", 
                                                             "UNDERSCORE", 
                                                             "IDENTIFIER", 
                                                             "NUMBER", "STRING", 
                                                             "TRUE", "FALSE", 
                                                             "NULL", "DATE", 
                                                             "TIME", "DATETIME", 
                                                             "WS", "COMMENT", 
                                                             "MULTILINE_COMMENT" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"formula", "expression", "functionCall", "argumentList", "variable",
	];
	public get grammarFileName(): string { return "FormulaParser.g4"; }
	public get literalNames(): (string | null)[] { return FormulaParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return FormulaParser.symbolicNames; }
	public get ruleNames(): string[] { return FormulaParser.ruleNames; }
	public get serializedATN(): number[] { return FormulaParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, FormulaParser._ATN, FormulaParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public formula(): FormulaContext {
		let localctx: FormulaContext = new FormulaContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, FormulaParser.RULE_formula);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 10;
			this.expression(0);
			this.state = 11;
			this.match(FormulaParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
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
		let localctx: ExpressionContext = new ExpressionContext(this, this._ctx, _parentState);
		let _prevctx: ExpressionContext = localctx;
		let _startState: number = 2;
		this.enterRecursionRule(localctx, 2, FormulaParser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 30;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 15:
				{
				localctx = new NotExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 14;
				this.match(FormulaParser.NOT);
				this.state = 15;
				this.expression(12);
				}
				break;
			case 27:
				{
				localctx = new FunctionExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 16;
				this.functionCall();
				}
				break;
			case 18:
				{
				localctx = new VariableExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 17;
				this.variable();
				}
				break;
			case 28:
				{
				localctx = new NumberExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 18;
				this.match(FormulaParser.NUMBER);
				}
				break;
			case 29:
				{
				localctx = new StringExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 19;
				this.match(FormulaParser.STRING);
				}
				break;
			case 30:
				{
				localctx = new TrueExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 20;
				this.match(FormulaParser.TRUE);
				}
				break;
			case 31:
				{
				localctx = new FalseExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 21;
				this.match(FormulaParser.FALSE);
				}
				break;
			case 32:
				{
				localctx = new NullExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 22;
				this.match(FormulaParser.NULL);
				}
				break;
			case 33:
				{
				localctx = new DateExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 23;
				this.match(FormulaParser.DATE);
				}
				break;
			case 34:
				{
				localctx = new TimeExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 24;
				this.match(FormulaParser.TIME);
				}
				break;
			case 35:
				{
				localctx = new DateTimeExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 25;
				this.match(FormulaParser.DATETIME);
				}
				break;
			case 16:
				{
				localctx = new ParenExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
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
			this._ctx.stop = this._input.LT(-1);
			this.state = 52;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 50;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 1, this._ctx) ) {
					case 1:
						{
						localctx = new MulDivModExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, FormulaParser.RULE_expression);
						this.state = 32;
						if (!(this.precpred(this._ctx, 18))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 18)");
						}
						this.state = 33;
						(localctx as MulDivModExprContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 56) !== 0))) {
						    (localctx as MulDivModExprContext)._op = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 34;
						this.expression(19);
						}
						break;
					case 2:
						{
						localctx = new AddSubExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, FormulaParser.RULE_expression);
						this.state = 35;
						if (!(this.precpred(this._ctx, 17))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 17)");
						}
						this.state = 36;
						(localctx as AddSubExprContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if(!(_la===1 || _la===2)) {
						    (localctx as AddSubExprContext)._op = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 37;
						this.expression(18);
						}
						break;
					case 3:
						{
						localctx = new PowerExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, FormulaParser.RULE_expression);
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
						localctx = new ComparisonExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, FormulaParser.RULE_expression);
						this.state = 41;
						if (!(this.precpred(this._ctx, 15))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 15)");
						}
						this.state = 42;
						(localctx as ComparisonExprContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 8064) !== 0))) {
						    (localctx as ComparisonExprContext)._op = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 43;
						this.expression(16);
						}
						break;
					case 5:
						{
						localctx = new AndExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, FormulaParser.RULE_expression);
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
						localctx = new OrExprContext(this, new ExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, FormulaParser.RULE_expression);
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
				_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionCall(): FunctionCallContext {
		let localctx: FunctionCallContext = new FunctionCallContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, FormulaParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 55;
			this.match(FormulaParser.IDENTIFIER);
			this.state = 56;
			this.match(FormulaParser.LPAREN);
			this.state = 58;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 15)) & ~0x1F) === 0 && ((1 << (_la - 15)) & 2093067) !== 0)) {
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
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public argumentList(): ArgumentListContext {
		let localctx: ArgumentListContext = new ArgumentListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, FormulaParser.RULE_argumentList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 62;
			this.expression(0);
			this.state = 67;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===22) {
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
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variable(): VariableContext {
		let localctx: VariableContext = new VariableContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, FormulaParser.RULE_variable);
		try {
			this.enterOuterAlt(localctx, 1);
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
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 1:
			return this.expression_sempred(localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(localctx: ExpressionContext, predIndex: number): boolean {
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

	public static readonly _serializedATN: number[] = [4,1,38,77,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,31,8,1,1,1,1,1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,51,8,1,10,1,12,1,
	54,9,1,1,2,1,2,1,2,3,2,59,8,2,1,2,1,2,1,3,1,3,1,3,5,3,66,8,3,10,3,12,3,
	69,9,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,0,1,2,5,0,2,4,6,8,0,3,1,0,3,5,1,0,1,
	2,1,0,7,12,90,0,10,1,0,0,0,2,30,1,0,0,0,4,55,1,0,0,0,6,62,1,0,0,0,8,70,
	1,0,0,0,10,11,3,2,1,0,11,12,5,0,0,1,12,1,1,0,0,0,13,14,6,1,-1,0,14,15,5,
	15,0,0,15,31,3,2,1,12,16,31,3,4,2,0,17,31,3,8,4,0,18,31,5,28,0,0,19,31,
	5,29,0,0,20,31,5,30,0,0,21,31,5,31,0,0,22,31,5,32,0,0,23,31,5,33,0,0,24,
	31,5,34,0,0,25,31,5,35,0,0,26,27,5,16,0,0,27,28,3,2,1,0,28,29,5,17,0,0,
	29,31,1,0,0,0,30,13,1,0,0,0,30,16,1,0,0,0,30,17,1,0,0,0,30,18,1,0,0,0,30,
	19,1,0,0,0,30,20,1,0,0,0,30,21,1,0,0,0,30,22,1,0,0,0,30,23,1,0,0,0,30,24,
	1,0,0,0,30,25,1,0,0,0,30,26,1,0,0,0,31,52,1,0,0,0,32,33,10,18,0,0,33,34,
	7,0,0,0,34,51,3,2,1,19,35,36,10,17,0,0,36,37,7,1,0,0,37,51,3,2,1,18,38,
	39,10,16,0,0,39,40,5,6,0,0,40,51,3,2,1,17,41,42,10,15,0,0,42,43,7,2,0,0,
	43,51,3,2,1,16,44,45,10,14,0,0,45,46,5,13,0,0,46,51,3,2,1,15,47,48,10,13,
	0,0,48,49,5,14,0,0,49,51,3,2,1,14,50,32,1,0,0,0,50,35,1,0,0,0,50,38,1,0,
	0,0,50,41,1,0,0,0,50,44,1,0,0,0,50,47,1,0,0,0,51,54,1,0,0,0,52,50,1,0,0,
	0,52,53,1,0,0,0,53,3,1,0,0,0,54,52,1,0,0,0,55,56,5,27,0,0,56,58,5,16,0,
	0,57,59,3,6,3,0,58,57,1,0,0,0,58,59,1,0,0,0,59,60,1,0,0,0,60,61,5,17,0,
	0,61,5,1,0,0,0,62,67,3,2,1,0,63,64,5,22,0,0,64,66,3,2,1,0,65,63,1,0,0,0,
	66,69,1,0,0,0,67,65,1,0,0,0,67,68,1,0,0,0,68,7,1,0,0,0,69,67,1,0,0,0,70,
	71,5,18,0,0,71,72,5,18,0,0,72,73,5,27,0,0,73,74,5,19,0,0,74,75,5,19,0,0,
	75,9,1,0,0,0,5,30,50,52,58,67];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!FormulaParser.__ATN) {
			FormulaParser.__ATN = new ATNDeserializer().deserialize(FormulaParser._serializedATN);
		}

		return FormulaParser.__ATN;
	}


	static DecisionsToDFA = FormulaParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class FormulaContext extends ParserRuleContext {
	constructor(parser?: FormulaParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public EOF(): TerminalNode {
		return this.getToken(FormulaParser.EOF, 0);
	}
    public get ruleIndex(): number {
    	return FormulaParser.RULE_formula;
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
	constructor(parser?: FormulaParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return FormulaParser.RULE_expression;
	}
	public override copyFrom(ctx: ExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class AndExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public AND(): TerminalNode {
		return this.getToken(FormulaParser.AND, 0);
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
export class StringExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public STRING(): TerminalNode {
		return this.getToken(FormulaParser.STRING, 0);
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
export class FunctionExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public functionCall(): FunctionCallContext {
		return this.getTypedRuleContext(FunctionCallContext, 0) as FunctionCallContext;
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
export class TrueExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public TRUE(): TerminalNode {
		return this.getToken(FormulaParser.TRUE, 0);
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
export class TimeExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public TIME(): TerminalNode {
		return this.getToken(FormulaParser.TIME, 0);
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
export class ComparisonExprContext extends ExpressionContext {
	public _op!: Token;
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public EQUAL(): TerminalNode {
		return this.getToken(FormulaParser.EQUAL, 0);
	}
	public NOT_EQUAL(): TerminalNode {
		return this.getToken(FormulaParser.NOT_EQUAL, 0);
	}
	public LESS(): TerminalNode {
		return this.getToken(FormulaParser.LESS, 0);
	}
	public LESS_EQUAL(): TerminalNode {
		return this.getToken(FormulaParser.LESS_EQUAL, 0);
	}
	public GREATER(): TerminalNode {
		return this.getToken(FormulaParser.GREATER, 0);
	}
	public GREATER_EQUAL(): TerminalNode {
		return this.getToken(FormulaParser.GREATER_EQUAL, 0);
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
export class DateExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DATE(): TerminalNode {
		return this.getToken(FormulaParser.DATE, 0);
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
export class OrExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public OR(): TerminalNode {
		return this.getToken(FormulaParser.OR, 0);
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
export class FalseExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public FALSE(): TerminalNode {
		return this.getToken(FormulaParser.FALSE, 0);
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
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NULL(): TerminalNode {
		return this.getToken(FormulaParser.NULL, 0);
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
export class DateTimeExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DATETIME(): TerminalNode {
		return this.getToken(FormulaParser.DATETIME, 0);
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
export class PowerExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public POWER(): TerminalNode {
		return this.getToken(FormulaParser.POWER, 0);
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
export class NumberExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(FormulaParser.NUMBER, 0);
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
export class MulDivModExprContext extends ExpressionContext {
	public _op!: Token;
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public MULTIPLY(): TerminalNode {
		return this.getToken(FormulaParser.MULTIPLY, 0);
	}
	public DIVIDE(): TerminalNode {
		return this.getToken(FormulaParser.DIVIDE, 0);
	}
	public MODULO(): TerminalNode {
		return this.getToken(FormulaParser.MODULO, 0);
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
export class VariableExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public variable(): VariableContext {
		return this.getTypedRuleContext(VariableContext, 0) as VariableContext;
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
export class NotExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NOT(): TerminalNode {
		return this.getToken(FormulaParser.NOT, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
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
export class ParenExprContext extends ExpressionContext {
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(FormulaParser.LPAREN, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(FormulaParser.RPAREN, 0);
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
export class AddSubExprContext extends ExpressionContext {
	public _op!: Token;
	constructor(parser: FormulaParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public ADD(): TerminalNode {
		return this.getToken(FormulaParser.ADD, 0);
	}
	public SUBTRACT(): TerminalNode {
		return this.getToken(FormulaParser.SUBTRACT, 0);
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


export class FunctionCallContext extends ParserRuleContext {
	constructor(parser?: FormulaParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(FormulaParser.IDENTIFIER, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(FormulaParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(FormulaParser.RPAREN, 0);
	}
	public argumentList(): ArgumentListContext {
		return this.getTypedRuleContext(ArgumentListContext, 0) as ArgumentListContext;
	}
    public get ruleIndex(): number {
    	return FormulaParser.RULE_functionCall;
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
	constructor(parser?: FormulaParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(FormulaParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(FormulaParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return FormulaParser.RULE_argumentList;
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
	constructor(parser?: FormulaParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LBRACE_list(): TerminalNode[] {
	    	return this.getTokens(FormulaParser.LBRACE);
	}
	public LBRACE(i: number): TerminalNode {
		return this.getToken(FormulaParser.LBRACE, i);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(FormulaParser.IDENTIFIER, 0);
	}
	public RBRACE_list(): TerminalNode[] {
	    	return this.getTokens(FormulaParser.RBRACE);
	}
	public RBRACE(i: number): TerminalNode {
		return this.getToken(FormulaParser.RBRACE, i);
	}
    public get ruleIndex(): number {
    	return FormulaParser.RULE_variable;
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
