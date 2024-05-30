import * as vscode from 'vscode';
import { LINE_RANGE } from './constants';

export async function getSurroundingLines(
  document: vscode.TextDocument,
  position: vscode.Position
): Promise<string> {
  const lineRange = getLineRange(document, position);
  const surroundingLines = document.getText(lineRange);
  return surroundingLines;
}

export function getLineRange(
  document: vscode.TextDocument,
  position: vscode.Position
): vscode.Range {
  const startLine = Math.max(position.line - LINE_RANGE.START_OFFSET, 0);
  const endLine = Math.min(position.line + LINE_RANGE.END_OFFSET, document.lineCount - 1);
  const startPos = new vscode.Position(startLine, 0);
  const endPos = new vscode.Position(endLine, document.lineAt(endLine).text.length);
  return new vscode.Range(startPos, endPos);
}

