"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const formatter_1 = require("./formatter");
const hover_docs_1 = require("./hover-docs");
function activate(context) {
    // ── 1. FORMATTER ──────────────────────────────────────────────────────────
    const formatter = vscode.languages.registerDocumentFormattingEditProvider('rte', {
        provideDocumentFormattingEdits(document, options) {
            const source = document.getText();
            const formatted = (0, formatter_1.formatRte)(source, {
                tabSize: options.tabSize,
                useTabs: !options.insertSpaces,
                maxEmptyLines: 2
            });
            // Ne retourner un edit que si le contenu a changé
            if (formatted === source) {
                return [];
            }
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(source.length));
            return [vscode.TextEdit.replace(fullRange, formatted)];
        }
    });
    // ── 2. HOVER DOCUMENTATION ────────────────────────────────────────────────
    const hover = vscode.languages.registerHoverProvider('rte', {
        provideHover(document, position) {
            // Extraire le mot sous le curseur
            const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
            if (!wordRange) {
                return undefined;
            }
            const word = document.getText(wordRange);
            const doc = (0, hover_docs_1.findHoverDoc)(word);
            if (!doc) {
                return undefined;
            }
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
function deactivate() { }
//# sourceMappingURL=extension.js.map