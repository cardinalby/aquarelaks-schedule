import {joinPdfs} from "./pdfBuilder";
import {getScheduleLinks} from "./aquarelaksPage";

function openPdf(pdf: Uint8Array) {
    const blob = new Blob([pdf], {type: "application/pdf"})
    const url = window.URL.createObjectURL(blob);
    window.location.assign(url)
}

async function start() {
    const links = await getScheduleLinks()
    if (links.length === 0) {
        document.body.append("No schedule files found")
        return
    }
    if (links.length === 1) {
        window.location.assign(links[0].url)
        return
    }
    const pdf = await joinPdfs(links.map(link => link.url))
    openPdf(pdf)
}

start().catch(console.error)
