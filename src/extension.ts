import * as vscode from 'vscode';
import { formatRte } from './formatter';
import { findHoverDoc } from './hover-docs';

export function activate(context: vscode.ExtensionContext): void {

    // ── 1. FORMATTER ──────────────────────────────────────────────────────────
    const formatter = vscode.languages.registerDocumentFormattingEditProvider('rte', {
        provideDocumentFormattingEdits(
            document: vscode.TextDocument,
            options: vscode.FormattingOptions
        ): vscode.TextEdit[] {
            const source = document.getText();
            const formatted = formatRte(source, {
                tabSize: options.tabSize,
                useTabs: !options.insertSpaces,
                maxEmptyLines: 2
            });

            // Ne retourner un edit que si le contenu a changé
            if (formatted === source) { return []; }

            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(source.length)
            );
            return [vscode.TextEdit.replace(fullRange, formatted)];
        }
    });

    // ── 2. HOVER DOCUMENTATION ────────────────────────────────────────────────
    const hover = vscode.languages.registerHoverProvider('rte', {
        provideHover(
            document: vscode.TextDocument,
            position: vscode.Position
        ): vscode.Hover | undefined {
            // Extraire le mot sous le curseur
            const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
            if (!wordRange) { return undefined; }
            const word = document.getText(wordRange);

            const doc = findHoverDoc(word);
            if (!doc) { return undefined; }

            const md = new vscode.MarkdownString();
            md.isTrusted = true;

            // Signature
            md.appendCodeblock(doc.signature, 'rte');

            // Description
            md.appendMarkdown('\n\n' + doc.description);

            // Exemple
            if (doc.example) {
                md.appendMarkdown('\n\n**Exemple :**');
                md.appendCodeblock(doc.example, 'rte');
            }

            return new vscode.Hover(md, wordRange);
        }
    });

    context.subscriptions.push(formatter, hover);
}

export function deactivate(): void {}
