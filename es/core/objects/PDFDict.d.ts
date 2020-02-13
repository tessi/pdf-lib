import PDFArray from "./PDFArray";
import PDFBool from "./PDFBool";
import PDFHexString from "./PDFHexString";
import PDFName from "./PDFName";
import PDFNull from "./PDFNull";
import PDFNumber from "./PDFNumber";
import PDFObject from "./PDFObject";
import PDFRef from "./PDFRef";
import PDFStream from "./PDFStream";
import PDFString from "./PDFString";
import PDFContext from "../PDFContext";
export declare type DictMap = Map<PDFName, PDFObject>;
declare class PDFDict extends PDFObject {
    static withContext: (context: PDFContext) => PDFDict;
    static fromMapWithContext: (map: DictMap, context: PDFContext) => PDFDict;
    readonly context: PDFContext;
    private readonly dict;
    protected constructor(map: Map<PDFName, PDFObject>, context: PDFContext);
    entries(): Array<[PDFName, PDFObject]>;
    set(key: PDFName, value: PDFObject): void;
    get(key: PDFName): PDFObject | undefined;
    has(key: PDFName): boolean;
    lookupMaybe(key: PDFName, type: typeof PDFArray): PDFArray | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFBool): PDFBool | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFDict): PDFDict | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFHexString): PDFHexString | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFName): PDFName | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFNull): typeof PDFNull | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFNumber): PDFNumber | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFStream): PDFStream | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFRef): PDFRef | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFString): PDFString | undefined;
    lookup(key: PDFName): PDFObject | undefined;
    lookup(key: PDFName, type: typeof PDFArray): PDFArray;
    lookup(key: PDFName, type: typeof PDFBool): PDFBool;
    lookup(key: PDFName, type: typeof PDFDict): PDFDict;
    lookup(key: PDFName, type: typeof PDFHexString): PDFHexString;
    lookup(key: PDFName, type: typeof PDFName): PDFName;
    lookup(key: PDFName, type: typeof PDFNull): typeof PDFNull;
    lookup(key: PDFName, type: typeof PDFNumber): PDFNumber;
    lookup(key: PDFName, type: typeof PDFStream): PDFStream;
    lookup(key: PDFName, type: typeof PDFRef): PDFRef;
    lookup(key: PDFName, type: typeof PDFString): PDFString;
    delete(key: PDFName): boolean;
    clone(context?: PDFContext): PDFDict;
    toString(): string;
    sizeInBytes(): number;
    copyBytesInto(buffer: Uint8Array, offset: number): number;
}
export default PDFDict;
//# sourceMappingURL=PDFDict.d.ts.map