/**
 * Documentation hover pour les fonctions et mots-clés RTE
 * Sources : TradeXpress Infinity RTE User Guide v1.16
 */

export interface HoverDoc {
    signature: string;
    description: string;
    example?: string;
}

export const HOVER_DOCS: Record<string, HoverDoc> = {

    // ── Blocs structurels ──────────────────────────────────────────────────────
    'begin': {
        signature: 'begin ... endbegin',
        description: 'Exécuté **une seule fois** avant que le premier enregistrement ne soit lu de l\'input. Doit apparaître avant tous les autres blocs statement.',
        example: 'begin\n    nCounter := 0\nendbegin'
    },
    'end': {
        signature: 'end ... endend',
        description: 'Exécuté **une seule fois** après que tout l\'input ait été consommé. Doit être le dernier bloc statement.',
        example: 'end\n    print ("Total: ", nCounter, NL)\nendend'
    },
    'line': {
        signature: 'line (rule) ... endline\nline \'regex\' ... endline',
        description: 'Exécuté pour chaque ligne de l\'input qui correspond à la règle.\n\n**Règles possibles :**\n- `line ("TEXT")` — texte présent n\'importe où\n- `line (N:"TEXT")` — texte à la position N\n- `line (EOL:"TEXT")` — texte en fin de ligne\n- `line (N)` — numéro de ligne absolu\n- Combinaisons avec `and`, `or`, `not`\n- `line \'regex\'` — expression régulière',
        example: 'line (1:"INVOICE#")\n    tRef := pick (1, 9, 14)\nendline'
    },
    'segment': {
        signature: 'segment NAME [gN] ... endsegment',
        description: 'Exécuté quand le segment EDI nommé est atteint dans le message. Le groupe optionnel `gN` précise la position dans l\'arbre du message.',
        example: 'segment UNH\n    e0062 := pick (1, 9, 14)\nendsegment'
    },
    'default': {
        signature: 'default ... enddefault',
        description: 'Exécuté si **aucun** bloc `line` ou `segment` n\'a correspondu à la ligne/segment courant.',
        example: 'default\n    log ("Ligne non reconnue: ", pick(1,1,EOL), NL)\nenddefault'
    },
    'function': {
        signature: 'function tf|nf|bfName (params) ... endfunction',
        description: 'Déclare une fonction utilisateur. Le préfixe indique le type de retour :\n- `tf` → retourne du texte\n- `nf` → retourne un nombre\n- `bf` → retourne un booléen\n\nLes fonctions doivent être définies **après** tous les blocs statement.',
        example: 'function nfSomme (nA, nB)\n    return nA + nB\nendfunction'
    },

    // ── Contrôle de flux ───────────────────────────────────────────────────────
    'if': {
        signature: 'if booleanExpr then ... [else ...] endif',
        description: 'Exécution conditionnelle. La partie `else` est optionnelle.',
        example: 'if nTotal > 0 then\n    print ("OK", NL)\nelse\n    log ("Erreur", NL)\nendif'
    },
    'while': {
        signature: 'while condition do ... endwhile\nwhile tIdx in taArray do ... endwhile\nwhile fFile in "path/*" do ... endwhile',
        description: 'Cinq formes :\n1. **Générale** : contrôlée par une expression booléenne\n2. **Array scan** : parcourt les index d\'un tableau (ordre alphabétique)\n3. **List scan** : parcourt une liste créée par `load`\n4. **Directory scan** : parcourt les fichiers d\'un répertoire\n5. **Database scan** : parcourt les entrées d\'une base',
        example: 'while nIndex <= 10 do\n    print (nIndex, NL)\n    nIndex++\nendwhile'
    },
    'switch': {
        signature: 'switch tSelector\n    case "val1": ...\n    case "val2": ...\n    default: ...\nendswitch',
        description: 'Sélection parmi plusieurs valeurs texte. La section `default` est optionnelle et doit être la dernière.',
        example: 'switch tCode\n    case "01":\n        tLabel := "Facture"\n    case "02":\n        tLabel := "Avoir"\n    default:\n        tLabel := "Inconnu"\nendswitch'
    },
    'try': {
        signature: 'try ... catch [class] ... [finally ...] endtry',
        description: 'Gestion d\'exceptions. Le bloc `catch` intercepte les erreurs ; `finally` s\'exécute inconditionnellement.\n\n**Variables d\'exception :**\n- `EXCEPTION_CLASS` — classe (ex: "general")\n- `EXCEPTION_REASON` — "warning" ou "fatal"\n- `EXCEPTION_CODE` — code numérique\n- `EXCEPTION_MESSAGE` — message texte',
        example: 'try\n    nVal := number (tStr)\ncatch\n    nVal := -1\nendtry'
    },

    // ── Fonctions de traitement texte ──────────────────────────────────────────
    'build': {
        signature: 'build (expr [: format])',
        description: 'Convertit une expression en texte avec format optionnel. Format numérique : `min.decimals` ex: `1.2` = min 1 chiffre, 2 décimales.',
        example: 'tResult := build (nTotal : 1.2)\n! => "1234.56"'
    },
    'substr': {
        signature: 'substr (tText, nStart, nLength)',
        description: 'Extrait une sous-chaîne. `nStart` commence à 1. `nLength` est la longueur.',
        example: 'tPart := substr ("HELLO", 2, 3)\n! => "ELL"'
    },
    'length': {
        signature: 'length (tText)',
        description: 'Retourne le nombre de caractères dans la chaîne.',
        example: 'nLen := length ("HELLO")\n! => 5'
    },
    'index': {
        signature: 'index (tText, tSearch)',
        description: 'Retourne la position de la première occurrence de `tSearch` dans `tText`. Retourne 0 si non trouvé.',
        example: 'nPos := index ("HELLO", "L")\n! => 3'
    },
    'number': {
        signature: 'number (tText)',
        description: 'Convertit une chaîne en nombre. Déclenche un warning si la chaîne n\'est pas numérique (retourne 0).',
        example: 'nVal := number ("123.45")\n! => 123.45'
    },
    'toupper': {
        signature: 'toupper (tText)',
        description: 'Convertit tous les caractères en majuscules.',
        example: 'tUp := toupper ("hello")\n! => "HELLO"'
    },
    'tolower': {
        signature: 'tolower (tText)',
        description: 'Convertit tous les caractères en minuscules.',
        example: 'tLow := tolower ("HELLO")\n! => "hello"'
    },
    'strip': {
        signature: 'strip (tText [, tChars])',
        description: 'Supprime les caractères en début et fin. Par défaut supprime les espaces.',
        example: 'tClean := strip ("  hello  ")\n! => "hello"'
    },
    'peel': {
        signature: 'peel (tText, tChars)',
        description: 'Supprime tous les occurrences des caractères donnés dans la chaîne.',
        example: 'tClean := peel (tStr, " \\t")'
    },
    'replace': {
        signature: 'replace (tText, tFrom, tTo)',
        description: 'Remplace toutes les occurrences de `tFrom` par `tTo` dans `tText`.',
        example: 'tFixed := replace (tStr, ",", ".")'
    },
    'compare': {
        signature: 'compare (tText1, tText2)',
        description: 'Compare deux chaînes. Retourne -1, 0, ou 1.',
        example: 'nCmp := compare ("ABC", "ABD")\n! => -1'
    },
    'split': {
        signature: 'split (tText, taResult, tSeparator)',
        description: 'Découpe `tText` selon `tSeparator` et remplit le tableau `taResult`. Retourne le nombre d\'éléments.',
        example: 'nCount := split ("a,b,c", taItems, ",")\n! taItems[1]="a", taItems[2]="b", taItems[3]="c"'
    },

    // ── Fonctions I/O ──────────────────────────────────────────────────────────
    'pick': {
        signature: 'pick (nLine, nStart, nEnd|nLength)',
        description: 'Extrait du texte depuis la fenêtre courante. `nLine` = numéro de ligne relatif (1 = ligne courante). `nStart`/`nEnd` définissent la plage de colonnes. `EOL` = fin de ligne.',
        example: 'tRef := pick (1, 9, 14)\n! Colonnes 9 à 14 de la ligne courante'
    },
    'print': {
        signature: 'print (expr [, expr, ...])',
        description: 'Écrit sur la sortie standard. Pas de saut de ligne automatique : utiliser `NL`.',
        example: 'print ("Total: ", nVal, NL)'
    },
    'log': {
        signature: 'log (expr [, expr, ...])',
        description: 'Écrit dans le flux de logging (stderr). Pas de saut de ligne automatique.',
        example: 'log ("Erreur ligne ", nLine, NL)'
    },
    'put': {
        signature: 'put (nLine, nCol, tText)',
        description: 'Écrit dans le buffer de sortie à la position (ligne, colonne). Le buffer est ensuite vidé avec `flush()`.',
        example: 'put (1, 1, "INVOICE#")\nput (1, 9, tRef)'
    },
    'flush': {
        signature: 'flush (nMinWidth, nMaxWidth, tSeparator)',
        description: 'Vide le buffer de sortie construit avec `put()`. Utiliser `flush(0, 0, NL)` pour une sortie telle quelle.',
        example: 'flush (0, 0, NL)'
    },
    'read': {
        signature: 'read (fFile)',
        description: 'Lit une ligne depuis le fichier ou processus donné. Retourne EMPTY en fin de fichier.',
        example: 'tLine := read (fInputFile)'
    },
    'load': {
        signature: 'load (tFilename, taResult)',
        description: 'Charge des paires nom=valeur depuis un fichier dans le tableau `taResult`.',
        example: 'load ("/etc/config.ini", taConfig)'
    },

    // ── Fonctions fichier ──────────────────────────────────────────────────────
    'copy': {
        signature: 'copy (tSource, tDest)',
        description: 'Copie le fichier source vers la destination.',
        example: 'copy ("/tmp/input.txt", "/tmp/backup.txt")'
    },
    'rename': {
        signature: 'rename (tOld, tNew)',
        description: 'Renomme (déplace) un fichier.',
        example: 'rename ("/tmp/temp.txt", "/data/output.txt")'
    },
    'remove': {
        signature: 'remove (tFile | dbEntry)',
        description: 'Supprime un fichier ou une entrée de base de données.',
        example: 'remove ("/tmp/temp.txt")'
    },
    'link': {
        signature: 'link (tSource, tLink)',
        description: 'Crée un nouveau lien vers le fichier source.',
        example: 'link ("/data/file.txt", "/link/file.txt")'
    },
    'redirect': {
        signature: 'redirect (tStream, tFile)',
        description: 'Redirige un flux I/O vers un fichier.',
        example: 'redirect ("stdout", "/tmp/output.txt")'
    },
    'close': {
        signature: 'close (fFile)',
        description: 'Ferme le fichier ou processus ouvert.',
        example: 'close (fInputFile)'
    },

    // ── Fonctions http ─────────────────────────────────────────────────────────
    'http': {
        signature: 'http (tMethode, tURL, tFile|taBody, tLogin, tPassword, taHeader, taParameter)',
        description: 'Effectue un appel REST.\n\n**Arguments :**\n- `tMethode` : méthode HTTP (GET, POST, PUT, DELETE)\n- `tURL` : URL du web service (ne peut pas être vide)\n- `tFile/taBody` : fichier à uploader ou tableau de paramètres du body\n- `tLogin` : login pour l\'authentification\n- `tPassword` : mot de passe pour l\'authentification\n- `taHeader` : headers à envoyer\n- `taParameter` : paramètres additionnels ajoutés à l\'URL\n\n**Note :** Le code retour HTTP est stocké dans `HTTP_RETURN_CODE`.',
        example: 'tURL := "https://httpbin.org/get"\ntMethode := "GET"\ntRetourWS := http(tMethode, tURL, tFile, tLogin, tPassword, taHeader, taParameter)\nprint("HTTP_RETURN_CODE=", HTTP_RETURN_CODE, NL)\njsRetour := tRetourWS'
    },
    'httpfile': {
        signature: 'httpfile (tMethode, tURL, tFile|taBody, tLogin, tPassword, taHeader, taParameter)',
        description: 'Télécharge un fichier depuis une URL.\n\n**Arguments :**\n- `tMethode` : méthode HTTP (GET)\n- `tURL` : URL du web service (ne peut pas être vide)\n- `tFile/taBody` : fichier à uploader ou tableau de paramètres du body\n- `tLogin` : login pour l\'authentification\n- `tPassword` : mot de passe pour l\'authentification\n- `taHeader` : headers à envoyer\n- `taParameter` : paramètres additionnels ajoutés à l\'URL\n\n**Retourne :** le chemin complet du fichier téléchargé.\n\n**Note :** Le code retour HTTP est stocké dans `HTTP_RETURN_CODE`.',
        example: 'tURL := "https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg"\ntMethode := "GET"\ntRetourWS := httpfile(tMethode, tURL, tFile, tLogin, tPassword, taHeader, taParameter)\nprint("HTTP_RETURN_CODE=", HTTP_RETURN_CODE, NL)\nlog(tRetourWS, NL)'
    },

    // ── Fonctions temps ────────────────────────────────────────────────────────
    'time': {
        signature: 'time (tFormat)',
        description: 'Retourne l\'heure système dans le format donné (strftime). Formats courants :\n- `%y%m%d` → AAMMJJ\n- `%Y-%m-%d` → AAAA-MM-JJ\n- `%H:%M:%S` → HH:MM:SS\n- `%ew` → numéro de semaine ISO',
        example: 'tDate := time ("%Y%m%d")\n! => "20260122"'
    },

    // ── Fonctions processus ────────────────────────────────────────────────────
    'spawn': {
        signature: 'spawn (tCommand, taArgs, tStdin, tStdout, tStderr)',
        description: 'Exécute une commande et attend sa fin.',
        example: 'spawn ("ls", taArgs, "", "/tmp/list.txt", "")'
    },
    'background': {
        signature: 'background (tCommand, taArgs, tStdin, tStdout, tStderr)',
        description: 'Exécute une commande en tâche de fond (daemon). Pas d\'attente de fin.',
        example: 'background ("myproc", taArgs, "", "", "")'
    },
    'exec': {
        signature: 'exec (tCommand, taArgs)',
        description: 'Remplace le processus courant par la commande donnée.',
        example: 'exec ("otherproc", taArgs)'
    },
    'exit': {
        signature: 'exit (nCode)',
        description: 'Termine le processus courant avec le code de retour donné.',
        example: 'exit (1)'
    },

    // ── Base de données ────────────────────────────────────────────────────────
    'find': {
        signature: 'find (tBase, filter [, sort])',
        description: 'Recherche une entrée dans la base de données EDIBASE avec le filtre donné.',
        example: 'ENTRY := find ("mybase", NAME="myname")'
    },
    'new': {
        signature: 'new (tBase)',
        description: 'Crée une nouvelle entrée dans la base de données.',
        example: 'ENTRY := new ("mybase")'
    },
    'valid': {
        signature: 'valid (object)',
        description: 'Vérifie la validité d\'un objet (message EDI, entrée de base, etc.). Retourne un booléen.',
        example: 'if valid (MESSAGE) then\n    print (MESSAGE)\nendif'
    },

    // ── Constantes système ─────────────────────────────────────────────────────
    'NL': {
        signature: 'NL',
        description: 'Constante : caractère de saut de ligne (newline).',
        example: 'print ("Hello", NL)'
    },
    'EOL': {
        signature: 'EOL',
        description: 'Constante : fin de ligne, utilisée comme position dans `pick()` et `line()`.',
        example: 'line (EOL:"END")'
    },
    'TRUE': {
        signature: 'TRUE',
        description: 'Constante booléenne vraie.',
        example: 'bDone := TRUE'
    },
    'FALSE': {
        signature: 'FALSE',
        description: 'Constante booléenne fausse.',
        example: 'bDone := FALSE'
    },
    'SEGMENTS': {
        signature: 'SEGMENTS',
        description: 'Variable système : nombre de segments insérés dans le message EDI courant.',
        example: 'e0074 := build (SEGMENTS + 1)'
    },
    'MESSAGE': {
        signature: 'MESSAGE',
        description: 'Variable système : référence au message EDI courant. Utilisé avec `valid()` et `print()`.',
        example: 'if valid (MESSAGE) then\n    print (MESSAGE)\nendif'
    },
    'HTTP_RETURN_CODE': {
        signature: 'HTTP_RETURN_CODE',
        description: 'Variable système : contient le code retour HTTP après un appel `http()` ou `httpfile()`.',
        example: 'print("HTTP_RETURN_CODE=", HTTP_RETURN_CODE, NL)'
    },

    // ── SQL ────────────────────────────────────────────────────────────────────
    'bfSqlConnect': {
        signature: 'bfSqlConnect (tDatasource, tUser, tPassword)',
        description: 'Ouvre une connexion SQL. Retourne TRUE si succès.',
        example: 'bfSqlConnect ("mydb", "user", "pass")'
    },
    'bfSqlExec': {
        signature: 'bfSqlExec (tQuery)',
        description: 'Exécute une requête SQL (SELECT, INSERT, UPDATE, DELETE).',
        example: 'bfSqlExec ("SELECT name FROM customers WHERE id=\'", tId, "\'")'
    },
    'bfSqlFetch': {
        signature: 'bfSqlFetch ()',
        description: 'Avance au prochain enregistrement du résultat. Retourne FALSE en fin de résultat.',
        example: 'while bfSqlFetch () do\n    tName := bfSqlSet ("name")\nendwhile'
    },
    'bfSqlSet': {
        signature: 'bfSqlSet (tColumnName)',
        description: 'Retourne la valeur de la colonne nommée dans l\'enregistrement courant.',
        example: 'tVal := bfSqlSet ("amount")'
    },
    'bfSqlClose': {
        signature: 'bfSqlClose ()',
        description: 'Ferme le curseur SQL courant.',
        example: 'bfSqlClose ()'
    }
};

/**
 * Recherche une documentation hover pour le mot donné.
 * La recherche est insensible à la casse.
 */
export function findHoverDoc(word: string): HoverDoc | undefined {
    // Recherche directe
    if (HOVER_DOCS[word]) { return HOVER_DOCS[word]; }
    // Recherche insensible à la casse
    const lower = word.toLowerCase();
    for (const key of Object.keys(HOVER_DOCS)) {
        if (key.toLowerCase() === lower) { return HOVER_DOCS[key]; }
    }
    return undefined;
}
