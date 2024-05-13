import * as moment from "moment";
import {AQUARELAKS_LINKS_BASE_URL} from "./urls";

const SCHEDULE_FOLD_NODE_SUBSTR = "GRAFIK DOSTĘPNOŚCI"
const DATE_FORMAT = 'DD-MM-YYYY'

export interface RawScheduleData {
    links: RawScheduleLink[],
    notParsedSections: string[]
}

export interface RawScheduleLink {
    url: string,
    text: string
}

export interface ParsedScheduleLinkText {
    fromDate: Date|null,
    toDate: Date|null
}

export interface ScheduleLink extends ParsedScheduleLinkText {
    url: string
}

export interface ScheduleLinksInfo {
    relevant: ScheduleLink[],
    notParsedSections: string[],
    totalCount: number
}

export async function getScheduleLinks(dom: Document, after: Date): Promise<ScheduleLinksInfo>  {
    const extractedData = extractScheduleData(dom)

    return {
        relevant: rearrangeScheduleLinks(
            extractedData.links
                .map(link => {
                    const parsedText = parseScheduleLinkText(link.text)
                    return {
                        url: link.url,
                        fromDate: parsedText.fromDate,
                        toDate: parsedText.toDate
                    }
                }),
            after
        ),
        totalCount: extractedData.links.length,
        notParsedSections: extractedData.notParsedSections,
    }
}

export function rearrangeScheduleLinks<T extends ParsedScheduleLinkText>(
    links: T[],
    after: Date
): T[] {
    let res = sortScheduleLinks(links)
    return deduceLinkRanges(res).filter(link => isRelevantLink(link, after))
}

export function deduceLinkRanges<T extends ParsedScheduleLinkText>(links: T[]): T[] {
    const res = links.map(l => Object.assign({}, l))

    for (let link of res) {
        if (link.fromDate && !link.toDate) {
            let nearestFromDate: Date|undefined = undefined
            for (let l of links) {
                if (l != link && l.fromDate && l.fromDate > link.fromDate &&
                    (!nearestFromDate || (l.fromDate < nearestFromDate))
                ) {
                    nearestFromDate = l.fromDate
                }
                if (nearestFromDate) {
                    link.toDate = moment(nearestFromDate).subtract(1, 'd').toDate()
                }
            }
        } else if (link.toDate && !link.fromDate) {
            let nearestToDate: Date|undefined = undefined
            for (let l of links) {
                if (l != link && l.toDate && l.toDate < link.toDate &&
                    (!nearestToDate || (l.toDate > nearestToDate))
                ) {
                    nearestToDate = l.toDate
                }
                if (nearestToDate) {
                    link.fromDate = moment(nearestToDate).add(1, 'd').toDate()
                }
            }
        }
    }
    return res
}

export function isRelevantLink(link: ParsedScheduleLinkText, startingFrom: Date): boolean {
    return !(link.toDate !== null && link.toDate < startingFrom);
}

export function sortScheduleLinks<T extends ParsedScheduleLinkText>(links: T[]): T[] {
    //  > 0     sort a after b
    //  < 0     sort a before b
    const res = Array.from(links)
    res.sort((a, b) => {
        if (a.fromDate) {
            if (b.fromDate) {
                return a.fromDate.getTime() - b.fromDate.getTime()
            }
            if (b.toDate) {
                return a.fromDate.getTime() - b.toDate.getTime()
            }
        }
        if (a.toDate) {
            if (b.fromDate) {
                return a.toDate.getTime() - b.fromDate.getTime()
            }
            if (b.toDate) {
                return a.toDate.getTime() - b.toDate.getTime()
            }
        }
        if (!a.fromDate && !a.toDate && (b.fromDate || b.toDate)) {
            return 1
        }
        if (!b.fromDate && !b.toDate && (a.fromDate || a.toDate)) {
            return -1
        }
        return 0
    })
    return res
}

export function parseScheduleLinkText(text: string): ParsedScheduleLinkText {
    let dateRegexp = '\\d{1,2}\\.\\d{1,2}\\.\\d{4}'
    const dateRangeRegexp = new RegExp(`(${dateRegexp})\\s*[\\-–]\\s*(${dateRegexp})`)
    const daysRangeRegexp = new RegExp(`(\\d{1,2})\\s*[\\-–]\\s*(\\d{1,2})\\.(\\d{1,2}\\.\\d{4})`)
    const dateFromRegexp = new RegExp(`(od|po|z).*?(${dateRegexp})`)
    const dateToRegexp = new RegExp(`(do|przed).*?(${dateRegexp})`)

    let cases: [RegExp, (r: RegExpExecArray) => {from: string|null, to: string|null}][] = [
        [dateRangeRegexp, regexpRes => ({from: regexpRes[1], to: regexpRes[2]})],
        [daysRangeRegexp, regexpRes => ({
            from: regexpRes[1] + '.' + regexpRes[3],
            to: regexpRes[2] + '.' + regexpRes[3]
        })],
        [dateFromRegexp, regexpRes => ({from: regexpRes[2], to: null})],
        [dateToRegexp, regexpRes => ({from: null, to: regexpRes[2]})]
    ]

    let parsed: ParsedScheduleLinkText|null = null
    for (let reCase of cases) {
        const casRes = reCase[0].exec(text)
        if (casRes) {
            const extracted = reCase[1](casRes)

            parsed = {
                fromDate: extracted.from ? moment(extracted.from, DATE_FORMAT).toDate() : null,
                toDate: extracted.to ? moment(extracted.to, DATE_FORMAT).toDate() : null
            }
            break
        }
    }

    return parsed || {fromDate: null, toDate: null}
}

export function extractScheduleData(dom: Document): RawScheduleData {
    const accordionCards = dom.querySelectorAll("div.card")

    if (accordionCards.length === null) {
        throw new Error(`Accordion cards not found`)
    }

    const res = {
        links: Array<RawScheduleLink>(),
        notParsedSections: Array<string>()
    }

    for (let accordionCard of accordionCards) {
        const buttonElement = accordionCard.querySelector("button.btn")
        if (buttonElement === null) {
            res.notParsedSections.push("<unknown>")
            continue
        }
        const linkElement = accordionCard.querySelector("a")
        if (linkElement === null) {
            res.notParsedSections.push(buttonElement.textContent || "<unknown>")
            continue
        }
        const text = buttonElement.textContent
        let url = linkElement.getAttribute('href')

        if (text && url) {
            // noinspection HttpUrlsUsage
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = AQUARELAKS_LINKS_BASE_URL + url
            }
            res.links.push({
                text: text.trim(),
                url: url,
            })
        } else {
            res.notParsedSections.push("<unknown>")
        }
    }
    return res
}

export async function getPageDom(url: string): Promise<Document> {
    const response = await fetch(url)
    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("text/html")) {
        throw new Error(`Unexpected content-type: ${contentType}`)
    }
    return (new DOMParser()).parseFromString(await response.text(), "text/html")
}