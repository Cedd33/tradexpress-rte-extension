"use strict";
/**
 * Formatter RTE pour TradeXpress Infinity
 * Basé sur la documentation officielle (User Guide v1.16)
 *
 * Règles appliquées :
 * - Indentation à 1 tab (configurable)
 * - Blocs ouvrants/fermants reconnus selon la syntaxe RTE officielle
 * - Les commentaires (! et %) sont préservés sans modification
 * - Les directives préprocesseur (#include, #define…) restent en colonne 0
 * - Les lignes vides sont conservées (max 2 consécutives)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRte = formatRte;
const DEFAULT_OPTIONS = {
    tabSize: 4,
    useTabs: false,
    maxEmptyLines: 2
};
// Mots-clés qui ouvrent un bloc (indentation augmente APRÈS)
const BLOCK_OPEN = /^(begin|line\b|line\s*\(|line\s+'|segment\b|default\b|function\b|end\b|if\b.*\bthen\b|while\b.*\bdo\b|switch\b|try\b|catch\b|finally\b|inline\b)\s*(\(.*\)|'.*'|.*)?$/i;
// Mots-clés qui ferment un bloc (indentation diminue AVANT)
const BLOCK_CLOSE = /^(endbegin|endline|endsegment|enddefault|endfunction|endend|endif|endwhile|endswitch|endtry|endinline|catch\b|finally\b)\b/i;
// Mots-clés qui ferment ET ouvrent (else : referme le if, ouvre un nouveau bloc)
const BLOCK_ELSE = /^(else)\b/i;
// case : ferme le case précédent et en ouvre un nouveau
const BLOCK_CASE = /^(case\b|default\s*:)/i;
// Directives préprocesseur : toujours en colonne 0
const PREPROCESSOR = /^#/;
function formatRte(source, options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const indent = opts.useTabs ? '\t' : ' '.repeat(opts.tabSize);
    const lines = source.split(/\r?\n/);
    const result = [];
    let level = 0;
    let consecutiveEmpty = 0;
    for (const rawLine of lines) {
        const line = rawLine.trim();
        // --- Lignes vides : limiter les répétitions ---
        if (line === '') {
            consecutiveEmpty++;
            if (consecutiveEmpty <= opts.maxEmptyLines) {
                result.push('');
            }
            continue;
        }
        consecutiveEmpty = 0;
        // --- Préprocesseur (#include, #define…) : toujours colonne 0 ---
        if (PREPROCESSOR.test(line)) {
            result.push(line);
            continue;
        }
        // --- Commentaires (! et %) : indenter normalement ---
        if (line.startsWith('!') || line.startsWith('%')) {
            result.push(indent.repeat(level) + line);
            continue;
        }
        // --- else : ferme et ouvre ---
        if (BLOCK_ELSE.test(line)) {
            level = Math.max(0, level - 1);
            result.push(indent.repeat(level) + line);
            level++;
            continue;
        }
        // --- Fermeture de bloc : dé-indenter AVANT ---
        if (BLOCK_CLOSE.test(line)) {
            level = Math.max(0, level - 1);
            result.push(indent.repeat(level) + line);
            // catch et finally ouvrent aussi un bloc après eux
            if (/^(catch|finally)\b/i.test(line)) {
                level++;
            }
            continue;
        }
        // --- case/default dans un switch : même niveau que le switch+1, contenu indenté ---
        if (BLOCK_CASE.test(line)) {
            // Si on est dans un case (level > niveau switch+1), refermer le case précédent
            if (level > 1) {
                level = Math.max(0, level - 1);
            }
            result.push(indent.repeat(level) + line);
            level++;
            continue;
        }
        // --- Ligne normale ---
        result.push(indent.repeat(level) + line);
        // --- Ouverture de bloc : indenter APRÈS ---
        if (BLOCK_OPEN.test(line)) {
            level++;
        }
    }
    // Supprimer les lignes vides en fin de fichier
    while (result.length > 0 && result[result.length - 1] === '') {
        result.pop();
    }
    return result.join('\n') + '\n';
}
//# sourceMappingURL=formatter.js.map