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
    if (links.length === 0) {
        throw new Error("Error: no schedule files found")
    }
    if (links.length === 1) {
        progress.addMessage(`1 link found, rendering...`)
        return renderPdf(getProxiedUrl(links[0].url), document.body, () => progress.detach())
    }
    progress.addMessage(`${links.length} links found, downloading and joining...`)
    const pdf = await joinPdfs(links.map(link => link.url))

    progress.addMessage(`Rendering joined pdf...`)
    return renderPdf(pdf, document.body, () => progress.detach())
}

const progress = ProgressInfo.attach(document.body)
start(progress).catch(err => progress.addError(err))
