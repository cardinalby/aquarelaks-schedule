import {PDFDocument} from 'pdf-lib'
import {getProxiedUrl} from "./urls";

export async function joinPdfs(urls: string[]): Promise<Uint8Array> {
    if (urls.length < 2) {
        throw new Error("At leas 2 urls should be provided")
    }

    const pdfs = await Promise.all(urls.map(async url => {
        const resp = await fetch(getProxiedUrl(url))
        return await PDFDocument.load(await resp.arrayBuffer());
    }))

    const resultPdf = pdfs[0]
    for (let i = 1; i < pdfs.length; i++) {
        const pages = await resultPdf.copyPages(pdfs[i], pdfs[i].getPageIndices())
        pages.forEach((page) => {
            resultPdf.addPage(page);
        });
    }

    return await resultPdf.save();
}