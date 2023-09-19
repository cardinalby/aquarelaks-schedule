import { getScheduleLink } from "../src/aquarelaksPage";
import * as fs from "fs";

describe('getScheduleLink', () => {
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
        const res = await getScheduleLink(dom)
        expect(res).toEqual('https://sport.um.warszawa.pl/documents/63410428/86398301/Dostepno%C5%9B%C4%87+tor%C3%B3w+i+niecki+18-24.09.2023.pdf/9a85760b-b353-7177-afbe-2da53742c001?t=1695020383880')
    })
})