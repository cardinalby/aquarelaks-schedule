var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import moment from "moment";
const SCHEDULE_FOLD_NODE_SUBSTR = "GRAFIK DOSTĘPNOŚCI";
const DATE_FORMAT = 'DD-MM-YYYY';
export function getScheduleLinks(dom, after = new Date()) {
    return __awaiter(this, void 0, void 0, function* () {
        return sortScheduleLinks(extractScheduleLinks(dom)
            .map(link => {
            const parsedText = parseScheduleLinkText(link.text);
            return {
                url: link.url,
                fromDate: parsedText.fromDate,
                toDate: parsedText.toDate
            };
        })
            .filter(link => isRelevantLink(link, after)));
    });
}
export function isRelevantLink(link, startingFrom) {
    return !(link.toDate !== null && link.toDate < startingFrom);
}
export function sortScheduleLinks(links) {
    const res = Array.from(links);
    res.sort((a, b) => {
        if (a.fromDate) {
            if (b.fromDate) {
                return a.fromDate.getTime() - b.fromDate.getTime();
            }
            if (b.toDate) {
                return 1;
            }
        }
        if (a.toDate) {
            if (b.fromDate) {
                return -1;
            }
            if (b.toDate) {
                return a.toDate.getTime() - b.toDate.getTime();
            }
        }
        if (!a.fromDate && !a.toDate && (b.fromDate || b.toDate)) {
            return 1;
        }
        if (!b.fromDate && !b.toDate && (a.fromDate || a.toDate)) {
            return -1;
        }
        return 0;
    });
    return res;
}
export function parseScheduleLinkText(text) {
    const shortText = text.replace("Grafik dostępności torów oraz niecki basenowej", "").trim();
    let dateRegexp = '\\d{1,2}\\.\\d{1,2}\\.\\d{4}';
    const dateRangeRegexp = new RegExp(`(${dateRegexp})\\s*[\\-–]\\s*(${dateRegexp})`);
    const dateFromRegexp = new RegExp(`(od|po|z).*?(${dateRegexp})`);
    const dateToRegexp = new RegExp(`(do|przed).*?(${dateRegexp})`);
    let cases = [
        [dateRangeRegexp, regexpRes => ({ from: regexpRes[1], to: regexpRes[2] })],
        [dateFromRegexp, regexpRes => ({ from: regexpRes[2], to: null })],
        [dateToRegexp, regexpRes => ({ from: null, to: regexpRes[2] })]
    ];
    let parsed = null;
    for (let reCase of cases) {
        const casRes = reCase[0].exec(shortText);
        if (casRes) {
            const extracted = reCase[1](casRes);
            parsed = {
                fromDate: extracted.from ? moment(extracted.from, DATE_FORMAT).toDate() : null,
                toDate: extracted.to ? moment(extracted.to, DATE_FORMAT).toDate() : null
            };
            break;
        }
    }
    return parsed || { fromDate: null, toDate: null };
}
export function extractScheduleLinks(dom) {
    var _a;
    const toggleDivs = dom.querySelectorAll("div.elementor-toggle-item");
    const scheduleToggleDiv = findNode(toggleDivs, node => {
        var _a, _b;
        return !!((_b = (_a = node
            .querySelector("a.elementor-toggle-title")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.includes(SCHEDULE_FOLD_NODE_SUBSTR));
    });
    if (scheduleToggleDiv === null) {
        throw new Error(`Toggle with ${SCHEDULE_FOLD_NODE_SUBSTR} not found`);
    }
    const linkElements = (_a = scheduleToggleDiv.querySelector("div.elementor-tab-content")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("a");
    if (!linkElements) {
        throw new Error("Links not found");
    }
    const res = Array();
    for (let linkElement of linkElements) {
        const text = linkElement.textContent;
        const url = linkElement.getAttribute('href');
        if (text && url) {
            res.push({ text, url });
        }
    }
    return res;
}
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
function findNode(nodes, clb) {
    for (let i = 0; i < nodes.length; ++i) {
        const node = nodes.item(i);
        if (clb(node)) {
            return node;
        }
    }
    return null;
}
//# sourceMappingURL=aquarelaksPage.js.map