import {joinPdfs} from "./pdfBuilder";
import {getScheduleLinks} from "./aquarelaksPage";
import {getProxiedUrl} from "./urls";
import {renderPdf} from "./pdfViewer";

async function start() {
    const links = await getScheduleLinks(new Date("01.09.2023"))
    if (links.length === 0) {
        document.body.append("No schedule files found")
        return
    }
    if (links.length === 1) {
        return renderPdf(getProxiedUrl(links[0].url), document.body)
    }
    const pdf = await joinPdfs(links.map(link => link.url))
    return renderPdf(pdf, document.body)
}

start().catch(console.error)
