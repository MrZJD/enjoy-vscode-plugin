const vscode = require('vscode')
const cnode = require('./helpers/cnode')

const BtnNext = 'next - 下一页'
const BtnPrev = 'prev - 上一页'

function loadIndex (output, page) {
    let loading = vscode.window.setStatusBarMessage('[Enjoy] [cnode] index 加载中...')
    cnode.getTopics(page).then(data => {
        loading.dispose()
        vscode.window.showQuickPick(data.map(item => item.title).concat(page === 1 ? [BtnNext] : [BtnNext, BtnPrev])).then(chose => {
            if (!chose) return

            if (chose === BtnNext) {
                loadIndex(output, page + 1)
                return
            }
            if (chose === BtnPrev) {
                loadIndex(output, page - 1)
                return
            }

            let target = data.find(item => item.title === chose)
            loadContent(output, target.id)
        })
    }).catch(err => {
        loading.dispose()
        vscode.window.showErrorMessage(err.message)
    })
}

function loadContent (output, id) {
    if (!id) return
    let loading = vscode.window.setStatusBarMessage('[Enjoy] [cnode] content 加载中...')
    cnode.getContent(id).then(data => {
        loading.dispose()
        output.show()
        output.append(data)
    }).catch(err => {
        loading.dispose()
        vscode.window.showErrorMessage(err.message)
    })
}

module.exports = function (env) {
    return vscode.commands.registerCommand('enjoy.cnode', () => {
        if (!env.inited) {
            vscode.window.showErrorMessage('Please start the enjoy service first!')
            return
        }

        // 选择节点
        vscode.window.showQuickPick(['index']).then(res => {
            if (!res) return
            
            if (res === 'index') {
                loadIndex(env.output, 1)
                return
            }
        })
    })
}
