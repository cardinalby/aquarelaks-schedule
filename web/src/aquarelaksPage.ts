import * as http from "http";
import {AQUARELAKS_LINKS_BASE_URL, AQUARELAKS_URL} from "./urls";

const SCHEDULE_SPAN_TEXT = "Grafik dostępności"

export async function getPageDom(url: string): Promise<Document> {
    const response = await fetch(url)
    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("text/html")) {
        throw new Error(`Unexpected content-type: ${contentType}`)
    }
    return (new DOMParser()).parseFromString(await response.text(), "text/html")
}

export async function getScheduleLink(dom: Document): Promise<string>  {
    const cutTextSpans = dom.querySelectorAll(`span.cut-text`)
    const scheduleLinkSpan = Array.prototype.slice.call(cutTextSpans).filter(function (el) {
        return el.textContent.includes(SCHEDULE_SPAN_TEXT)
    })
    if (!scheduleLinkSpan) {
        throw new Error(`Span with '${SCHEDULE_SPAN_TEXT}' text not found`)
    }
    const closestLink = scheduleLinkSpan[0].closest("a")
    if (!closestLink) {
        throw new Error(`Parent link of '${SCHEDULE_SPAN_TEXT}' span not found`)
    }
    let href = closestLink.getAttribute("href")
    if (!href) {
        throw new Error(`Href attribute of '${SCHEDULE_SPAN_TEXT}' link not found`)
    }
    if (!href.startsWith("http")) {
        href = AQUARELAKS_LINKS_BASE_URL + href
    }
    return href
}