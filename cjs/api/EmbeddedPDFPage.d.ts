import Embeddable from "./Embeddable";
import PDFDocument from "./PDFDocument";
import { PDFPageEmbedder, PDFRef } from "../core";
/**
 * Represents a PDF page that has been embedded in a [[PDFDocument]].
 */
export default class EmbeddedPDFPage implements Embeddable {
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
    static of: (ref: PDFRef, doc: PDFDocument, embedder: PDFPageEmbedder) => EmbeddedPDFPage;
    /** The unique reference assigned to this image within the document. */
    readonly ref: PDFRef;
    /** The document to which this image belongs. */
    readonly doc: PDFDocument;
    private alreadyEmbedded;
    private readonly embedder;
    private constructor();
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all embeddable pages get embedded.
     *
     * Embed this embeddable page in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    embed(): Promise<void>;
}
//# sourceMappingURL=EmbeddedPDFPage.d.ts.map