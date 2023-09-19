var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPageDom, getScheduleLink } from "./aquarelaksPage";
import { AQUARELAKS_URL, getProxiedUrl } from "./urls";
import { renderPdf } from "./pdfViewer";
import { ProgressInfo } from "./progressInfo";
function start(progress) {
    return __awaiter(this, void 0, void 0, function* () {
        progress.addMessage("Requesting page...");
        const dom = yield getPageDom(getProxiedUrl(AQUARELAKS_URL));
        progress.addMessage("Looking for a link...");
        const link = yield getScheduleLink(dom);
        progress.addMessage(`Found, rendering...`);
        return renderPdf(getProxiedUrl(link), document.body, () => progress.detach());
    });
}
const progress = ProgressInfo.attach(document.body);
start(progress).catch(err => {
    progress.addError(err);
    progress.addLink("original page", AQUARELAKS_URL);
});
//# sourceMappingURL=index.js.map