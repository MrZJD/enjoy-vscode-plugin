const cheerio = require('cheerio')
const fetch = require('cross-fetch').fetch
const headers = require('./globals').headers

async function search (str, page) {
    let res = await fetch(`https://www.baidu.com/s?wd=${encodeURIComponent(str)}&rsv_spt=${page}`, {
        headers: headers
    })

    if (res.status !== 200) {
        throw new Error('network error: ' + res.statusText)
    }
    let html = await res.text()
    let $ = cheerio.load(html)
    return $('.result').map((item, el) => {
        let h = $(el).find('a')
        return {
            title: h.text(),
            href: h.attr('href'),
            summary: $(el).find('.c-abstract').text()
        }
    }).get()
}

module.exports = {
    search
}
