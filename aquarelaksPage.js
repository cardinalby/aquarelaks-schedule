var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AQUARELAKS_LINKS_BASE_URL } from "./urls";
const SCHEDULE_SPAN_TEXT = "Grafik dostępności";
export function getPageDom(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const contentType = response.headers.get("content-type");
        if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes("text/html"))) {
            throw new Error(`Unexpected content-type: ${contentType}`);
        }
        return (new DOMParser()).parseFromString(yield response.text(), "text/html");
    });
}
export function getScheduleLink(dom) {
    return __awaiter(this, void 0, void 0, function* () {
        const cutTextSpans = dom.querySelectorAll(`span.cut-text`);
        const scheduleLinkSpan = Array.prototype.slice.call(cutTextSpans).filter(function (el) {
            return el.textContent.includes(SCHEDULE_SPAN_TEXT);
        });
        if (!scheduleLinkSpan) {
            throw new Error(`Span with '${SCHEDULE_SPAN_TEXT}' text not found`);
        }
        const closestLink = scheduleLinkSpan[0].closest("a");
        if (!closestLink) {
            throw new Error(`Parent link of '${SCHEDULE_SPAN_TEXT}' span not found`);
        }
        let href = closestLink.getAttribute("href");
        if (!href) {
            throw new Error(`Href attribute of '${SCHEDULE_SPAN_TEXT}' link not found`);
        }
        if (!href.startsWith("http")) {
            href = AQUARELAKS_LINKS_BASE_URL + href;
        }
        return href;
    });
}
//# sourceMappingURL=aquarelaksPage.js.map