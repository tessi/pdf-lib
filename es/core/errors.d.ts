import PDFObject from "./objects/PDFObject";
export declare class MethodNotImplementedError extends Error {
    constructor(className: string, methodName: string);
}
export declare class PrivateConstructorError extends Error {
    constructor(className: string);
}
export declare class UnexpectedObjectTypeError extends Error {
    constructor(expected: any | any[], actual: any);
}
export declare class UnsupportedEncodingError extends Error {
    constructor(encoding: string);
}
export declare class ReparseError extends Error {
    constructor(className: string, methodName: string);
}
export declare class MissingCatalogError extends Error {
    constructor(ref?: PDFObject);
}
/***** Parser Errors ******/
export interface Position {
    line: number;
    column: number;
    offset: number;
}
export declare class NumberParsingError extends Error {
    constructor(pos: Position, value: string);
}
export declare class PDFParsingError extends Error {
    constructor(pos: Position, details: string);
}
export declare class NextByteAssertionError extends PDFParsingError {
    constructor(pos: Position, expectedByte: number, actualByte: number);
}
export declare class PDFObjectParsingError extends PDFParsingError {
    constructor(pos: Position, byte: number);
}
export declare class PDFInvalidObjectParsingError extends PDFParsingError {
    constructor(pos: Position);
}
export declare class PDFStreamParsingError extends PDFParsingError {
    constructor(pos: Position);
}
export declare class UnbalancedParenthesisError extends PDFParsingError {
    constructor(pos: Position);
}
export declare class StalledParserError extends PDFParsingError {
    constructor(pos: Position);
}
export declare class MissingPDFHeaderError extends PDFParsingError {
    constructor(pos: Position);
}
export declare class MissingKeywordError extends PDFParsingError {
    constructor(pos: Position, keyword: number[]);
}
//# sourceMappingURL=errors.d.ts.map