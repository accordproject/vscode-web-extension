import * as vscode from 'vscode';
import { STATUS_BAR } from '../constants';

export function createStatusBarItem(context: vscode.ExtensionContext) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR.PRIORITY);
    statusBarItem.text = STATUS_BAR.TEXT;
    statusBarItem.tooltip = STATUS_BAR.TOOLTIP;
    statusBarItem.command = STATUS_BAR.COMMAND;
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);
}
