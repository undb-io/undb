// Generated from src/grammar/FormulaLexer.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { CharStream } from "antlr4ts/CharStream";
import { Lexer } from "antlr4ts/Lexer";
import { LexerATNSimulator } from "antlr4ts/atn/LexerATNSimulator";
import { NotNull } from "antlr4ts/Decorators";
import { Override } from "antlr4ts/Decorators";
import { RuleContext } from "antlr4ts/RuleContext";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";


export class FormulaLexer extends Lexer {
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

	// tslint:disable:no-trailing-whitespace
	public static readonly channelNames: string[] = [
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN",
	];

	// tslint:disable:no-trailing-whitespace
	public static readonly modeNames: string[] = [
		"DEFAULT_MODE",
	];

	public static readonly ruleNames: string[] = [
		"ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "MODULO", "POWER", "EQUAL", "NOT_EQUAL", 
		"LESS", "LESS_EQUAL", "GREATER", "GREATER_EQUAL", "AND", "OR", "NOT", 
		"LPAREN", "RPAREN", "LBRACE", "RBRACE", "LBRACKET", "RBRACKET", "COMMA", 
		"SEMICOLON", "COLON", "DOT", "IDENTIFIER", "NUMBER", "STRING", "TRUE", 
		"FALSE", "NULL", "DATE", "TIME", "DATETIME", "WS", "COMMENT", "MULTILINE_COMMENT", 
		"DIGIT", "LETTER", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", 
		"L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", 
		"Z",
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
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(FormulaLexer._LITERAL_NAMES, FormulaLexer._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return FormulaLexer.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(FormulaLexer._ATN, this);
	}

	// @Override
	public get grammarFileName(): string { return "FormulaLexer.g4"; }

	// @Override
	public get ruleNames(): string[] { return FormulaLexer.ruleNames; }

	// @Override
	public get serializedATN(): string { return FormulaLexer._serializedATN; }

	// @Override
	public get channelNames(): string[] { return FormulaLexer.channelNames; }

	// @Override
	public get modeNames(): string[] { return FormulaLexer.modeNames; }

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\'\u015A\b\x01" +
		"\x04\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06" +
		"\x04\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r" +
		"\t\r\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t" +
		"\x12\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t" +
		"\x17\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t" +
		"\x1C\x04\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t" +
		"\"\x04#\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04" +
		"+\t+\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x04" +
		"4\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04" +
		"=\t=\x04>\t>\x04?\t?\x04@\t@\x04A\tA\x04B\tB\x03\x02\x03\x02\x03\x03\x03" +
		"\x03\x03\x04\x03\x04\x03\x05\x03\x05\x03\x06\x03\x06\x03\x07\x03\x07\x03" +
		"\b\x03\b\x03\t\x03\t\x03\t\x03\n\x03\n\x03\v\x03\v\x03\v\x03\f\x03\f\x03" +
		"\r\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F" +
		"\x03\x10\x03\x10\x03\x10\x03\x10\x03\x11\x03\x11\x03\x12\x03\x12\x03\x13" +
		"\x03\x13\x03\x14\x03\x14\x03\x15\x03\x15\x03\x16\x03\x16\x03\x17\x03\x17" +
		"\x03\x18\x03\x18\x03\x19\x03\x19\x03\x1A\x03\x1A\x03\x1B\x03\x1B\x03\x1B" +
		"\x07\x1B\xC3\n\x1B\f\x1B\x0E\x1B\xC6\v\x1B\x03\x1C\x06\x1C\xC9\n\x1C\r" +
		"\x1C\x0E\x1C\xCA\x03\x1C\x03\x1C\x06\x1C\xCF\n\x1C\r\x1C\x0E\x1C\xD0\x05" +
		"\x1C\xD3\n\x1C\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x07\x1D\xD9\n\x1D\f\x1D" +
		"\x0E\x1D\xDC\v\x1D\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x03" +
		"\x1E\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03 \x03 \x03 \x03" +
		" \x03 \x03!\x03!\x03!\x03!\x03!\x03\"\x03\"\x03\"\x03\"\x03\"\x03#\x03" +
		"#\x03#\x03#\x03#\x03#\x03#\x03#\x03#\x03$\x06$\u0104\n$\r$\x0E$\u0105" +
		"\x03$\x03$\x03%\x03%\x03%\x03%\x07%\u010E\n%\f%\x0E%\u0111\v%\x03%\x03" +
		"%\x03&\x03&\x03&\x03&\x07&\u0119\n&\f&\x0E&\u011C\v&\x03&\x03&\x03&\x03" +
		"&\x03&\x03\'\x03\'\x03(\x03(\x03)\x03)\x03*\x03*\x03+\x03+\x03,\x03,\x03" +
		"-\x03-\x03.\x03.\x03/\x03/\x030\x030\x031\x031\x032\x032\x033\x033\x03" +
		"4\x034\x035\x035\x036\x036\x037\x037\x038\x038\x039\x039\x03:\x03:\x03" +
		";\x03;\x03<\x03<\x03=\x03=\x03>\x03>\x03?\x03?\x03@\x03@\x03A\x03A\x03" +
		"B\x03B\x03\u011A\x02\x02C\x03\x02\x03\x05\x02\x04\x07\x02\x05\t\x02\x06" +
		"\v\x02\x07\r\x02\b\x0F\x02\t\x11\x02\n\x13\x02\v\x15\x02\f\x17\x02\r\x19" +
		"\x02\x0E\x1B\x02\x0F\x1D\x02\x10\x1F\x02\x11!\x02\x12#\x02\x13%\x02\x14" +
		"\'\x02\x15)\x02\x16+\x02\x17-\x02\x18/\x02\x191\x02\x1A3\x02\x1B5\x02" +
		"\x1C7\x02\x1D9\x02\x1E;\x02\x1F=\x02 ?\x02!A\x02\"C\x02#E\x02$G\x02%I" +
		"\x02&K\x02\'M\x02\x02O\x02\x02Q\x02\x02S\x02\x02U\x02\x02W\x02\x02Y\x02" +
		"\x02[\x02\x02]\x02\x02_\x02\x02a\x02\x02c\x02\x02e\x02\x02g\x02\x02i\x02" +
		"\x02k\x02\x02m\x02\x02o\x02\x02q\x02\x02s\x02\x02u\x02\x02w\x02\x02y\x02" +
		"\x02{\x02\x02}\x02\x02\x7F\x02\x02\x81\x02\x02\x83\x02\x02\x03\x02!\x03" +
		"\x02))\x05\x02\v\f\x0F\x0F\"\"\x04\x02\f\f\x0F\x0F\x03\x022;\x04\x02C" +
		"\\c|\x04\x02CCcc\x04\x02DDdd\x04\x02EEee\x04\x02FFff\x04\x02GGgg\x04\x02" +
		"HHhh\x04\x02IIii\x04\x02JJjj\x04\x02KKkk\x04\x02LLll\x04\x02MMmm\x04\x02" +
		"NNnn\x04\x02OOoo\x04\x02PPpp\x04\x02QQqq\x04\x02RRrr\x04\x02SSss\x04\x02" +
		"TTtt\x04\x02UUuu\x04\x02VVvv\x04\x02WWww\x04\x02XXxx\x04\x02YYyy\x04\x02" +
		"ZZzz\x04\x02[[{{\x04\x02\\\\||\x02\u0147\x02\x03\x03\x02\x02\x02\x02\x05" +
		"\x03\x02\x02\x02\x02\x07\x03\x02\x02\x02\x02\t\x03\x02\x02\x02\x02\v\x03" +
		"\x02\x02\x02\x02\r\x03\x02\x02\x02\x02\x0F\x03\x02\x02\x02\x02\x11\x03" +
		"\x02\x02\x02\x02\x13\x03\x02\x02\x02\x02\x15\x03\x02\x02\x02\x02\x17\x03" +
		"\x02\x02\x02\x02\x19\x03\x02\x02\x02\x02\x1B\x03\x02\x02\x02\x02\x1D\x03" +
		"\x02\x02\x02\x02\x1F\x03\x02\x02\x02\x02!\x03\x02\x02\x02\x02#\x03\x02" +
		"\x02\x02\x02%\x03\x02\x02\x02\x02\'\x03\x02\x02\x02\x02)\x03\x02\x02\x02" +
		"\x02+\x03\x02\x02\x02\x02-\x03\x02\x02\x02\x02/\x03\x02\x02\x02\x021\x03" +
		"\x02\x02\x02\x023\x03\x02\x02\x02\x025\x03\x02\x02\x02\x027\x03\x02\x02" +
		"\x02\x029\x03\x02\x02\x02\x02;\x03\x02\x02\x02\x02=\x03\x02\x02\x02\x02" +
		"?\x03\x02\x02\x02\x02A\x03\x02\x02\x02\x02C\x03\x02\x02\x02\x02E\x03\x02" +
		"\x02\x02\x02G\x03\x02\x02\x02\x02I\x03\x02\x02\x02\x02K\x03\x02\x02\x02" +
		"\x03\x85\x03\x02\x02\x02\x05\x87\x03\x02\x02\x02\x07\x89\x03\x02\x02\x02" +
		"\t\x8B\x03\x02\x02\x02\v\x8D\x03\x02\x02\x02\r\x8F\x03\x02\x02\x02\x0F" +
		"\x91\x03\x02\x02\x02\x11\x93\x03\x02\x02\x02\x13\x96\x03\x02\x02\x02\x15" +
		"\x98\x03\x02\x02\x02\x17\x9B\x03\x02\x02\x02\x19\x9D\x03\x02\x02\x02\x1B" +
		"\xA0\x03\x02\x02\x02\x1D\xA4\x03\x02\x02\x02\x1F\xA7\x03\x02\x02\x02!" +
		"\xAB\x03\x02\x02\x02#\xAD\x03\x02\x02\x02%\xAF\x03\x02\x02\x02\'\xB1\x03" +
		"\x02\x02\x02)\xB3\x03\x02\x02\x02+\xB5\x03\x02\x02\x02-\xB7\x03\x02\x02" +
		"\x02/\xB9\x03\x02\x02\x021\xBB\x03\x02\x02\x023\xBD\x03\x02\x02\x025\xBF" +
		"\x03\x02\x02\x027\xC8\x03\x02\x02\x029\xD4\x03\x02\x02\x02;\xDF\x03\x02" +
		"\x02\x02=\xE4\x03\x02\x02\x02?\xEA\x03\x02\x02\x02A\xEF\x03\x02\x02\x02" +
		"C\xF4\x03\x02\x02\x02E\xF9\x03\x02\x02\x02G\u0103\x03\x02\x02\x02I\u0109" +
		"\x03\x02\x02\x02K\u0114\x03\x02\x02\x02M\u0122\x03\x02\x02\x02O\u0124" +
		"\x03\x02\x02\x02Q\u0126\x03\x02\x02\x02S\u0128\x03\x02\x02\x02U\u012A" +
		"\x03\x02\x02\x02W\u012C\x03\x02\x02\x02Y\u012E\x03\x02\x02\x02[\u0130" +
		"\x03\x02\x02\x02]\u0132\x03\x02\x02\x02_\u0134\x03\x02\x02\x02a\u0136" +
		"\x03\x02\x02\x02c\u0138\x03\x02\x02\x02e\u013A\x03\x02\x02\x02g\u013C" +
		"\x03\x02\x02\x02i\u013E\x03\x02\x02\x02k\u0140\x03\x02\x02\x02m\u0142" +
		"\x03\x02\x02\x02o\u0144\x03\x02\x02\x02q\u0146\x03\x02\x02\x02s\u0148" +
		"\x03\x02\x02\x02u\u014A\x03\x02\x02\x02w\u014C\x03\x02\x02\x02y\u014E" +
		"\x03\x02\x02\x02{\u0150\x03\x02\x02\x02}\u0152\x03\x02\x02\x02\x7F\u0154" +
		"\x03\x02\x02\x02\x81\u0156\x03\x02\x02\x02\x83\u0158\x03\x02\x02\x02\x85" +
		"\x86\x07-\x02\x02\x86\x04\x03\x02\x02\x02\x87\x88\x07/\x02\x02\x88\x06" +
		"\x03\x02\x02\x02\x89\x8A\x07,\x02\x02\x8A\b\x03\x02\x02\x02\x8B\x8C\x07" +
		"1\x02\x02\x8C\n\x03\x02\x02\x02\x8D\x8E\x07\'\x02\x02\x8E\f\x03\x02\x02" +
		"\x02\x8F\x90\x07`\x02\x02\x90\x0E\x03\x02\x02\x02\x91\x92\x07?\x02\x02" +
		"\x92\x10\x03\x02\x02\x02\x93\x94\x07#\x02\x02\x94\x95\x07?\x02\x02\x95" +
		"\x12\x03\x02\x02\x02\x96\x97\x07>\x02\x02\x97\x14\x03\x02\x02\x02\x98" +
		"\x99\x07>\x02\x02\x99\x9A\x07?\x02\x02\x9A\x16\x03\x02\x02\x02\x9B\x9C" +
		"\x07@\x02\x02\x9C\x18\x03\x02\x02\x02\x9D\x9E\x07@\x02\x02\x9E\x9F\x07" +
		"?\x02\x02\x9F\x1A\x03\x02\x02\x02\xA0\xA1\x05Q)\x02\xA1\xA2\x05k6\x02" +
		"\xA2\xA3\x05W,\x02\xA3\x1C\x03\x02\x02\x02\xA4\xA5\x05m7\x02\xA5\xA6\x05" +
		"s:\x02\xA6\x1E\x03\x02\x02\x02\xA7\xA8\x05k6\x02\xA8\xA9\x05m7\x02\xA9" +
		"\xAA\x05w<\x02\xAA \x03\x02\x02\x02\xAB\xAC\x07*\x02\x02\xAC\"\x03\x02" +
		"\x02\x02\xAD\xAE\x07+\x02\x02\xAE$\x03\x02\x02\x02\xAF\xB0\x07}\x02\x02" +
		"\xB0&\x03\x02\x02\x02\xB1\xB2\x07\x7F\x02\x02\xB2(\x03\x02\x02\x02\xB3" +
		"\xB4\x07]\x02\x02\xB4*\x03\x02\x02\x02\xB5\xB6\x07_\x02\x02\xB6,\x03\x02" +
		"\x02\x02\xB7\xB8\x07.\x02\x02\xB8.\x03\x02\x02\x02\xB9\xBA\x07=\x02\x02" +
		"\xBA0\x03\x02\x02\x02\xBB\xBC\x07<\x02\x02\xBC2\x03\x02\x02\x02\xBD\xBE" +
		"\x070\x02\x02\xBE4\x03\x02\x02\x02\xBF\xC4\x05O(\x02\xC0\xC3\x05O(\x02" +
		"\xC1\xC3\x05M\'\x02\xC2\xC0\x03\x02\x02\x02\xC2\xC1\x03\x02\x02\x02\xC3" +
		"\xC6\x03\x02\x02\x02\xC4\xC2\x03\x02\x02\x02\xC4\xC5\x03\x02\x02\x02\xC5" +
		"6\x03\x02\x02\x02\xC6\xC4\x03\x02\x02\x02\xC7\xC9\x05M\'\x02\xC8\xC7\x03" +
		"\x02\x02\x02\xC9\xCA\x03\x02\x02\x02\xCA\xC8\x03\x02\x02\x02\xCA\xCB\x03" +
		"\x02\x02\x02\xCB\xD2\x03\x02\x02\x02\xCC\xCE\x070\x02\x02\xCD\xCF\x05" +
		"M\'\x02\xCE\xCD\x03\x02\x02\x02\xCF\xD0\x03\x02\x02\x02\xD0\xCE\x03\x02" +
		"\x02\x02\xD0\xD1\x03\x02\x02\x02\xD1\xD3\x03\x02\x02\x02\xD2\xCC\x03\x02" +
		"\x02\x02\xD2\xD3\x03\x02\x02\x02\xD38\x03\x02\x02\x02\xD4\xDA\x07)\x02" +
		"\x02\xD5\xD9\n\x02\x02\x02\xD6\xD7\x07)\x02\x02\xD7\xD9\x07)\x02\x02\xD8" +
		"\xD5\x03\x02\x02\x02\xD8\xD6\x03\x02\x02\x02\xD9\xDC\x03\x02\x02\x02\xDA" +
		"\xD8\x03\x02\x02\x02\xDA\xDB\x03\x02\x02\x02\xDB\xDD\x03\x02\x02\x02\xDC" +
		"\xDA\x03\x02\x02\x02\xDD\xDE\x07)\x02\x02\xDE:\x03\x02\x02\x02\xDF\xE0" +
		"\x05w<\x02\xE0\xE1\x05s:\x02\xE1\xE2\x05y=\x02\xE2\xE3\x05Y-\x02\xE3<" +
		"\x03\x02\x02\x02\xE4\xE5\x05[.\x02\xE5\xE6\x05Q)\x02\xE6\xE7\x05g4\x02" +
		"\xE7\xE8\x05u;\x02\xE8\xE9\x05Y-\x02\xE9>\x03\x02\x02\x02\xEA\xEB\x05" +
		"k6\x02\xEB\xEC\x05y=\x02\xEC\xED\x05g4\x02\xED\xEE\x05g4\x02\xEE@\x03" +
		"\x02\x02\x02\xEF\xF0\x05W,\x02\xF0\xF1\x05Q)\x02\xF1\xF2\x05w<\x02\xF2" +
		"\xF3\x05Y-\x02\xF3B\x03\x02\x02\x02\xF4\xF5\x05w<\x02\xF5\xF6\x05a1\x02" +
		"\xF6\xF7\x05i5\x02\xF7\xF8\x05Y-\x02\xF8D\x03\x02\x02\x02\xF9\xFA\x05" +
		"W,\x02\xFA\xFB\x05Q)\x02\xFB\xFC\x05w<\x02\xFC\xFD\x05Y-\x02\xFD\xFE\x05" +
		"w<\x02\xFE\xFF\x05a1\x02\xFF\u0100\x05i5\x02\u0100\u0101\x05Y-\x02\u0101" +
		"F\x03\x02\x02\x02\u0102\u0104\t\x03\x02\x02\u0103\u0102\x03\x02\x02\x02" +
		"\u0104\u0105\x03\x02\x02\x02\u0105\u0103\x03\x02\x02\x02\u0105\u0106\x03" +
		"\x02\x02\x02\u0106\u0107\x03\x02\x02\x02\u0107\u0108\b$\x02\x02\u0108" +
		"H\x03\x02\x02\x02\u0109\u010A\x071\x02\x02\u010A\u010B\x071\x02\x02\u010B" +
		"\u010F\x03\x02\x02\x02\u010C\u010E\n\x04\x02\x02\u010D\u010C\x03\x02\x02" +
		"\x02\u010E\u0111\x03\x02\x02\x02\u010F\u010D\x03\x02\x02\x02\u010F\u0110" +
		"\x03\x02\x02\x02\u0110\u0112\x03\x02\x02\x02\u0111\u010F\x03\x02\x02\x02" +
		"\u0112\u0113\b%\x02\x02\u0113J\x03\x02\x02\x02\u0114\u0115\x071\x02\x02" +
		"\u0115\u0116\x07,\x02\x02\u0116\u011A\x03\x02\x02\x02\u0117\u0119\v\x02" +
		"\x02\x02\u0118\u0117\x03\x02\x02\x02\u0119\u011C\x03\x02\x02\x02\u011A" +
		"\u011B\x03\x02\x02\x02\u011A\u0118\x03\x02\x02\x02\u011B\u011D\x03\x02" +
		"\x02\x02\u011C\u011A\x03\x02\x02\x02\u011D\u011E\x07,\x02\x02\u011E\u011F" +
		"\x071\x02\x02\u011F\u0120\x03\x02\x02\x02\u0120\u0121\b&\x02\x02\u0121" +
		"L\x03\x02\x02\x02\u0122\u0123\t\x05\x02\x02\u0123N\x03\x02\x02\x02\u0124" +
		"\u0125\t\x06\x02\x02\u0125P\x03\x02\x02\x02\u0126\u0127\t\x07\x02\x02" +
		"\u0127R\x03\x02\x02\x02\u0128\u0129\t\b\x02\x02\u0129T\x03\x02\x02\x02" +
		"\u012A\u012B\t\t\x02\x02\u012BV\x03\x02\x02\x02\u012C\u012D\t\n\x02\x02" +
		"\u012DX\x03\x02\x02\x02\u012E\u012F\t\v\x02\x02\u012FZ\x03\x02\x02\x02" +
		"\u0130\u0131\t\f\x02\x02\u0131\\\x03\x02\x02\x02\u0132\u0133\t\r\x02\x02" +
		"\u0133^\x03\x02\x02\x02\u0134\u0135\t\x0E\x02\x02\u0135`\x03\x02\x02\x02" +
		"\u0136\u0137\t\x0F\x02\x02\u0137b\x03\x02\x02\x02\u0138\u0139\t\x10\x02" +
		"\x02\u0139d\x03\x02\x02\x02\u013A\u013B\t\x11\x02\x02\u013Bf\x03\x02\x02" +
		"\x02\u013C\u013D\t\x12\x02\x02\u013Dh\x03\x02\x02\x02\u013E\u013F\t\x13" +
		"\x02\x02\u013Fj\x03\x02\x02\x02\u0140\u0141\t\x14\x02\x02\u0141l\x03\x02" +
		"\x02\x02\u0142\u0143\t\x15\x02\x02\u0143n\x03\x02\x02\x02\u0144\u0145" +
		"\t\x16\x02\x02\u0145p\x03\x02\x02\x02\u0146\u0147\t\x17\x02\x02\u0147" +
		"r\x03\x02\x02\x02\u0148\u0149\t\x18\x02\x02\u0149t\x03\x02\x02\x02\u014A" +
		"\u014B\t\x19\x02\x02\u014Bv\x03\x02\x02\x02\u014C\u014D\t\x1A\x02\x02" +
		"\u014Dx\x03\x02\x02\x02\u014E\u014F\t\x1B\x02\x02\u014Fz\x03\x02\x02\x02" +
		"\u0150\u0151\t\x1C\x02\x02\u0151|\x03\x02\x02\x02\u0152\u0153\t\x1D\x02" +
		"\x02\u0153~\x03\x02\x02\x02\u0154\u0155\t\x1E\x02\x02\u0155\x80\x03\x02" +
		"\x02\x02\u0156\u0157\t\x1F\x02\x02\u0157\x82\x03\x02\x02\x02\u0158\u0159" +
		"\t \x02\x02\u0159\x84\x03\x02\x02\x02\r\x02\xC2\xC4\xCA\xD0\xD2\xD8\xDA" +
		"\u0105\u010F\u011A\x03\b\x02\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!FormulaLexer.__ATN) {
			FormulaLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(FormulaLexer._serializedATN));
		}

		return FormulaLexer.__ATN;
	}

}

