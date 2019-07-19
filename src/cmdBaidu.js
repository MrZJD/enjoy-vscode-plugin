const vscode = require('vscode')
const baidu = require('./helpers/baidu')

const BtnNext = 'next - 下一页'
const BtnPrev = 'prev - 上一页'

function showResult (output, query, page) {
    let loading = vscode.window.setStatusBarMessage('[Enjoy] [Baidu] 加载中...')
    baidu.search(query, page).then((data) => {
        loading.dispose()
        vscode.window.showQuickPick(data.map(item => item.title).concat(page === 1 ? [BtnNext] : [BtnNext, BtnPrev])).then(chose => {
            if (!chose) return

            if (chose === BtnNext) {
                showResult(query, page + 1)
                return
            }
            if (chose === BtnPrev) {
                showResult(query, page - 1)
                return
            }

            let target = data.find(item => item.title === chose)
            output.show()
            output.append(JSON.stringify(target, null, 4))
        })
    })
}

module.exports = function (env) {
    return vscode.commands.registerCommand('enjoy.baidu', () => {
        if (!env.inited) {
            vscode.window.showErrorMessage('Please start the enjoy service first!')
            return
        }
        vscode.window.showQuickPick(['search']).then(res => {
            if (!res) return
            let page = 1
            vscode.window.showInputBox({ placeHolder: '请输入搜索关键词' }).then(query => showResult(env.output, query, page))
        })
    })
}
