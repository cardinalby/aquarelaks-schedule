var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPageDom, getScheduleLinks } from "./aquarelaksPage";
import { AQUARELAKS_URL, getProxiedUrl } from "./urls";
import { renderPdf } from "./pdfViewer";
import { ProgressInfo } from "./progressInfo";
import { getTodayDate } from "./utils";
import { joinPdfs } from "./pdfBuilder";
function start(progress) {
    return __awaiter(this, void 0, void 0, function* () {
        progress.addMessage("Requesting page...");
        const dom = yield getPageDom(getProxiedUrl(AQUARELAKS_URL));
        progress.addMessage("Parsing links...");
        const links = yield getScheduleLinks(dom, getTodayDate());
        if (links.relevant.length === 0) {
            throw new Error(`Error: no relevant schedule files found (total: ${links.totalCount})`);
        }
        if (links.relevant.length === 1) {
            progress.addMessage(`1 relevant link found out of ${links.totalCount}, rendering...`);
            return renderPdf(getProxiedUrl(links.relevant[0].url), document.body, () => progress.detach());
        }
        progress.addMessage(`${links.relevant.length} relevant links found out of ${links.totalCount}, downloading and joining...`);
        const pdf = yield joinPdfs(links.relevant.map(link => link.url));
        progress.addMessage(`Rendering joined pdf...`);
        return renderPdf(pdf, document.body, () => progress.detach());
    });
}
const progress = ProgressInfo.attach(document.body);
start(progress).catch(err => {
    progress.addError(err);
    progress.addLink("original page", AQUARELAKS_URL);
});
//# sourceMappingURL=index.js.map