"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var colors_1 = require("./colors");
var operations_1 = require("./operations");
var operators_1 = require("./operators");
var PDFDocument_1 = tslib_1.__importDefault(require("./PDFDocument"));
var PDFFont_1 = tslib_1.__importDefault(require("./PDFFont"));
var PDFImage_1 = tslib_1.__importDefault(require("./PDFImage"));
var rotations_1 = require("./rotations");
var StandardFonts_1 = require("./StandardFonts");
var core_1 = require("../core");
var utils_1 = require("../utils");
var EmbeddedPDFPage_1 = tslib_1.__importDefault(require("./EmbeddedPDFPage"));
/**
 * Represents a single page of a [[PDFDocument]].
 */
var PDFPage = /** @class */ (function () {
    function PDFPage(leafNode, ref, doc) {
        this.fontSize = 24;
        this.fontColor = colors_1.rgb(0, 0, 0);
        this.lineHeight = 24;
        this.x = 0;
        this.y = 0;
        utils_1.assertIs(leafNode, 'leafNode', [[core_1.PDFPageLeaf, 'PDFPageLeaf']]);
        utils_1.assertIs(ref, 'ref', [[core_1.PDFRef, 'PDFRef']]);
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        this.node = leafNode;
        this.ref = ref;
        this.doc = doc;
    }
    /**
     * Rotate this page by a multiple of 90 degrees. For example:
     * ```js
     * import { degrees } from 'pdf-lib'
     *
     * page.setRotation(degrees(-90))
     * page.setRotation(degrees(0))
     * page.setRotation(degrees(90))
     * page.setRotation(degrees(180))
     * page.setRotation(degrees(270))
     * ```
     * @param angle The angle to rotate this page.
     */
    PDFPage.prototype.setRotation = function (angle) {
        var degreesAngle = rotations_1.toDegrees(angle);
        utils_1.assertMultiple(degreesAngle, 'degreesAngle', 90);
        this.node.set(core_1.PDFName.of('Rotate'), this.doc.context.obj(degreesAngle));
    };
    /**
     * Get this page's rotation angle in degrees. For example:
     * ```js
     * const rotationAngle = page.getRotation().angle;
     * ```
     * @returns The rotation angle of the page in degrees (always a multiple of
     *          90 degrees).
     */
    PDFPage.prototype.getRotation = function () {
        var Rotate = this.node.Rotate();
        return rotations_1.degrees(Rotate ? Rotate.value() : 0);
    };
    /**
     * Resize this page by increasing or decreasing its width and height. For
     * example:
     * ```js
     * page.setSize(250, 500)
     * page.setSize(page.getWidth() + 50, page.getHeight() + 100)
     * page.setSize(page.getWidth() - 50, page.getHeight() - 100)
     * ```
     * @param width The new width of the page.
     * @param height The new height of the page.
     */
    PDFPage.prototype.setSize = function (width, height) {
        utils_1.assertIs(width, 'width', ['number']);
        utils_1.assertIs(height, 'height', ['number']);
        var mediaBox = this.node.MediaBox().clone();
        mediaBox.set(2, this.doc.context.obj(width));
        mediaBox.set(3, this.doc.context.obj(height));
        this.node.set(core_1.PDFName.of('MediaBox'), mediaBox);
    };
    /**
     * Resize this page by increasing or decreasing its width. For example:
     * ```js
     * page.setWidth(250)
     * page.setWidth(page.getWidth() + 50)
     * page.setWidth(page.getWidth() - 50)
     * ```
     * @param width The new width of the page.
     */
    PDFPage.prototype.setWidth = function (width) {
        utils_1.assertIs(width, 'width', ['number']);
        this.setSize(width, this.getSize().height);
    };
    /**
     * Resize this page by increasing or decreasing its height. For example:
     * ```js
     * page.setHeight(500)
     * page.setHeight(page.getWidth() + 100)
     * page.setHeight(page.getWidth() - 100)
     * ```
     * @param height The new height of the page.
     */
    PDFPage.prototype.setHeight = function (height) {
        utils_1.assertIs(height, 'height', ['number']);
        this.setSize(this.getSize().width, height);
    };
    /**
     * Get this page's width and height. For example:
     * ```js
     * const { width, height } = page.getSize()
     * ```
     * @returns The width and height of the page.
     */
    PDFPage.prototype.getSize = function () {
        var mediaBox = this.node.MediaBox();
        var width = mediaBox.lookup(2, core_1.PDFNumber).value() -
            mediaBox.lookup(0, core_1.PDFNumber).value();
        var height = mediaBox.lookup(3, core_1.PDFNumber).value() -
            mediaBox.lookup(1, core_1.PDFNumber).value();
        return { width: width, height: height };
    };
    /**
     * Get this page's width. For example:
     * ```js
     * const width = page.getWidth()
     * ```
     * @returns The width of the page.
     */
    PDFPage.prototype.getWidth = function () {
        return this.getSize().width;
    };
    /**
     * Get this page's height. For example:
     * ```js
     * const height = page.getHeight()
     * ```
     * @returns The height of the page.
     */
    PDFPage.prototype.getHeight = function () {
        return this.getSize().height;
    };
    /**
     * Translate this page's content to a new location on the page. This operation
     * is often useful after resizing the page with [[setSize]]. For example:
     * ```js
     * // Add 50 units of whitespace to the top and right of the page
     * page.setSize(page.getWidth() + 50, page.getHeight() + 50)
     *
     * // Move the page's content from the lower-left corner of the page
     * // to the top-right corner.
     * page.translateContent(50, 50)
     *
     * // Now there are 50 units of whitespace to the left and bottom of the page
     * ```
     * See also: [[resetPosition]]
     * @param x The new position on the x-axis for this page's content.
     * @param y The new position on the y-axis for this page's content.
     */
    PDFPage.prototype.translateContent = function (x, y) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        this.node.normalize();
        this.getContentStream();
        var start = this.createContentStream(operators_1.pushGraphicsState(), operators_1.translate(x, y));
        var startRef = this.doc.context.register(start);
        var end = this.createContentStream(operators_1.popGraphicsState());
        var endRef = this.doc.context.register(end);
        this.node.wrapContentStreams(startRef, endRef);
    };
    /**
     * Reset the x and y coordinates of this page to `(0, 0)`. This operation is
     * often useful after calling [[translateContent]]. For example:
     * ```js
     * // Shift the page's contents up and to the right by 50 units
     * page.translateContent(50, 50)
     *
     * // This text will shifted - it will be drawn at (50, 50)
     * page.drawText('I am shifted')
     *
     * // Move back to (0, 0)
     * page.resetPosition()
     *
     * // This text will not be shifted - it will be drawn at (0, 0)
     * page.drawText('I am not shifted')
     * ```
     */
    PDFPage.prototype.resetPosition = function () {
        this.getContentStream(false);
        this.x = 0;
        this.y = 0;
    };
    /**
     * Choose a default font for this page. The default font will be used whenever
     * text is drawn on this page and no font is specified. For example:
     * ```js
     * import { StandardFonts } from 'pdf-lib'
     *
     * const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
     * const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
     *
     * const page = pdfDoc.addPage()
     *
     * page.setFont(helveticaFont)
     * page.drawText('I will be drawn in Helvetica')
     *
     * page.setFont(timesRomanFont)
     * page.drawText('I will be drawn in Courier', { font: courierFont })
     * ```
     * @param font The default font to be used when drawing text on this page.
     */
    PDFPage.prototype.setFont = function (font) {
        // TODO: Reuse image Font name if we've already added this image to Resources.Fonts
        utils_1.assertIs(font, 'font', [[PDFFont_1.default, 'PDFFont']]);
        this.font = font;
        this.fontKey = utils_1.addRandomSuffix(this.font.name);
        this.node.setFontDictionary(core_1.PDFName.of(this.fontKey), this.font.ref);
    };
    /**
     * Choose a default font size for this page. The default font size will be
     * used whenever text is drawn on this page and no font size is specified.
     * For example:
     * ```js
     * page.setFontSize(12)
     * page.drawText('I will be drawn in size 12')
     *
     * page.setFontSize(36)
     * page.drawText('I will be drawn in size 24', { fontSize: 24 })
     * ```
     * @param fontSize The default font size to be used when drawing text on this
     *                 page.
     */
    PDFPage.prototype.setFontSize = function (fontSize) {
        utils_1.assertIs(fontSize, 'fontSize', ['number']);
        this.fontSize = fontSize;
    };
    /**
     * Choose a default font color for this page. The default font color will be
     * used whenever text is drawn on this page and no font color is specified.
     * For example:
     * ```js
     * import { rgb, cmyk, grayscale } from 'pdf-lib'
     *
     * page.setFontColor(rgb(0.97, 0.02, 0.97))
     * page.drawText('I will be drawn in pink')
     *
     * page.setFontColor(cmyk(0.4, 0.7, 0.39, 0.15))
     * page.drawText('I will be drawn in gray', { color: grayscale(0.5) })
     * ```
     * @param fontColor The default font color to be used when drawing text on
     *                  this page.
     */
    PDFPage.prototype.setFontColor = function (fontColor) {
        utils_1.assertIs(fontColor, 'fontColor', [[Object, 'Color']]);
        this.fontColor = fontColor;
    };
    /**
     * Choose a default line height for this page. The default line height will be
     * used whenever text is drawn on this page and no line height is specified.
     * For example:
     * ```js
     * page.setLineHeight(12);
     * page.drawText('These lines will be vertically \n separated by 12 units')
     *
     * page.setLineHeight(36);
     * page.drawText('These lines will be vertically \n separated by 24 units', {
     *   lineHeight: 24
     * })
     * ```
     * @param lineHeight The default line height to be used when drawing text on
     *                   this page.
     */
    PDFPage.prototype.setLineHeight = function (lineHeight) {
        utils_1.assertIs(lineHeight, 'lineHeight', ['number']);
        this.lineHeight = lineHeight;
    };
    /**
     * Get the default position of this page. For example:
     * ```js
     * const { x, y } = page.getPosition()
     * ```
     * @returns The default position of the page.
     */
    PDFPage.prototype.getPosition = function () {
        return { x: this.x, y: this.y };
    };
    /**
     * Get the default x coordinate of this page. For example:
     * ```js
     * const x = page.getX()
     * ```
     * @returns The default x coordinate of the page.
     */
    PDFPage.prototype.getX = function () {
        return this.x;
    };
    /**
     * Get the default y coordinate of this page. For example:
     * ```js
     * const y = page.getY()
     * ```
     * @returns The default y coordinate of the page.
     */
    PDFPage.prototype.getY = function () {
        return this.y;
    };
    /**
     * Change the default position of this page. For example:
     * ```js
     * page.moveTo(0, 0)
     * page.drawText('I will be drawn at the origin')
     *
     * page.moveTo(0, 25)
     * page.drawText('I will be drawn 25 units up')
     *
     * page.moveTo(25, 25)
     * page.drawText('I will be drawn 25 units up and 25 units to the right')
     * ```
     * @param x The new default position on the x-axis for this page.
     * @param y The new default position on the y-axis for this page.
     */
    PDFPage.prototype.moveTo = function (x, y) {
        utils_1.assertIs(x, 'x', ['number']);
        utils_1.assertIs(y, 'y', ['number']);
        this.x = x;
        this.y = y;
    };
    /**
     * Change the default position of this page to be further down the y-axis.
     * For example:
     * ```js
     * page.moveTo(50, 50)
     * page.drawText('I will be drawn at (50, 50)')
     *
     * page.moveDown(10)
     * page.drawText('I will be drawn at (50, 40)')
     * ```
     * @param yDecrease The amount by which the page's default position along the
     *                  y-axis should be decreased.
     */
    PDFPage.prototype.moveDown = function (yDecrease) {
        utils_1.assertIs(yDecrease, 'yDecrease', ['number']);
        this.y -= yDecrease;
    };
    /**
     * Change the default position of this page to be further up the y-axis.
     * For example:
     * ```js
     * page.moveTo(50, 50)
     * page.drawText('I will be drawn at (50, 50)')
     *
     * page.moveUp(10)
     * page.drawText('I will be drawn at (50, 60)')
     * ```
     * @param yIncrease The amount by which the page's default position along the
     *                  y-axis should be increased.
     */
    PDFPage.prototype.moveUp = function (yIncrease) {
        utils_1.assertIs(yIncrease, 'yIncrease', ['number']);
        this.y += yIncrease;
    };
    /**
     * Change the default position of this page to be further left on the x-axis.
     * For example:
     * ```js
     * page.moveTo(50, 50)
     * page.drawText('I will be drawn at (50, 50)')
     *
     * page.moveLeft(10)
     * page.drawText('I will be drawn at (40, 50)')
     * ```
     * @param xDecrease The amount by which the page's default position along the
     *                  x-axis should be decreased.
     */
    PDFPage.prototype.moveLeft = function (xDecrease) {
        utils_1.assertIs(xDecrease, 'xDecrease', ['number']);
        this.x -= xDecrease;
    };
    /**
     * Change the default position of this page to be further right on the y-axis.
     * For example:
     * ```js
     * page.moveTo(50, 50)
     * page.drawText('I will be drawn at (50, 50)')
     *
     * page.moveRight(10)
     * page.drawText('I will be drawn at (60, 50)')
     * ```
     * @param xIncrease The amount by which the page's default position along the
     *                  x-axis should be increased.
     */
    PDFPage.prototype.moveRight = function (xIncrease) {
        utils_1.assertIs(xIncrease, 'xIncrease', ['number']);
        this.x += xIncrease;
    };
    /**
     * Push one or more operators to the end of this page's current content
     * stream. For example:
     * ```js
     * import {
     *   pushGraphicsState,
     *   moveTo,
     *   lineTo,
     *   closePath,
     *   setFillingColor,
     *   rgb,
     *   fill,
     *   popGraphicsState,
     * } from 'pdf-lib'
     *
     * // Draw a green triangle in the lower-left corner of the page
     * page.pushOperators(
     *   pushGraphicsState(),
     *   moveTo(0, 0),
     *   lineTo(100, 0),
     *   lineTo(50, 100),
     *   closePath(),
     *   setFillingColor(rgb(0.0, 1.0, 0.0)),
     *   fill(),
     *   popGraphicsState(),
     * )
     * ```
     * @param operator The operators to be pushed.
     */
    PDFPage.prototype.pushOperators = function () {
        var operator = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operator[_i] = arguments[_i];
        }
        utils_1.assertEachIs(operator, 'operator', [[core_1.PDFOperator, 'PDFOperator']]);
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operator);
    };
    /**
     * Draw one or more lines of text on this page. For example:
     * ```js
     * import { StandardFonts, rgb } from 'pdf-lib'
     *
     * const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
     *
     * const page = pdfDoc.addPage()
     *
     * page.setFont(helveticaFont)
     *
     * page.moveTo(5, 200)
     * page.drawText('The Life of an Egg', { size: 36 })
     *
     * page.moveDown(36)
     * page.drawText('An Epic Tale of Woe', { size: 30 })
     *
     * page.drawText(
     *   `Humpty Dumpty sat on a wall \n` +
     *   `Humpty Dumpty had a great fall; \n` +
     *   `All the king's horses and all the king's men \n` +
     *   `Couldn't put Humpty together again. \n`,
     *   {
     *     x: 25,
     *     y: 100,
     *     font: timesRomanFont,
     *     size: 24,
     *     color: rgb(1, 0, 0),
     *     lineHeight: 24,
     *   },
     * )
     * ```
     * @param text The text to be drawn.
     * @param options The options to be used when drawing the text.
     */
    PDFPage.prototype.drawText = function (text, options) {
        if (options === void 0) { options = {}; }
        utils_1.assertIs(text, 'text', ['string']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertOrUndefined(options.font, 'options.font', [[PDFFont_1.default, 'PDFFont']]);
        utils_1.assertOrUndefined(options.size, 'options.size', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.xSkew, 'options.xSkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.ySkew, 'options.ySkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.lineHeight, 'options.lineHeight', ['number']);
        utils_1.assertOrUndefined(options.maxWidth, 'options.maxWidth', ['number']);
        utils_1.assertOrUndefined(options.wordBreaks, 'options.wordBreaks', [Array]);
        var originalFont = this.getFont()[0];
        if (options.font)
            this.setFont(options.font);
        var _a = this.getFont(), font = _a[0], fontKey = _a[1];
        var fontSize = options.size || this.fontSize;
        var wordBreaks = options.wordBreaks || this.doc.defaultWordBreaks;
        var textWidth = function (t) { return font.widthOfTextAtSize(t, fontSize); };
        var lines = options.maxWidth === undefined
            ? utils_1.cleanText(text).split(/[\r\n\f]/)
            : utils_1.breakTextIntoLines(text, wordBreaks, options.maxWidth, textWidth);
        var encodedLines = new Array(lines.length);
        for (var idx = 0, len = lines.length; idx < len; idx++) {
            encodedLines[idx] = font.encodeText(lines[idx]);
        }
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawLinesOfText(encodedLines, {
            color: options.color || this.fontColor,
            font: fontKey,
            size: fontSize,
            rotate: options.rotate || rotations_1.degrees(0),
            xSkew: options.xSkew || rotations_1.degrees(0),
            ySkew: options.ySkew || rotations_1.degrees(0),
            x: options.x || this.x,
            y: options.y || this.y,
            lineHeight: options.lineHeight || this.lineHeight,
        }));
        if (options.font)
            this.setFont(originalFont);
    };
    /**
     * Draw an image on this page. For example:
     * ```js
     * import { degrees } from 'pdf-lib'
     *
     * const jpgUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg'
     * const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer())
     *
     * const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)
     * const jpgDims = jpgImage.scale(0.5)
     *
     * const page = pdfDoc.addPage()
     *
     * page.drawImage(jpgImage, {
     *   x: 25,
     *   y: 25,
     *   width: jpgDims.width,
     *   height: jpgDims.height,
     *   rotate: degrees(30)
     * })
     * ```
     * @param image The image to be drawn.
     * @param options The options to be used when drawing the image.
     */
    PDFPage.prototype.drawImage = function (image, options) {
        if (options === void 0) { options = {}; }
        // TODO: Reuse image XObject name if we've already added this image to Resources.XObjects
        utils_1.assertIs(image, 'image', [[PDFImage_1.default, 'PDFImage']]);
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.width, 'options.width', ['number']);
        utils_1.assertOrUndefined(options.height, 'options.height', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.xSkew, 'options.xSkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.ySkew, 'options.ySkew', [[Object, 'Rotation']]);
        var xObjectKey = utils_1.addRandomSuffix('Image', 10);
        this.node.setXObject(core_1.PDFName.of(xObjectKey), image.ref);
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawImage(xObjectKey, {
            x: options.x || this.x,
            y: options.y || this.y,
            width: options.width || image.size().width,
            height: options.height || image.size().height,
            rotate: options.rotate || rotations_1.degrees(0),
            xSkew: options.xSkew || rotations_1.degrees(0),
            ySkew: options.ySkew || rotations_1.degrees(0),
        }));
    };
    /**
     * Draw an embedded PDF page on this page. For example:
     * ```js
     * import { degrees } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create();
     * const page = pdfDoc.addPage();
     *
     * const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf';
     * const sourceBuffer = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer());
     * const sourcePdfDoc = await PDFDocument.load(sourceBuffer);
     *
     * // embed page 74 from the PDF
     * const embeddedPage = await pdfDoc.embedPdfDocument(sourcePdfDoc,73);
     *
     * page.drawEmbeddedPdfPage(embeddedPage, {
     *   x: 250,
     *   y: 200,
     *   xScale: 0.5,
     *   yScale: 0.5,
     *   rotate: degrees(30)
     * });
     * ```
     * @param embeddedPdfPage The embeddedPDF page object to be drawn.
     * @param options The options to be used when drawing the pdf page.
     */
    PDFPage.prototype.drawEmbeddedPdfPage = function (embeddedPdfPage, options) {
        if (options === void 0) { options = {}; }
        // TODO: Reuse embeddedPdfPage XObject name if we've already added this embeddedPdfPage to Resources.XObjects
        utils_1.assertIs(embeddedPdfPage, 'embeddedPdfPage', [
            [EmbeddedPDFPage_1.default, 'EmbeddedPDFPage'],
        ]);
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.xScale, 'options.xScale', ['number']);
        utils_1.assertOrUndefined(options.yScale, 'options.yScale', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.xSkew, 'options.xSkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.ySkew, 'options.ySkew', [[Object, 'Rotation']]);
        var xObjectKey = utils_1.addRandomSuffix('EmbeddedPdfPage', 10);
        this.node.setXObject(core_1.PDFName.of(xObjectKey), embeddedPdfPage.ref);
        var contentStream = this.getContentStream();
        contentStream.push.apply(contentStream, operations_1.drawEmbeddedPdfPage(xObjectKey, {
            x: options.x || this.x,
            y: options.y || this.y,
            xScale: options.xScale || 1,
            yScale: options.yScale || 1,
            rotate: options.rotate || rotations_1.degrees(0),
            xSkew: options.xSkew || rotations_1.degrees(0),
            ySkew: options.ySkew || rotations_1.degrees(0),
        }));
    };
    /**
     * Draw an SVG path on this page. For example:
     * ```js
     * import { rgb } from 'pdf-lib'
     *
     * const svgPath = 'M 0,20 L 100,160 Q 130,200 150,120 C 190,-40 200,200 300,150 L 400,90'
     *
     * // Draw path as black line
     * page.drawSvgPath(svgPath, { x: 25, y: 75 })
     *
     * // Change border style
     * page.drawSvgPath(svgPath, {
     *   x: 25,
     *   y: 275,
     *   borderColor: rgb(0.5, 0.5, 0.5),
     *   borderWidth: 2,
     * })
     *
     * // Set fill color
     * page.drawSvgPath(svgPath, {
     * 	 x: 25,
     * 	 y: 475,
     * 	 color: rgb(1.0, 0, 0),
     * })
     *
     * // Draw 50% of original size
     * page.drawSvgPath(svgPath, {
     * 	 x: 25,
     * 	 y: 675,
     * 	 scale: 0.5,
     * })
     * ```
     * @param path The SVG path to be drawn.
     * @param options The options to be used when drawing the SVG path.
     */
    PDFPage.prototype.drawSvgPath = function (path, options) {
        if (options === void 0) { options = {}; }
        utils_1.assertIs(path, 'path', ['string']);
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.scale, 'options.scale', ['number']);
        utils_1.assertOrUndefined(options.borderWidth, 'options.borderWidth', ['number']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertOrUndefined(options.borderColor, 'options.borderColor', [
            [Object, 'Color'],
        ]);
        var contentStream = this.getContentStream();
        if (!('color' in options) && !('borderColor' in options)) {
            options.borderColor = colors_1.rgb(0, 0, 0);
        }
        contentStream.push.apply(contentStream, operations_1.drawSvgPath(path, {
            x: options.x || this.x,
            y: options.y || this.y,
            scale: options.scale,
            color: options.color || undefined,
            borderColor: options.borderColor || undefined,
            borderWidth: options.borderWidth || 0,
        }));
    };
    /**
     * Draw a line on this page. For example:
     * ```js
     * import { rgb } from 'pdf-lib'
     *
     * page.drawLine({
     *   start: { x: 25, y: 75 },
     *   end: { x: 125, y: 175 },
     *   thickness: 2,
     *   color: rgb(0.75, 0.2, 0.2)
     * })
     * ```
     * @param options The options to be used when drawing the line.
     */
    PDFPage.prototype.drawLine = function (options) {
        utils_1.assertIs(options.start, 'options.start', [
            [Object, '{ x: number, y: number }'],
        ]);
        utils_1.assertIs(options.end, 'options.end', [
            [Object, '{ x: number, y: number }'],
        ]);
        utils_1.assertIs(options.start.x, 'options.start.x', ['number']);
        utils_1.assertIs(options.start.y, 'options.start.y', ['number']);
        utils_1.assertIs(options.end.x, 'options.end.x', ['number']);
        utils_1.assertIs(options.end.y, 'options.end.y', ['number']);
        utils_1.assertOrUndefined(options.thickness, 'options.thickness', ['number']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        var contentStream = this.getContentStream();
        if (!('color' in options)) {
            options.color = colors_1.rgb(0, 0, 0);
        }
        contentStream.push.apply(contentStream, operations_1.drawLine({
            start: options.start,
            end: options.end,
            thickness: options.thickness || 1,
            color: options.color || undefined,
        }));
    };
    /**
     * Draw a rectangle on this page. For example:
     * ```js
     * import { degrees, grayscale, rgb } from 'pdf-lib'
     *
     * page.drawRectangle({
     *   x: 25,
     *   y: 75,
     *   width: 250,
     *   height: 75,
     *   rotate: degrees(-15),
     *   borderWidth: 5,
     *   borderColor: grayscale(0.5),
     *   color: rgb(0.75, 0.2, 0.2)
     * })
     * ```
     * @param options The options to be used when drawing the rectangle.
     */
    PDFPage.prototype.drawRectangle = function (options) {
        if (options === void 0) { options = {}; }
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.width, 'options.width', ['number']);
        utils_1.assertOrUndefined(options.height, 'options.height', ['number']);
        utils_1.assertOrUndefined(options.rotate, 'options.rotate', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.xSkew, 'options.xSkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.ySkew, 'options.ySkew', [[Object, 'Rotation']]);
        utils_1.assertOrUndefined(options.borderWidth, 'options.borderWidth', ['number']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertOrUndefined(options.borderColor, 'options.borderColor', [
            [Object, 'Color'],
        ]);
        var contentStream = this.getContentStream();
        if (!('color' in options) && !('borderColor' in options)) {
            options.color = colors_1.rgb(0, 0, 0);
        }
        contentStream.push.apply(contentStream, operations_1.drawRectangle({
            x: options.x || this.x,
            y: options.y || this.y,
            width: options.width || 150,
            height: options.height || 100,
            rotate: options.rotate || rotations_1.degrees(0),
            xSkew: options.xSkew || rotations_1.degrees(0),
            ySkew: options.ySkew || rotations_1.degrees(0),
            borderWidth: options.borderWidth || 0,
            color: options.color || undefined,
            borderColor: options.borderColor || undefined,
        }));
    };
    /**
     * Draw a square on this page. For example:
     * ```js
     * import { degrees, grayscale, rgb } from 'pdf-lib'
     *
     * page.drawSquare({
     *   x: 25,
     *   y: 75,
     *   size: 100,
     *   rotate: degrees(-15),
     *   borderWidth: 5,
     *   borderColor: grayscale(0.5),
     *   color: rgb(0.75, 0.2, 0.2)
     * })
     * ```
     * @param options The options to be used when drawing the square.
     */
    PDFPage.prototype.drawSquare = function (options) {
        if (options === void 0) { options = {}; }
        var size = options.size;
        utils_1.assertOrUndefined(size, 'size', ['number']);
        this.drawRectangle(tslib_1.__assign(tslib_1.__assign({}, options), { width: size, height: size }));
    };
    /**
     * Draw an ellipse on this page. For example:
     * ```js
     * import { grayscale, rgb } from 'pdf-lib'
     *
     * page.drawEllipse({
     *   x: 200,
     *   y: 75,
     *   xScale: 100,
     *   yScale: 50,
     *   borderWidth: 5,
     *   borderColor: grayscale(0.5),
     *   color: rgb(0.75, 0.2, 0.2)
     * })
     * ```
     * @param options The options to be used when drawing the ellipse.
     */
    PDFPage.prototype.drawEllipse = function (options) {
        if (options === void 0) { options = {}; }
        utils_1.assertOrUndefined(options.x, 'options.x', ['number']);
        utils_1.assertOrUndefined(options.y, 'options.y', ['number']);
        utils_1.assertOrUndefined(options.xScale, 'options.xScale', ['number']);
        utils_1.assertOrUndefined(options.yScale, 'options.yScale', ['number']);
        utils_1.assertOrUndefined(options.color, 'options.color', [[Object, 'Color']]);
        utils_1.assertOrUndefined(options.borderColor, 'options.borderColor', [
            [Object, 'Color'],
        ]);
        utils_1.assertOrUndefined(options.borderWidth, 'options.borderWidth', ['number']);
        var contentStream = this.getContentStream();
        if (!('color' in options) && !('borderColor' in options)) {
            options.color = colors_1.rgb(0, 0, 0);
        }
        contentStream.push.apply(contentStream, operations_1.drawEllipse({
            x: options.x || this.x,
            y: options.y || this.y,
            xScale: options.xScale || 100,
            yScale: options.yScale || 100,
            color: options.color || undefined,
            borderColor: options.borderColor || undefined,
            borderWidth: options.borderWidth || 0,
        }));
    };
    /**
     * Draw a circle on this page. For example:
     * ```js
     * import { grayscale, rgb } from 'pdf-lib'
     *
     * page.drawCircle({
     *   x: 200,
     *   y: 150,
     *   size: 100,
     *   borderWidth: 5,
     *   borderColor: grayscale(0.5),
     *   color: rgb(0.75, 0.2, 0.2)
     * })
     * ```
     * @param options The options to be used when drawing the ellipse.
     */
    PDFPage.prototype.drawCircle = function (options) {
        if (options === void 0) { options = {}; }
        var size = options.size;
        utils_1.assertOrUndefined(size, 'size', ['number']);
        this.drawEllipse(tslib_1.__assign(tslib_1.__assign({}, options), { xScale: size, yScale: size }));
    };
    PDFPage.prototype.getFont = function () {
        if (!this.font || !this.fontKey) {
            var font = this.doc.embedStandardFont(StandardFonts_1.StandardFonts.Helvetica);
            this.setFont(font);
        }
        return [this.font, this.fontKey];
    };
    PDFPage.prototype.getContentStream = function (useExisting) {
        if (useExisting === void 0) { useExisting = true; }
        if (useExisting && this.contentStream)
            return this.contentStream;
        this.contentStream = this.createContentStream();
        this.contentStreamRef = this.doc.context.register(this.contentStream);
        this.node.addContentStream(this.contentStreamRef);
        return this.contentStream;
    };
    PDFPage.prototype.createContentStream = function () {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operators[_i] = arguments[_i];
        }
        var dict = this.doc.context.obj({});
        var contentStream = core_1.PDFContentStream.of(dict, operators);
        return contentStream;
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.addPage]] and [[PDFDocument.insertPage]]
     * > methods, which can create instances of [[PDFPage]] for you.
     *
     * Create an instance of [[PDFPage]] from an existing leaf node.
     *
     * @param leafNode The leaf node to be wrapped.
     * @param ref The unique reference for the page.
     * @param doc The document to which the page will belong.
     */
    PDFPage.of = function (leafNode, ref, doc) {
        return new PDFPage(leafNode, ref, doc);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.addPage]] and [[PDFDocument.insertPage]]
     * > methods, which can create instances of [[PDFPage]] for you.
     *
     * Create an instance of [[PDFPage]].
     *
     * @param doc The document to which the page will belong.
     */
    PDFPage.create = function (doc) {
        utils_1.assertIs(doc, 'doc', [[PDFDocument_1.default, 'PDFDocument']]);
        var dummyRef = core_1.PDFRef.of(-1);
        var pageLeaf = core_1.PDFPageLeaf.withContextAndParent(doc.context, dummyRef);
        var pageRef = doc.context.register(pageLeaf);
        return new PDFPage(pageLeaf, pageRef, doc);
    };
    return PDFPage;
}());
exports.default = PDFPage;
//# sourceMappingURL=PDFPage.js.map