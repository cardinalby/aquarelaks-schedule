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
function openPdf(pdf) {
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.location.assign(url);
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const links = yield getScheduleLinks();
        if (links.length === 0) {
            document.body.append("No schedule files found");
            return;
        }
        if (links.length === 1) {
            window.location.assign(links[0].url);
            return;
        }
        const pdf = yield joinPdfs(links.map(link => link.url));
        openPdf(pdf);
    });
}
start().catch(console.error);
//# sourceMappingURL=index.js.map