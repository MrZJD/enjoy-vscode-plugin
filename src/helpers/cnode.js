const headers = require('./globals').headers
const fetch = require('cross-fetch').fetch
const cheerio = require('cheerio')

const HOST = 'https://cnodejs.org/api/v1'
const API_TOPICS = '/topics'
const API_CONTENT = '/topic/'

function formatItem (item) {
    return {
        title: `${item.title} (Replies: ${item.reply_count})`,
        id: item.id
    }
}

async function getTopics (page) {
    let res = await fetch(HOST + API_TOPICS + `?page=${ page }`, { headers: headers })

    if (res.status !== 200) {
        throw new Error('network error: ' + res.statusText)
    }

    let data = await res.json()

    if (!data.success) {
        throw new Error('api work error')
    }

    return data.data.map(hotTopic => formatItem(hotTopic))
}

async function getContent (id) {
    let res = await fetch(HOST + API_CONTENT + id, { headers: headers })

    if (res.status !== 200) {
        throw new Error('network error: ' + res.statusText)
    }

    let data = await res.json()

    if (!data.success) {
        throw new Error('api work error')
    }

    data = data.data

    let comment = data.replies.map(item => {
        return `${ item.author.loginname } |:| ${ cheerio.load(item.content)('.markdown-text').text() }`
    }).join('\n')

    return `----${data.title}----

content:
${cheerio.load(data.content)('.markdown-text').text()}

comment:
-------------
user |:| comment
-------------
${comment}

-----------end-----------
`
}

module.exports = {
    getTopics,
    getContent
}
