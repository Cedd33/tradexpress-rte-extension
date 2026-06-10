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

export interface FormatterOptions {
    tabSize: number;       // taille de l'indentation (espaces)
    useTabs: boolean;      // utiliser des tabs ou des espaces
    maxEmptyLines: number; // nombre max de lignes vides consécutives
}

const DEFAULT_OPTIONS: FormatterOptions = {
    tabSize: 4,
    useTabs: false,
    maxEmptyLines: 2
};

// Mots-clés qui ouvrent un bloc (indentation augmente APRÈS)
const BLOCK_OPEN = /^(begin|line\b|line\s*\(|line\s+'|segment\b|default\b|function\b|end\b|if\b.*\bthen\b|while\b.*\bdo\b|switch\b|try\b|catch\b|finally\b|inline\b|nodein\b|nodeout\b)\s*(\(.*\)|'.*'|.*)?$/i;

// Mots-clés qui ferment un bloc (indentation diminue AVANT)
const BLOCK_CLOSE = /^(endbegin|endline|endsegment|enddefault|endfunction|endend|endif|endwhile|endtry|endinline|catch\b|finally\b|endnodein\b|endnodeout\b)\b/i;

// Mots-clés qui ferment ET ouvrent (else : referme le if, ouvre un nouveau bloc)
const BLOCK_ELSE = /^(else)\b/i;

// case : ferme le case précédent et en ouvre un nouveau
const BLOCK_CASE = /^(case\b|default\s*:)/i;

// Directives préprocesseur : toujours en colonne 0
const PREPROCESSOR = /^#/;

export function formatRte(source: string, options: Partial<FormatterOptions> = {}): string {
    const opts: FormatterOptions = { ...DEFAULT_OPTIONS, ...options };
    const indent = opts.useTabs ? '\t' : ' '.repeat(opts.tabSize);

    const lines = source.split(/\r?\n/);
    const result: string[] = [];
    let level = 0;
    let consecutiveEmpty = 0;

    const switchLevels: number[] = [];

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

        // --- Ouverture switch : mémoriser le niveau ---
        if (/^switch\b/i.test(line)) {
            result.push(indent.repeat(level) + line);
            switchLevels.push(level);
            level++;
            continue;
        }

        // --- case/default : revenir au niveau switch+1 ---
        if (BLOCK_CASE.test(line)) {
            const switchLevel = switchLevels.length > 0 
                ? switchLevels[switchLevels.length - 1] 
                : Math.max(0, level - 1);
            level = switchLevel + 1;
            result.push(indent.repeat(switchLevel + 1) + line);
            level = switchLevel + 2;
            continue;
        }

         // --- endswitch : dépiler ---
        if (/^endswitch\b/i.test(line)) {
            if (switchLevels.length > 0) {
                level = switchLevels.pop()!;
            }
            result.push(indent.repeat(level) + line);
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
