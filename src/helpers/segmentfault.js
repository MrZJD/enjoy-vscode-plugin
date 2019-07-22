const fetch = require('cross-fetch').fetch
const cheerio = require('cheerio')
const headers = require('./globals').headers

const HOST = 'https://segmentfault.com'

async function loadIndex () {
    let res = await fetch(HOST, {
        headers: headers
    })

    if (res.status !== 200) {
        throw new Error('network error: ' + res.statusText)
    }

    let html = await res.text()
    let $ = cheerio.load(html)

    return $('.news-item').map((ind, el) => {
        let h = $(el).find('.news__item-title').text()
        let url = $($(el).find('a')[0]).attr('href')
        return {
            title: h,
            url: url
        }
    }).get()
}

async function loadFE () {
    let res = await fetch(HOST + '/channel/frontend', {
        headers: headers
    })

    if (res.status !== 200) {
        throw new Error('network error: ' + res.statusText)
    }

    let html = await res.text()
    let $ = cheerio.load(html)

    return $('.news-item').map((ind, el) => {
        let h = $(el).find('.news__item-title').text()
        let url = $($(el).find('a')[0]).attr('href')
        return {
            title: h,
            url: url
        }
    }).get()
}

async function loadContent (url) {
    let res = await fetch(HOST + url, { headers })

    if (res.status !== 200) {
        throw new Error('netwrok error: ' + res.statusText)
    }

    let html = await res.text()
    let $ = cheerio.load(html)

    return `----${ $('#articleTitle a').text() }----

content:
${ $('.article__content').text() }

-----------end-----------
`
}

module.exports = {
    loadIndex,
    loadFE,
    loadContent
}
