import {joinPdfs} from "./pdfBuilder";
import {getPageDom, getScheduleLinks} from "./aquarelaksPage";
import {AQUARELAKS_URL, getProxiedUrl} from "./urls";
import {renderPdf} from "./pdfViewer";
import {ProgressInfo} from "./progressInfo";
import {getTodayDate} from "./utils";

async function start(progress: ProgressInfo) {
    progress.addMessage("Requesting page...")
    const dom = await getPageDom(getProxiedUrl(AQUARELAKS_URL))

    progress.addMessage("Parsing links...")
    const links = await getScheduleLinks(dom, getTodayDate())
    if (links.relevant.length === 0) {
        throw new Error(`Error: no relevant schedule files found (total: ${links.totalCount})`)
    }
    if (links.relevant.length === 1) {
        progress.addMessage(`1 relevant link found out of ${links.totalCount}, rendering...`)
        return renderPdf(getProxiedUrl(links.relevant[0].url), document.body, () => progress.detach())
    }
    progress.addMessage(
        `${links.relevant.length} relevant links found out of ${links.totalCount}, downloading and joining...`)
    const pdf = await joinPdfs(links.relevant.map(link => link.url))

    progress.addMessage(`Rendering joined pdf...`)
    return renderPdf(pdf, document.body, () => progress.detach())
}

const progress = ProgressInfo.attach(document.body)
start(progress).catch(err => {
    progress.addError(err)
    progress.addLink("original page", AQUARELAKS_URL)
})
