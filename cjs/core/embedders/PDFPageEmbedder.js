"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PDFRawStream_1 = tslib_1.__importDefault(require("../objects/PDFRawStream"));
var PDFStream_1 = tslib_1.__importDefault(require("../objects/PDFStream"));
var PDFObjectCopier_1 = tslib_1.__importDefault(require("../PDFObjectCopier"));
var decode_1 = require("../streams/decode");
var PDFContentStream_1 = tslib_1.__importDefault(require("../structures/PDFContentStream"));
var utils_1 = require("../../utils");
exports.identityMatrix = [1, 0, 0, 1, 0, 0];
var PDFPageEmbedder = /** @class */ (function () {
    function PDFPageEmbedder(page, boundingBox, transformationMatrix) {
        this.page = page;
        this.boundingBox = boundingBox
            ? boundingBox
            : this.fullPageBoundingBox(page);
        this.transformationMatrix = transformationMatrix
            ? transformationMatrix
            : exports.identityMatrix;
    }
    PDFPageEmbedder.for = function (page, boundingBox, transformationMatrix) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new PDFPageEmbedder(page, boundingBox, transformationMatrix)];
            });
        });
    };
    PDFPageEmbedder.prototype.embedIntoContext = function (context, ref) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var copier, copiedPage, _a, Contents, Resources, decodedContents, _b, left, bottom, right, top, xObject;
            return tslib_1.__generator(this, function (_c) {
                copier = PDFObjectCopier_1.default.for(this.page.doc.context, context);
                copiedPage = copier.copy(this.page.node);
                _a = copiedPage.normalizedEntries(), Contents = _a.Contents, Resources = _a.Resources;
                if (!Contents)
                    throw new Error('Missing page.Contents!');
                decodedContents = this.decodeContents(Contents);
                _b = this.boundingBox, left = _b.left, bottom = _b.bottom, right = _b.right, top = _b.top;
                xObject = context.stream(decodedContents, {
                    Type: 'XObject',
                    Subtype: 'Form',
                    FormType: 1,
                    BBox: [left, bottom, right, top],
                    Matrix: this.transformationMatrix,
                    Resources: Resources,
                });
                if (ref) {
                    context.assign(ref, xObject);
                    return [2 /*return*/, ref];
                }
                else {
                    return [2 /*return*/, context.register(xObject)];
                }
                return [2 /*return*/];
            });
        });
    };
    // `contents` is an array of streams which are merged to include them in the XObject.
    // This methods extracts each stream and joins them with a newline character.
    PDFPageEmbedder.prototype.decodeContents = function (contents) {
        var decodedContents = new Array(contents.size());
        for (var idx = 0, len = contents.size(); idx < len; idx++) {
            var stream = contents.lookup(idx, PDFStream_1.default);
            var content = void 0;
            if (stream instanceof PDFRawStream_1.default) {
                content = decode_1.decodePDFRawStream(stream).decode();
            }
            else if (stream instanceof PDFContentStream_1.default) {
                content = stream.getUnencodedContents();
            }
            else {
                throw new Error("Unrecognized stream type: " + stream.constructor.name);
            }
            if (idx === contents.size() - 1) {
                // add a newline to properly separate streams in between two array elements
                decodedContents[idx] = utils_1.mergeIntoTypedArray(content, Uint8Array.from([0xd, 0xa]));
            }
            else {
                decodedContents[idx] = content;
            }
        }
        return utils_1.mergeIntoTypedArray.apply(void 0, decodedContents);
    };
    PDFPageEmbedder.prototype.fullPageBoundingBox = function (page) {
        var _a = page.getSize(), width = _a.width, height = _a.height;
        return {
            left: 0,
            bottom: 0,
            right: width,
            top: height,
        };
    };
    return PDFPageEmbedder;
}());
exports.default = PDFPageEmbedder;
//# sourceMappingURL=PDFPageEmbedder.js.map