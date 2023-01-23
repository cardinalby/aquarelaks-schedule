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
import { getScheduleLinks } from "./aquarelaksPage";
import { getProxiedUrl } from "./urls";
import { renderPdf } from "./pdfViewer";
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const links = yield getScheduleLinks(new Date("01.09.2023"));
        if (links.length === 0) {
            document.body.append("No schedule files found");
            return;
        }
        if (links.length === 1) {
            return renderPdf(getProxiedUrl(links[0].url), document.body);
        }
        const pdf = yield joinPdfs(links.map(link => link.url));
        return renderPdf(pdf, document.body);
    });
}
start().catch(console.error);
//# sourceMappingURL=index.js.map