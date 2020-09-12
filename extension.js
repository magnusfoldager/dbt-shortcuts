const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */

let NEXT_TERM_ID = 1;

function activate(context) {

	let commitFile = vscode.commands.registerCommand('dbt-shortcuts.compileFile', function () {
		const uri = vscode.window.activeTextEditor.document.uri

		const fileName = uri.fsPath.substring(uri.fsPath.lastIndexOf('/') + 1)
		const filePath = uri.fsPath.substring(0, uri.fsPath.lastIndexOf("/"));

		if (ensureTerminalExists()) {
			selectTerminal().then(terminal => {
				if (terminal) {
					terminal.sendText(`cd ${filePath} && dbt compile --m @${fileName}`);
				}
			});
		}

	});

	let runFile = vscode.commands.registerCommand('dbt-shortcuts.runFile', function () {
		const uri = vscode.window.activeTextEditor.document.uri

		const fileName = uri.fsPath.substring(uri.fsPath.lastIndexOf('/') + 1)
		const filePath = uri.fsPath.substring(0, uri.fsPath.lastIndexOf("/"));

		if (ensureTerminalExists()) {
			selectTerminal().then(terminal => {
				if (terminal) {
					terminal.sendText(`cd ${filePath} && dbt run --m @${fileName}`);
				}
			});
		}

	});

	let testFile = vscode.commands.registerCommand('dbt-shortcuts.testFile', function () {
		const uri = vscode.window.activeTextEditor.document.uri

		const fileName = uri.fsPath.substring(uri.fsPath.lastIndexOf('/') + 1)
		const filePath = uri.fsPath.substring(0, uri.fsPath.lastIndexOf("/"));

		if (ensureTerminalExists()) {
			selectTerminal().then(terminal => {
				if (terminal) {
					terminal.sendText(`cd ${filePath} && dbt run --m @${fileName}`);
				}
			});
		}

	});

	context.subscriptions.push(commitFile);
	context.subscriptions.push(runFile);
	context.subscriptions.push(testFile);
}
exports.activate = activate;

function selectTerminal() {
	const terminals = vscode.window.terminals;
	const items = terminals.map(t => {
		return {
			label: `name: ${t.name}`,
			terminal: t
		};
	});
	return vscode.window.showQuickPick(items).then(item => {
		return item ? item.terminal : undefined;
	});
}

function ensureTerminalExists() {
	if (vscode.window.terminals.length === 0) {
		vscode.window.createTerminal(`Ext Terminal #${NEXT_TERM_ID++}`);
	}
	return true;
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
