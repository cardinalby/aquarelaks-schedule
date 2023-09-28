import {
    deduceLinkRanges,
    extractScheduleLinks,
    isRelevantLink, ParsedScheduleLinkText,
    parseScheduleLinkText,
    rearrangeScheduleLinks,
    sortScheduleLinks
} from "../src/aquarelaksPage";

import * as fs from "fs";

describe('parseScheduleLinkText', () => {
    it('range', () => {
        const r = parseScheduleLinkText(
            "Grafik w dniach 25.09.2023 - 01.10.2023"
        )
        expect(r).not.toBeNull()
        expect(r.fromDate).toEqual(new Date("9.25.2023"))
        expect(r.toDate).toEqual(new Date("10.01.2023"))
    });

    it('from', () => {
        const r = parseScheduleLinkText(
            "Grafik dostępności od 02.10.2023"
        )
        expect(r).not.toBeNull()
        expect(r.fromDate).toEqual(new Date("10.02.2023"))
        expect(r.toDate).toEqual(null)
    });
})

describe('getScheduleLinks', () => {
    it('example.html', async () => {
        const jsdom = require("jsdom")
        const { JSDOM } = jsdom
        global.DOMParser = new JSDOM().window.DOMParser

        const data = await new Promise<Buffer>((resolve, reject) => {
            fs.readFile('tests/example.html', (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })

        const dom = (new DOMParser()).parseFromString(data.toString(), "text/html")
        const res = extractScheduleLinks(dom)
        expect(res.length).toEqual(1)
        expect(res[0].url).toEqual('https://sport.um.warszawa.pl/documents/63410428/86678446/25.09.2023-01.10.2023.pdf/efa98ae3-bca3-9d5e-caf6-4a474f73fcf4?t=1695470157548')
        expect(res[0].text.trim()).toEqual('Grafik w dniach 25.09.2023 - 01.10.2023')
    })

    it('example2.html', async () => {
        const jsdom = require("jsdom")
        const { JSDOM } = jsdom
        global.DOMParser = new JSDOM().window.DOMParser

        const data = await new Promise<Buffer>((resolve, reject) => {
            fs.readFile('tests/example2.html', (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })

        const dom = (new DOMParser()).parseFromString(data.toString(), "text/html")
        const res = extractScheduleLinks(dom)
        expect(res.length).toEqual(2)
        expect(res[0].url).toEqual('https://sport.um.warszawa.pl/documents/63410428/86678446/25.09.2023-01.10.2023.pdf/efa98ae3-bca3-9d5e-caf6-4a474f73fcf4?t=1695470157548')
        expect(res[0].text.trim()).toEqual('Grafik w dniach 25.09.2023 - 01.10.2023')
        expect(res[1].url).toEqual('https://sport.um.warszawa.pl/documents/63410428/86678446/Dostepno%C5%9B%C4%87+tor%C3%B3w+i+niecki+od+02.10.2023.pdf/c7f437c6-b7cf-57f2-99a5-d70d3838dfeb?t=1695905833154')
        expect(res[1].text.trim()).toEqual('Grafik dostępności od 02.10.2023')
    })
})

describe('isRelevantLink', () => {
    it('range', () => {
        const link: ParsedScheduleLinkText = {
            fromDate: new Date("1.10.2023"),
            toDate: new Date("1.15.2023"),
        }
        expect(isRelevantLink(link, new Date("1.09.2023"))).toEqual(true)
        expect(isRelevantLink(link, new Date("1.10.2023"))).toEqual(true)
        expect(isRelevantLink(link, new Date("1.12.2023"))).toEqual(true)
        expect(isRelevantLink(link, new Date("1.15.2023"))).toEqual(true)
        expect(isRelevantLink(link, new Date("1.16.2023"))).toEqual(false)
    });

    it('from', () => {
        const link: ParsedScheduleLinkText = {
            fromDate: new Date("1.10.2023"),
            toDate: null
        }
        expect(isRelevantLink(link, new Date("1.09.2023"))).toEqual(true)
        expect(isRelevantLink(link, new Date("1.10.2023"))).toEqual(true)
        expect(isRelevantLink(link, new Date("1.12.2023"))).toEqual(true)
    });

    it('to', () => {
        const link: ParsedScheduleLinkText = {
            fromDate: null,
            toDate: new Date("1.10.2023")
        }
        expect(isRelevantLink(link, new Date("1.09.2023"))).toEqual(true)
        expect(isRelevantLink(link, new Date("1.10.2023"))).toEqual(true)
        expect(isRelevantLink(link, new Date("1.11.2023"))).toEqual(false)
    });
})

describe('rearrangeScheduleLinks', () => {
    expect(rearrangeScheduleLinks([
            {fromDate: new Date("1.10.2023"), toDate: new Date("1.20.2023")},
            {fromDate: null, toDate: new Date("1.25.2023")},
            {fromDate: null, toDate: new Date("1.10.2023")},
            {fromDate: new Date("1.15.2023"), toDate: null},
            {fromDate: new Date("1.5.2023"), toDate: null}
        ],
        new Date("1.15.2023")
    )).toEqual([
        {fromDate: new Date("1.10.2023"), toDate: new Date("1.20.2023")},
        {fromDate: new Date("1.15.2023"), toDate: null},
        {fromDate: new Date("1.21.2023"), toDate: new Date("1.25.2023")}
    ])

    expect(rearrangeScheduleLinks([
            {fromDate: new Date("1.15.2023"), toDate: null},
            {fromDate: new Date("1.5.2023"), toDate: null}
        ],
        new Date("1.15.2023")
    )).toEqual([
        {fromDate: new Date("1.15.2023"), toDate: null}
    ])

    expect(rearrangeScheduleLinks(
        [
            {fromDate: new Date("02.01.2023"), toDate: null},
            {fromDate: new Date("02.13.2023"), toDate: new Date("02.26.2023")}
        ],
        new Date("02.15.2023")
    )).toEqual(
        [
            {fromDate: new Date("02.13.2023"), toDate: new Date("02.26.2023")}
        ]
    )
})

describe('deduceLinkRanges', () => {
    expect(deduceLinkRanges(
        [
            {fromDate: new Date("02.01.2023"), toDate: null},
            {fromDate: new Date("02.13.2023"), toDate: new Date("02.26.2023")},
            {fromDate: null, toDate: new Date("02.30.2023")}
        ],
    )).toEqual(
        [
            {fromDate: new Date("02.01.2023"), toDate: new Date("02.12.2023")},
            {fromDate: new Date("02.13.2023"), toDate: new Date("02.26.2023")},
            {fromDate: new Date("02.27.2023"), toDate: new Date("02.30.2023")}
        ]
    )
})

describe('sortScheduleLinks', () => {
    let
        from10to20 = {fromDate: new Date("1.10.2023"), toDate: new Date("1.20.2023")},
        from5to15 = {fromDate: new Date("1.5.2023"), toDate: new Date("1.15.2023")},
        from15to25 = {fromDate: new Date("1.15.2023"), toDate: new Date("1.25.2023")},
        from5 = {fromDate: new Date("1.5.2023"), toDate: null},
        from15 = {fromDate: new Date("1.15.2023"), toDate: null},
        from25 = {fromDate: new Date("1.25.2023"), toDate: null},
        to10 = {fromDate: null, toDate: new Date("1.10.2023")},
        to15 = {fromDate: null, toDate: new Date("1.15.2023")},
        to25 = {fromDate: null, toDate: new Date("1.25.2023")}

    expect(sortScheduleLinks(
        [from10to20, to25, from5to15, from5]
    )).toEqual(
        [from5to15, from5, from10to20, to25]
    )

    expect(sortScheduleLinks(
        [from15to25, from15, from25, to10, to15, ]
    )).toEqual(
        [to10, from15to25, from15, to15, from25]
    )

    expect(sortScheduleLinks(
        [from15, from5to15]
    )).toEqual(
        [from5to15, from15]
    )

    const from11to12 = {fromDate: new Date("02.11.2023"), toDate: new Date("02.12.2023")}
    const from13to26 = {fromDate: new Date("02.13.2023"), toDate: new Date("02.26.2023")}

    expect(sortScheduleLinks(
        [from11to12, from13to26]
    )).toEqual(
        [from11to12, from13to26]
    )
})