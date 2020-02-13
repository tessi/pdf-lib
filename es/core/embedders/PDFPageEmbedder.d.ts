import PDFPage from "../../api/PDFPage";
import PDFRef from "../objects/PDFRef";
import PDFContext from "../PDFContext";
/**
 * Represents a page bounding box.
 * Usually `left` and `bottom` are 0 and right, top are equal
 * to width, height if you want to clip to the whole page.
 *
 *       y
 *       ^
 *       | +--------+ (width,height)
 *       | |        |
 *       | |  Page  |
 *       | |        |
 *       | |        |
 * (0,0) | +--------+
 *       +----------> x
 */
export interface BoundingBox {
    left: number /** The left of the bounding box */;
    bottom: number /** The bottom of the bounding box */;
    right: number /** The right of the bounding box */;
    top: number /** The top of the bounding box */;
}
/**
 * A transformation matrix according to section `8.3.3 Common Transformations`
 * of the PDF specification (page 117f). To cite from the spec:
 *
 *   * Translations shall be specified as `[1 0 0 1 tx ty]`, where `tx` and `ty` shall
 *     be the distances to translate the origin of the coordinate system in the
 *     horizontal and vertical dimensions, respectively.
 *   * Scaling shall be obtained by `[sx 0 0 sy 0 0]`. This scales the coordinates
 *     so that 1 unit in the horizontal and vertical dimensions of the new
 *     coordinate system is the same size as `sx` and `sy` units, respectively, in
 *     the previous coordinate system.
 *   * Rotations shall be produced by `[cos(q) sin(q) -sin(q) cos(q) 0 0]`, which has
 *     the effect of rotating the coordinate system axes by an angle `q` counter clockwise.
 *   * Skew shall be specified by `[1 tan(a) tan(b) 1 0 0]`,which skews the x-axis by an
 *     angle `a` and the y axis by an angle `b`.
 */
export declare type TransformationMatrix = [number, number, number, number, number, number];
export declare const identityMatrix: TransformationMatrix;
declare class PDFPageEmbedder {
    static for(page: PDFPage, boundingBox?: BoundingBox, transformationMatrix?: TransformationMatrix): Promise<PDFPageEmbedder>;
    readonly boundingBox: BoundingBox;
    readonly transformationMatrix: TransformationMatrix;
    private readonly page;
    private constructor();
    embedIntoContext(context: PDFContext, ref?: PDFRef): Promise<PDFRef>;
    private decodeContents;
    private fullPageBoundingBox;
}
export default PDFPageEmbedder;
//# sourceMappingURL=PDFPageEmbedder.d.ts.map