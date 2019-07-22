const vscode = require('vscode')
const segmentfault = require('./helpers/segmentfault')

function loadProxy (output, service) {
    let loading = vscode.window.setStatusBarMessage(`[Enjoy] [segmentfault] ${service} 加载中...`)
    segmentfault[service]().then((data) => {
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

// 加载前端结点
function loadFE (output) {
    loadProxy(output, 'loadFE')
}

// 加载主页结点
function loadHome (output) {
    loadProxy(output, 'loadIndex')
}

// 加载内容页
function loadContent (url, output) {
    if (!url) return
    let loading = vscode.window.setStatusBarMessage('[Enjoy] [segmentfault] content 加载中...')
    segmentfault.loadContent(url).then(data => {
        loading.dispose()
        output.show()
        output.append(data)
    }).catch(err => {
        loading.dispose()
        vscode.window.showErrorMessage(err.message)
    })
}

module.exports = function (env) {
    return vscode.commands.registerCommand('enjoy.segmentfault', () => {
        if (!env.inited) {
            vscode.window.showErrorMessage('Please start the enjoy service first!')
            return
        }

        // 选择节点
        vscode.window.showQuickPick(['home', 'frontEnd']).then(res => {
            if (!res) return
            
            if (res === 'home') {
                loadHome(env.output)
                return
            }

            if (res === 'frontEnd') {
                loadFE(env.output)
                return
            }
        })
    })
}
