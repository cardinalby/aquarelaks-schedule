import {getPageDom, getScheduleLink} from "./aquarelaksPage";
import {AQUARELAKS_URL, getProxiedUrl} from "./urls";
import {renderPdf} from "./pdfViewer";
import {ProgressInfo} from "./progressInfo";

async function start(progress: ProgressInfo) {
    progress.addMessage("Requesting page...")
    const dom = await getPageDom(getProxiedUrl(AQUARELAKS_URL))

    progress.addMessage("Looking for a link...")
    const link = await getScheduleLink(dom)
    progress.addMessage(`Found, rendering...`)
    return renderPdf(getProxiedUrl(link), document.body, () => progress.detach())
}

const progress = ProgressInfo.attach(document.body)
start(progress).catch(err => {
    progress.addError(err)
    progress.addLink("original page", AQUARELAKS_URL)
})
