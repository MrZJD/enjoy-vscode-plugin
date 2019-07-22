const vscode = require('vscode')
const cmdBaidu = require('./src/cmdBaidu')
const cmdV2ex = require('./src/cmdV2ex')
const cmdCnode = require('./src/cmdCnode')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "enjoy-net" is now active!')

	let env = {
		ctx: context,
		output: null,
		inited: false
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('enjoy.start', () => {
			if (env.inited) {
				env.output.show()
				return
			}

			env.inited = true
			env.output = vscode.window.createOutputChannel('enjoy')
			env.output.show()
			env.output.appendLine('Welcome to Use! Enjoy!')
		})
	)

	context.subscriptions.push(cmdBaidu(env))
	context.subscriptions.push(cmdV2ex(env))
	context.subscriptions.push(cmdCnode(env))
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
