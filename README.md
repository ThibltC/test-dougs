## Analyse :

En résumé, il faut vérifier que, sur chaque période, la somme des montants des opérations soit égale à la différence entre le solde du point de contrôle actuel (Pn) et celui du point contrôle précédant (Pn-1).

Voici la structure choisie pour la réponse retournée en cas d'erreur

```typescript
type Reasons = {
  section: number | null;
  dates: {
    from: Date;
    to: Date;
  } | null;
  gap: number | null;
  anomalies: [
    {
      message: string;
      ids: number[] | null;
    }
  ];
}[];
```

- _section_ : Joue le rôle d'id, pour cibler la période où l'erreur est révélée (null si l'opération est à l'extérieur de la période globale)
- _dates_ : Les dates des points de contrôle du début (_from_) et de la fin (_to_) de la période (null si l'opération est à l'extérieur de la période globale)
- _gap_ : La différence entre la somme des montants des opérations et le solde attendu sur la période
- _anomalies_ : liste des anomalies sur cette période avec un descriptif (_message_) et la liste des opérations posant problème (_ids_) (null si inconnues)

Dans un premier temps, retourner une erreur sur les opérations extérieurs à la période donnée (Si Pn-1 ou Pn sont inconnus)

```javascript
const borderMovements = [];
const indexedMovements = [];
const otherAnomalies = {
  section: null,
  dates: null,
  gap: null,
  anomalies: [],
};

for (const movement of movements) {
  if (
    !dayjs(movement.date).isBetween(
      balances[0].date,
      balances[balances.length - 1].date
    )
  ) {
    borderMovements.push(movement.id);
  }
  indexedMovements.push({
    ...movement,
    index: `${movement.wording}-${movement.amount}-${movement.date.getTime()}`,
  });
}
if (borderMovements.length) {
  otherAnomalies.anomalies.push({
    message:
      "vérification impossible par manque de point de contrôle supérieur ou inférieur",
    ids: borderMovements,
  });
}
```

**Note** : J'ai considéré que les ids des opérations (même les doubles) étaient uniques et qu'il n'était possible d'identifier les doublons que par le triplé de valeurs : date, nom, montant. Pour facilité la manipulation des opérations, une indexation a été ajoutée

L'analyse sur les deux soucis majeurs (l'absence et la duplication d'opération) montre qu'il est nécessaire de gérer les deux en même temps, car un doublon pourrait compenser un manque est renvoyé une comptabilité valide.

Pour vérifier toutes les opérations on déterminera les différentes périodes

```
getBalanceSections
```

Puis chaque opération est triée

```javascript
dayjs(indexedMovement.date).isBetween(balance.dates.from, balance.dates.to);
```

On vérifie s'il y a des opérations dupliquées (en renvoyant l'excédant induit)

```
getDuplicateMovementsWithOverAmount
```

On vérifie s'il y a des opérations manquantes

```
section.gap !== 0
```

A la fin on vient ajouter les potentiels autres anomalies

```javascript
const reasonsWithOtherAnomalies = [
  ...(otherAnomalies.anomalies.length ? [otherAnomalies] : []),
  ...reasons,
];
```

## Mise en place

```
npm i
npm test
```
