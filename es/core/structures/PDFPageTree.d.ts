import PDFArray from "../objects/PDFArray";
import PDFDict, { DictMap } from "../objects/PDFDict";
import PDFNumber from "../objects/PDFNumber";
import PDFRef from "../objects/PDFRef";
import PDFContext from "../PDFContext";
import PDFPageLeaf from "./PDFPageLeaf";
export declare type TreeNode = PDFPageTree | PDFPageLeaf;
declare class PDFPageTree extends PDFDict {
    static withContext: (context: PDFContext, parent?: PDFRef | undefined) => PDFPageTree;
    static fromMapWithContext: (map: DictMap, context: PDFContext) => PDFPageTree;
    Parent(): PDFPageTree | undefined;
    Kids(): PDFArray;
    Count(): PDFNumber;
    pushTreeNode(treeRef: PDFRef): void;
    pushLeafNode(leafRef: PDFRef): void;
    /**
     * Inserts the given ref as a leaf node of this page tree at the specified
     * index (zero-based). Also increments the `Count` of each page tree in the
     * hierarchy to accomodate the new page.
     *
     * Returns the ref of the PDFPageTree node into which `leafRef` was inserted,
     * or `undefined` if it was inserted into the root node (the PDFPageTree upon
     * which the method was first called).
     */
    insertLeafNode(leafRef: PDFRef, index: number): PDFRef | undefined;
    removeLeafNode(index: number): void;
    ascend(visitor: (node: PDFPageTree) => any): void;
    /** Performs a Post-Order traversal of this page tree */
    traverse(visitor: (node: TreeNode, ref: PDFRef) => any): void;
}
export default PDFPageTree;
//# sourceMappingURL=PDFPageTree.d.ts.map