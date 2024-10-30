lexer grammar FormulaLexer;

// 运算符
ADD: '+';
SUBTRACT: '-';
MULTIPLY: '*';
DIVIDE: '/';
MODULO: '%';
POWER: '^';

// 比较运算符
EQUAL: '=';
NOT_EQUAL: '!=';
LESS: '<';
LESS_EQUAL: '<=';
GREATER: '>';
GREATER_EQUAL: '>=';

// 逻辑运算符
AND: A N D;
OR: O R;
NOT: N O T;

// 括号
LPAREN: '(';
RPAREN: ')';
LBRACE: '{';
RBRACE: '}';
LBRACKET: '[';
RBRACKET: ']';

// 分隔符
COMMA: ',';
SEMICOLON: ';';
COLON: ':';
DOT: '.';

UNDERSCORE: '_';

// 函数名和标识符
IDENTIFIER: LETTER (LETTER | DIGIT | UNDERSCORE)*;

// 数字
NUMBER: DIGIT+ ('.' DIGIT+)?;

// 字符串
STRING: '\'' ( ~'\'' | '\'\'')* '\'';

// 布尔值
TRUE: T R U E;
FALSE: F A L S E;

// 空值
NULL: N U L L;

// 日期时间
DATE: D A T E;
TIME: T I M E;
DATETIME: D A T E T I M E;

// 空白字符
WS: [ \t\r\n]+ -> skip;

// 注释
COMMENT: '//' ~[\r\n]* -> skip;
MULTILINE_COMMENT: '/*' .*? '*/' -> skip;

// Fragments
fragment DIGIT: [0-9];
fragment LETTER: [a-zA-Z];

fragment A: ('A' | 'a');
fragment B: ('B' | 'b');
fragment C: ('C' | 'c');
fragment D: ('D' | 'd');
fragment E: ('E' | 'e');
fragment F: ('F' | 'f');
fragment G: ('G' | 'g');
fragment H: ('H' | 'h');
fragment I: ('I' | 'i');
fragment J: ('J' | 'j');
fragment K: ('K' | 'k');
fragment L: ('L' | 'l');
fragment M: ('M' | 'm');
fragment N: ('N' | 'n');
fragment O: ('O' | 'o');
fragment P: ('P' | 'p');
fragment Q: ('Q' | 'q');
fragment R: ('R' | 'r');
fragment S: ('S' | 's');
fragment T: ('T' | 't');
fragment U: ('U' | 'u');
fragment V: ('V' | 'v');
fragment W: ('W' | 'w');
fragment X: ('X' | 'x');
fragment Y: ('Y' | 'y');
fragment Z: ('Z' | 'z');