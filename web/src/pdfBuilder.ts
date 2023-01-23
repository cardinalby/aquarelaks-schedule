import {PDFDocument} from 'pdf-lib'
import {getProxiedUrl} from "./urls";

const PDF_CONTENT_TYPE = "application/pdf";

export async function joinPdfs(urls: string[]): Promise<Uint8Array> {
    if (urls.length < 2) {
        throw new Error("At leas 2 urls should be provided")
    }

    const pdfs = (await Promise.all(urls
        .map(async url => {
            const resp = await fetch(getProxiedUrl(url))
            const contentType = resp.headers.get('content-type')
            if (contentType === PDF_CONTENT_TYPE) {
                return PDFDocument.load(await resp.arrayBuffer());
            }
            console.error(`Url ${url} returns Content-Type: ${contentType}`)
            return null
        })))
        .filter(pdf => pdf !== null) as PDFDocument[]

    const resultPdf = pdfs[0]
    for (let i = 1; i < pdfs.length; i++) {
        const pages = await resultPdf.copyPages(pdfs[i], pdfs[i].getPageIndices())
        pages.forEach((page) => {
            resultPdf.addPage(page);
        });
    }

    return await resultPdf.save();
}