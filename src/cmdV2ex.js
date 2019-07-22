const vscode = require('vscode')
const v2ex = require('./helpers/v2ex')

function loadProxy (output, service) {
    let loading = vscode.window.setStatusBarMessage(`[Enjoy] [v2ex] ${service} 加载中...`)
    v2ex[service]().then((data) => {
        loading.dispose()
        vscode.window.showQuickPick(data.map(item => item.title)).then(chose => {
            if (!chose) return
    
            let target = data.find(item => item.title === chose)

            loadContent(target.url, output)
        })
    }).catch(err => {
        loading.dispose()
        vscode.window.showErrorMessage(err.message)
    })
}

// 加载热门话题
function loadHot (output) {
    loadProxy(output, 'getHotTopic')
}

// 加载主页话题
function loadHome (output) {
    loadProxy(output, 'getHomeTopic')
}

// 加载内容页
function loadContent (url, output) {
    if (!url) return
    let loading = vscode.window.setStatusBarMessage('[Enjoy] [v2ex] content 加载中...')
    v2ex.getContent(url).then(data => {
        loading.dispose()
        output.show()
        output.append(data)
    }).catch(err => {
        loading.dispose()
        vscode.window.showErrorMessage(err.message)
    })
}

module.exports = function (env) {
    return vscode.commands.registerCommand('enjoy.v2ex', () => {
        if (!env.inited) {
            vscode.window.showErrorMessage('Please start the enjoy service first!')
            return
        }

        // 选择节点
        vscode.window.showQuickPick(['hot', 'home']).then(res => {
            if (!res) return
            
            if (res === 'hot') {
                loadHot(env.output)
                return
            }

            if (res === 'home') {
                loadHome(env.output)
                return
            }
        })
    })
}
