# TradeXpress RTE — Extension VS Code

Support complet du langage **RTE de TradeXpress Infinity (Generix)** pour Visual Studio Code.

## Fonctionnalités

### Coloration syntaxique
- Mots-clés de structure : `begin`/`endbegin`, `line`/`endline`, `segment`/`endsegment`, `function`/`endfunction`, etc.
- Contrôle de flux : `if`/`then`/`else`/`endif`, `while`/`do`/`endwhile`, `switch`/`case`/`endswitch`
- Exceptions : `try`/`catch`/`finally`/`endtry`
- Fonctions built-in : `pick`, `build`, `substr`, `split`, `bfSqlConnect`, etc.
- Types de variables : `t*` (texte), `n*` (numérique), `b*` (booléen), `ta*`/`na*`/`ba*` (tableaux), `e*` (éléments EDI), etc.
- Commentaires `!` et `%` (information)
- Directives préprocesseur `#include`, `#define`, etc.

### Formatter (`Shift+Alt+F`)
- Indentation automatique selon les blocs RTE
- Préserve les commentaires et les directives préprocesseur
- Configurable via les paramètres VS Code (taille d'indentation, tabs/espaces)

### Documentation hover
Survolez une fonction ou un mot-clé pour afficher sa signature, sa description et un exemple.

Fonctions documentées :
- Blocs structurels (`begin`, `end`, `line`, `segment`, `function`, …)
- Contrôle de flux (`if`, `while`, `switch`, `try`, …)
- Traitement texte (`build`, `substr`, `length`, `split`, `replace`, …)
- I/O (`pick`, `print`, `log`, `put`, `flush`, …)
- Fichiers (`copy`, `rename`, `remove`, `close`, …)
- Temps (`time`)
- Processus (`spawn`, `background`, `exec`, `exit`)
- Base de données (`find`, `new`, `valid`)
- SQL (`bfSqlConnect`, `bfSqlExec`, `bfSqlFetch`, `bfSqlSet`, `bfSqlClose`)
- Constantes (`NL`, `EOL`, `TRUE`, `FALSE`, `SEGMENTS`, `MESSAGE`)

### Snippets
Préfixes disponibles :

| Préfixe | Résultat |
|---|---|
| `begin` | Bloc begin/endbegin |
| `end` | Bloc end/endend |
| `line` | Bloc line/endline (texte) |
| `segment` | Bloc segment/endsegment |
| `function` | Déclaration de fonction |
| `if` | Condition if |
| `while` | Boucles |
| `switch` | Switch statement |
| `try` | Gestion d'exceptions |
| `base` | Définition base de données |
| `print` / `log` | Affichage |
| `pick` / `substr` / `build` / `split` | Fonctions texte |
| `sqlconnect` / `sqlexec` / `sqlfetch` | SQL |
| `inline` | Bloc inline C |
| `!---` / `!===` / `%info` | Commentaires |

## Fichiers supportés

- `.rte` — fichiers sources RTE
- `.inc` — fichiers d'inclusion RTE

## Référence

Documentation basée sur : **TradeXpress Infinity RTE User Guide v1.16** (Generix Group, 22/01/2026)
