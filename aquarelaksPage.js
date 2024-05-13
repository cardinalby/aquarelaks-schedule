var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as moment from "moment";
import { AQUARELAKS_LINKS_BASE_URL } from "./urls";
const SCHEDULE_FOLD_NODE_SUBSTR = "GRAFIK DOSTĘPNOŚCI";
const DATE_FORMAT = 'DD-MM-YYYY';
export function getScheduleLinks(dom, after) {
    return __awaiter(this, void 0, void 0, function* () {
        const extractedData = extractScheduleData(dom);
        return {
            relevant: rearrangeScheduleLinks(extractedData.links
                .map(link => {
                const parsedText = parseScheduleLinkText(link.text);
                return {
                    url: link.url,
                    fromDate: parsedText.fromDate,
                    toDate: parsedText.toDate
                };
            }), after),
            totalCount: extractedData.links.length,
            notParsedSections: extractedData.notParsedSections,
        };
    });
}
export function rearrangeScheduleLinks(links, after) {
    let res = sortScheduleLinks(links);
    return deduceLinkRanges(res).filter(link => isRelevantLink(link, after));
}
export function deduceLinkRanges(links) {
    const res = links.map(l => Object.assign({}, l));
    for (let link of res) {
        if (link.fromDate && !link.toDate) {
            let nearestFromDate = undefined;
            for (let l of links) {
                if (l != link && l.fromDate && l.fromDate > link.fromDate &&
                    (!nearestFromDate || (l.fromDate < nearestFromDate))) {
                    nearestFromDate = l.fromDate;
                }
                if (nearestFromDate) {
                    link.toDate = moment(nearestFromDate).subtract(1, 'd').toDate();
                }
            }
        }
        else if (link.toDate && !link.fromDate) {
            let nearestToDate = undefined;
            for (let l of links) {
                if (l != link && l.toDate && l.toDate < link.toDate &&
                    (!nearestToDate || (l.toDate > nearestToDate))) {
                    nearestToDate = l.toDate;
                }
                if (nearestToDate) {
                    link.fromDate = moment(nearestToDate).add(1, 'd').toDate();
                }
            }
        }
    }
    return res;
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
                return a.fromDate.getTime() - b.toDate.getTime();
            }
        }
        if (a.toDate) {
            if (b.fromDate) {
                return a.toDate.getTime() - b.fromDate.getTime();
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
    let dateRegexp = '\\d{1,2}\\.\\d{1,2}\\.\\d{4}';
    const dateRangeRegexp = new RegExp(`(${dateRegexp})\\s*[\\-–]\\s*(${dateRegexp})`);
    const daysRangeRegexp = new RegExp(`(\\d{1,2})\\s*[\\-–]\\s*(\\d{1,2})\\.(\\d{1,2}\\.\\d{4})`);
    const dateFromRegexp = new RegExp(`(od|po|z).*?(${dateRegexp})`);
    const dateToRegexp = new RegExp(`(do|przed).*?(${dateRegexp})`);
    let cases = [
        [dateRangeRegexp, regexpRes => ({ from: regexpRes[1], to: regexpRes[2] })],
        [daysRangeRegexp, regexpRes => ({
                from: regexpRes[1] + '.' + regexpRes[3],
                to: regexpRes[2] + '.' + regexpRes[3]
            })],
        [dateFromRegexp, regexpRes => ({ from: regexpRes[2], to: null })],
        [dateToRegexp, regexpRes => ({ from: null, to: regexpRes[2] })]
    ];
    let parsed = null;
    for (let reCase of cases) {
        const casRes = reCase[0].exec(text);
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
export function extractScheduleData(dom) {
    const accordionCards = dom.querySelectorAll("div.card");
    if (accordionCards.length === null) {
        throw new Error(`Accordion cards not found`);
    }
    const res = {
        links: Array(),
        notParsedSections: Array()
    };
    for (let accordionCard of accordionCards) {
        const buttonElement = accordionCard.querySelector("button.btn");
        if (buttonElement === null) {
            res.notParsedSections.push("<unknown>");
            continue;
        }
        const linkElement = accordionCard.querySelector("a");
        if (linkElement === null) {
            res.notParsedSections.push(buttonElement.textContent || "<unknown>");
            continue;
        }
        const text = buttonElement.textContent;
        let url = linkElement.getAttribute('href');
        if (text && url) {
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = AQUARELAKS_LINKS_BASE_URL + url;
            }
            res.links.push({
                text: text.trim(),
                url: url,
            });
        }
        else {
            res.notParsedSections.push("<unknown>");
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
//# sourceMappingURL=aquarelaksPage.js.map