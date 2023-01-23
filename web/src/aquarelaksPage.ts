import moment from "moment";
import {AQUARELAKS_URL, getProxiedUrl} from "./urls";

const SCHEDULE_FOLD_NODE_SUBSTR = "GRAFIK DOSTĘPNOŚCI"
const DATE_FORMAT = 'DD-MM-YYYY'

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

export async function getScheduleLinks(after: Date = new Date()): Promise<ScheduleLink[]>  {
    const dom = await getPageDom(getProxiedUrl(AQUARELAKS_URL))
    return sortScheduleLinks(
        extractScheduleLinks(dom)
            .map(link => {
                const parsedText = parseScheduleLinkText(link.text)
                return {
                   url: link.url,
                   fromDate: parsedText.fromDate,
                   toDate: parsedText.toDate
                }
            })
            .filter(link => isRelevantLink(link, after))
    )
}

export function isRelevantLink(link: ParsedScheduleLinkText, startingFrom: Date): boolean {
    return !(link.toDate !== null && link.toDate < startingFrom);
}

export function sortScheduleLinks<T extends ParsedScheduleLinkText>(links: T[]): T[] {
    const res = Array.from(links)
    res.sort((a, b) => {
        if (a.fromDate) {
            if (b.fromDate) {
                return a.fromDate.getTime() - b.fromDate.getTime()
            }
            if (b.toDate) {
                return 1
            }
        }
        if (a.toDate) {
            if (b.fromDate) {
                return -1
            }
            if (b.toDate) {
                return a.toDate.getTime() - b.toDate.getTime()
            }
        }
        return 0
    })
    return res
}

export function parseScheduleLinkText(text: string): ParsedScheduleLinkText {
    const shortText = text.replace("Grafik dostępności torów oraz niecki basenowej", "").trim()

    let dateRegexp = '\\d{1,2}\\.\\d{1,2}\\.\\d{4}'
    const dateRangeRegexp = new RegExp(`(${dateRegexp})\\s*[\\-–]\\s*(${dateRegexp})`)
    const dateFromRegexp = new RegExp(`(od|po|z).*?(${dateRegexp})`)
    const dateToRegexp = new RegExp(`(do|przed).*?(${dateRegexp})`)

    let cases: [RegExp, (r: RegExpExecArray) => {from: string|null, to: string|null}][] = [
        [dateRangeRegexp, regexpRes => ({from: regexpRes[1], to: regexpRes[2]})],
        [dateFromRegexp, regexpRes => ({from: regexpRes[2], to: null})],
        [dateToRegexp, regexpRes => ({from: null, to: regexpRes[2]})]
    ]

    let parsed: ParsedScheduleLinkText|null = null
    for (let reCase of cases) {
        const casRes = reCase[0].exec(shortText)
        if (casRes) {
            const extracted = reCase[1](casRes)

            parsed = {
                fromDate: extracted.from ? moment(extracted.from, DATE_FORMAT).toDate() : null,
                toDate: extracted.to ? moment(extracted.to, DATE_FORMAT).toDate() : null
            }
            break
        }
    }
    if (!parsed) {
        throw new Error("Can't parse link text: " + text)
    }

    return parsed
}

export function extractScheduleLinks(dom: Document): RawScheduleLink[] {
    const toggleDivs = dom.querySelectorAll("div.elementor-toggle-item");
    const scheduleToggleDiv = findNode(toggleDivs,
        node => !!node
            .querySelector("a.elementor-toggle-title")
            ?.textContent?.includes(SCHEDULE_FOLD_NODE_SUBSTR)
    )
    if (scheduleToggleDiv === null) {
        throw new Error(`Toggle with ${SCHEDULE_FOLD_NODE_SUBSTR} not found`)
    }
    const linkElements = scheduleToggleDiv.querySelector("div.elementor-tab-content")?.querySelectorAll("a")
    if (!linkElements) {
        throw new Error("Links not found")
    }

    const res = Array<RawScheduleLink>()
    for (let linkElement of linkElements) {
        const text = linkElement.textContent
        const url = linkElement.getAttribute('href')
        if (text && url) {
            res.push({text, url})
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

function findNode(nodes: NodeListOf<Element>, clb: (el: Element) => boolean): Element|null {
    for (let i = 0; i < nodes.length; ++i) {
        const node = nodes.item(i)
        if (clb(node)) {
            return node
        }
    }
    return null
}