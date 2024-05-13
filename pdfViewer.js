var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as pdfjs from "pdfjs-dist";
function renderOnce(doc, container) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputScale = window.devicePixelRatio || 1;
        for (let i = 1; i <= doc.numPages; i++) {
            const page = yield doc.getPage(i);
            const viewport = page.getViewport({ scale: container.clientWidth / page.getViewport({ scale: 1 }).width });
            const canvas = document.createElement('canvas');
            canvas.style.display = "block";
            const context = canvas.getContext('2d');
            if (context == null) {
                throw new Error("Can't get canvas context");
            }
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.style.width = viewport.width + "px";
            canvas.style.height = viewport.height + "px";
            const transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : undefined;
            container.appendChild(canvas);
            page.render({ canvasContext: context, viewport, transform: transform });
        }
    });
}
export function renderPdf(pdfSource, container, beforeRender = undefined) {
    return __awaiter(this, void 0, void 0, function* () {
        pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.js";
        const doc = yield pdfjs.getDocument(typeof pdfSource === 'string'
            ? { url: pdfSource }
            : { data: pdfSource }).promise;
        beforeRender && beforeRender();
        const containerDiv = document.createElement('div');
        containerDiv.style.width = '100%';
        container.appendChild(containerDiv);
        new ResizeObserver(() => __awaiter(this, void 0, void 0, function* () {
            containerDiv.innerHTML = '';
            yield renderOnce(doc, containerDiv);
        })).observe(containerDiv);
        yield renderOnce(doc, containerDiv);
    });
}
//# sourceMappingURL=pdfViewer.js.map