import * as pdfjs from "pdfjs-dist"
import {PDFDocumentProxy} from "pdfjs-dist";

async function renderOnce(doc: PDFDocumentProxy, container: HTMLElement, ) {
    const outputScale = window.devicePixelRatio || 1;

    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i)
        const viewport = page.getViewport({scale: container.clientWidth / page.getViewport({scale: 1}).width})
        const canvas = document.createElement('canvas')
        canvas.style.display = "block";
        const context = canvas.getContext('2d');
        if (context == null) {
            throw new Error("Can't get canvas context")
        }
        canvas.height = Math.floor(viewport.height * outputScale)
        canvas.width = Math.floor(viewport.width * outputScale)
        canvas.style.width = viewport.width + "px";
        canvas.style.height = viewport.height + "px";
        const transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : undefined;
        container.appendChild(canvas)
        await page.render({canvasContext: context, viewport, transform: transform})
    }
}

export async function renderPdf(
    pdfSource: Uint8Array|string,
    container: HTMLElement,
    beforeRender: (() => void)|undefined = undefined
) {
    pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.js"
    const doc = await pdfjs.getDocument(
        typeof pdfSource === 'string'
            ? {url: pdfSource}
            : {data: pdfSource}
    ).promise

    beforeRender && beforeRender()
    const containerDiv = document.createElement('div')
    containerDiv.style.width = '100%'
    container.appendChild(containerDiv)

    new ResizeObserver(async () => {
        containerDiv.innerHTML = ''
        renderOnce(doc, containerDiv)
    }).observe(containerDiv)

    await renderOnce(doc, containerDiv)
}
