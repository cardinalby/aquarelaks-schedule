var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PDFDocument } from 'pdf-lib';
import { getProxiedUrl } from "./urls";
const PDF_CONTENT_TYPE = "application/pdf";
export function joinPdfs(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        if (urls.length < 2) {
            throw new Error("At leas 2 urls should be provided");
        }
        const pdfs = (yield Promise.all(urls
            .map((url) => __awaiter(this, void 0, void 0, function* () {
            const resp = yield fetch(getProxiedUrl(url));
            const contentType = resp.headers.get('content-type');
            if (contentType === PDF_CONTENT_TYPE) {
                return PDFDocument.load(yield resp.arrayBuffer());
            }
            console.error(`Url ${url} returns Content-Type: ${contentType}`);
            return null;
        }))))
            .filter(pdf => pdf !== null);
        const resultPdf = pdfs[0];
        for (let i = 1; i < pdfs.length; i++) {
            const pages = yield resultPdf.copyPages(pdfs[i], pdfs[i].getPageIndices());
            pages.forEach((page) => {
                resultPdf.addPage(page);
            });
        }
        return yield resultPdf.save();
    });
}
//# sourceMappingURL=pdfBuilder.js.map