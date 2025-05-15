import {getPageDom, getScheduleLinks} from "./aquarelaksPage";
import {getProxiedUrl, getSchedulePageUrl} from "./urls";
import {renderPdf} from "./pdfViewer";
import {ProgressInfo} from "./progressInfo";
import {getTodayDate} from "./utils";
import {joinPdfs} from "./pdfBuilder";

async function startLoading() {
    const pdfsContainer = document.getElementById('pdfs')
    if (!pdfsContainer) {
        throw new Error('PDFs container not found')
    }
    pdfsContainer.innerHTML = ''

    const progressDiv = document.getElementById('progress-info')
    if (!progressDiv) {
        throw new Error("Progress info div not found")
    }
    const progress = new ProgressInfo(progressDiv)

    try {
        const scheduleLinkUrl = getSchedulePageUrl()
        document.getElementById('original-page-link')?.setAttribute('href', scheduleLinkUrl)
        progress.addMessage("Requesting page...")
        const dom = await getPageDom(getProxiedUrl(scheduleLinkUrl))

        progress.addMessage("Parsing links...")
        const links = await getScheduleLinks(dom, getTodayDate())
        if (links.relevant.length === 0) {
            throw new Error(`Error: no relevant schedule files found (total: ${links.totalCount})`)
        }
        if (links.relevant.length === 1) {
            progress.addMessage(`1 relevant link found out of ${links.totalCount}, rendering...`)
            return renderPdf(getProxiedUrl(links.relevant[0].url), pdfsContainer, () => progress.clear())
        }
        progress.addMessage(
            `${links.relevant.length} relevant links found out of ${links.totalCount}, downloading and joining...`)
        const pdf = await joinPdfs(links.relevant.map(link => link.url))

        progress.addMessage(`Rendering joined pdf...`)
        return renderPdf(pdf, pdfsContainer, () => progress.clear())
    } catch (err) {
        progress.addError(String(err))
    }
}

void startLoading()
window.addEventListener('hashchange', startLoading)