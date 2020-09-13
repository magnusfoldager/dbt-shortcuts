const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */

let NEXT_TERM_ID = 1;

function activate(context) {

	let compileFile = vscode.commands.registerCommand('dbt-shortcuts.compileFile', function () {
		executeCommandFromUri(vscode.window.activeTextEditor.document.uri, 'compile')
	});

	let compileFileFromMenu = vscode.commands.registerCommand('dbt-shortcuts.compileFileFromMenu', function (uri) {
		executeCommandFromUri(uri, 'compile')
	});

	let runFile = vscode.commands.registerCommand('dbt-shortcuts.runFile', function () {
		executeCommandFromUri(vscode.window.activeTextEditor.document.uri, 'run')
	});

	let runFileFromMenu = vscode.commands.registerCommand('dbt-shortcuts.runFileFromMenu', function (uri) {
		executeCommandFromUri(uri, 'run')
	});

	let testFile = vscode.commands.registerCommand('dbt-shortcuts.testFile', function () {
		executeCommandFromUri(vscode.window.activeTextEditor.document.uri, 'test')
	});

	let testFileFromMenu = vscode.commands.registerCommand('dbt-shortcuts.testFileFromMenu', function (uri) {
		executeCommandFromUri(uri, 'test')
	});

	context.subscriptions.push(compileFile)
	context.subscriptions.push(compileFileFromMenu)

	context.subscriptions.push(runFile)
	context.subscriptions.push(runFileFromMenu)
	
	context.subscriptions.push(testFile)
	context.subscriptions.push(testFileFromMenu)
}
exports.activate = activate;

function executeCommandFromUri(uri, command='compile') {
	const fileName = uri.fsPath.substring(uri.fsPath.lastIndexOf('/') + 1).split('.').slice(0, -1).join('.')
	const filePath = uri.fsPath.substring(0, uri.fsPath.lastIndexOf("/"))

	executeCommand(fileName, filePath, command)
}

function executeCommand(fileName, filePath, command='compile') {
	if (ensureTerminalExists()) {
		selectTerminal().then(terminal => {
			if (terminal) {
				terminal.sendText(`cd ${filePath} && dbt ${command} --m @${fileName}`);
			}
		});
	}
}

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
