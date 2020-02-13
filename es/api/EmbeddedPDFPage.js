import { __awaiter, __generator } from "tslib";
import PDFDocument from "./PDFDocument";
import { PDFPageEmbedder, PDFRef } from "../core";
import { assertIs } from "../utils";
/**
 * Represents a PDF page that has been embedded in a [[PDFDocument]].
 */
var EmbeddedPDFPage = /** @class */ (function () {
    function EmbeddedPDFPage(ref, doc, embedder) {
        this.alreadyEmbedded = false;
        assertIs(ref, 'ref', [[PDFRef, 'PDFRef']]);
        assertIs(doc, 'doc', [[PDFDocument, 'PDFDocument']]);
        assertIs(embedder, 'embedder', [[PDFPageEmbedder, 'PDFPageEmbedder']]);
        this.ref = ref;
        this.doc = doc;
        this.embedder = embedder;
    }
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all embeddable pages get embedded.
     *
     * Embed this embeddable page in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    EmbeddedPDFPage.prototype.embed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.alreadyEmbedded) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.embedder.embedIntoContext(this.doc.context, this.ref)];
                    case 1:
                        _a.sent();
                        this.alreadyEmbedded = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.embedPng]] and [[PDFDocument.embedJpg]]
     * > methods, which will create instances of [[PDFImage]] for you.
     *
     * Create an instance of [[PDFImage]] from an existing ref and embedder
     *
     * @param ref The unique reference for this image.
     * @param doc The document to which the image will belong.
     * @param embedder The embedder that will be used to embed the image.
     */
    EmbeddedPDFPage.of = function (ref, doc, embedder) {
        return new EmbeddedPDFPage(ref, doc, embedder);
    };
    return EmbeddedPDFPage;
}());
export default EmbeddedPDFPage;
//# sourceMappingURL=EmbeddedPDFPage.js.map