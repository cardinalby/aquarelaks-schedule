var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { joinPdfs } from "./pdfBuilder";
import { getPageDom, getScheduleLinks } from "./aquarelaksPage";
import { AQUARELAKS_URL, getProxiedUrl } from "./urls";
import { renderPdf } from "./pdfViewer";
import { ProgressInfo } from "./progressInfo";
import { getTodayDate } from "./utils";
function start(progress) {
    return __awaiter(this, void 0, void 0, function* () {
        progress.addMessage("Requesting page...");
        const dom = yield getPageDom(getProxiedUrl(AQUARELAKS_URL));
        progress.addMessage("Parsing links...");
        const links = yield getScheduleLinks(dom, getTodayDate());
        if (links.length === 0) {
            throw new Error("Error: no schedule files found");
        }
        if (links.length === 1) {
            progress.addMessage(`1 link found, rendering...`);
            return renderPdf(getProxiedUrl(links[0].url), document.body, () => progress.detach());
        }
        progress.addMessage(`${links.length} links found, downloading and joining...`);
        const pdf = yield joinPdfs(links.map(link => link.url));
        progress.addMessage(`Rendering joined pdf...`);
        return renderPdf(pdf, document.body, () => progress.detach());
    });
}
const progress = ProgressInfo.attach(document.body);
start(progress).catch(err => progress.addError(err));
//# sourceMappingURL=index.js.map