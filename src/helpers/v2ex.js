const cheerio = require('cheerio')
const fetch = require('cross-fetch').fetch
const headers = require('./globals').headers

function formatItem (item) {
    return {
        title: `[${item.node.title}] ${item.title} (Replies: ${item.replies})`,
        url: item.url
    }
}

async function getHotTopic () {
    let res = await fetch('https://www.v2ex.com/api/topics/hot.json', {
        headers: headers
    })

    if (res.status !== 200) {
        throw new Error('network error: ' + res.statusText)
    }

    let data = await res.json()

    return data.map(hotTopic => formatItem(hotTopic))
}

async function getContent (url) {
    let res = await fetch(url, {
        headers: headers
    })

    if (res.status !== 200) {
        throw new Error('network error: ' + res.statusText)
    }

    let html = await res.text()
    let $ = cheerio.load(html)

    let content = $('.topic_content .markdown_body').text()
    let title = $('.header h1').text()

    let comment = $('.reply_content').map((item, el) => {
        return `${ $(el).siblings('strong').find('a').text() } |:| ${ $(el).text() }`
    }).get().join('\n')

    return `----${title}----

content:
${content}

comment:
-------------
user |:| comment
-------------
${comment}

-----------end-----------
`
}

async function getHomeTopic () {
    let res = await fetch('https://www.v2ex.com/api/topics/latest.json', {
        headers: headers
    })

    if (res.status !== 200) {
        throw new Error('network error: ' + res.statusText)
    }

    let data = await res.json()

    return data.map(homeTopic => formatItem(homeTopic))
}

module.exports = {
    getHotTopic,
    getContent,
    getHomeTopic
}

// getHotTopic().then(data => {
//     console.log(JSON.stringify(data, null, 4))

//     getContent(data[0].url).then(text => {
//         console.log(text)
//     })
// })
