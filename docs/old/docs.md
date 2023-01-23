# FireCard

https://dev.to/igrvs/react-native-swr-persistent-cache-with-mmkv-f2f

# Architecture

Architecture est un model en couche avec comme couche fondamental
le modèle (plain object and pure function), les hooks (react hook), les vues (react component)

@TODO UML diagram architecture

## Modèle

Pour le modèle, j'ai utiliseur de la programmation fonctionnel pour 2 raisons.
1. c'est un paradigme simple pour moi (je connais bien)
2. dans react les états des composant doivent être immutable (exactement ce que le fonctionnel prône)

J'utilises donc object typé (typescript), et des fonction pure (fonctionnelles) pour les manipuler 

## Hooks

Un hook est un fonction qui permette à un composant react de récupéré des variable afin de les afficher le dit composant
et comme le nom laisse entendre (react hook) ce sont de corchet qui vient s'achrochet au moteur de rendu react afin
que react puis réagir pour par exemple rafrechir certain composant

Etant de simple fonction qui utilise des hook primitive fournit par react, cette parti sert comme la
parti controller dans MVC, il lie le modèle et return les info que la vue utilisera.
la seul différence c'est que c'est la vue qui appel le hook. et que la vue peux et va appelle et dépendre de
plusieurs hooks 

## Composant react

c'est juste de composant fonction (FC) de react, donc des fonction qui retour du JSX utilisé par réact pour rendre
le composant. de plus la fonction appelle tous un ensemble de hook pour récuépré le callback (pour event binding) et 
les état à afficher et grâce à ces hook le moteur react automatiquement rafreshi la vue.


1. Introduction

Firecard est application proof of concept réalisé par M. Fahrni
afin de demontré utilisation de Fhir et de midata (cloud provider pour Fhir)
est utilisable par un application visant le public (ici les patient)
pas uniquement le progicielle des hôpitals, cabinets, etc...

Le context medico-informatique rende certaine problèmatique d'autant plus critique
1. Interoperability (usage le plus strict de fhir)
2. Un grande tolerance (system dois pouvoir fonctionner avec énormement de variabilité sur les données)
   1. La plupart de champ fhir sont option (/!\ null pointer exception)
   2. Il y a de multiple variant de la spec (version fhir.ch, hl7.org)
   3. Des grande divergence et problème de coherence lié à la distribution des donnée
3. Une confidentialitée des données maximum (context medical oblige)

C'est dans ce cadre de perfectionnement et fiabilisation de POC intervient dans le projet2, puis la thèse de bachelor.

Objectifs:
projet2: reflection, recherche autour de fhir, du context medical,
        fiabilisation du POC avec le fonctionnalité actuelle
        + preparation these de bachelor
these: amelioration + ajout de fonctionalité
        et test end-user

2. Problématique

3. Context
4. Design
5. Implementation
6. Conclusion
7. Appendix


# Programmation fonctionnelle

J'ai utilisé un architecture orienté fonctionnelle pour le raison ci-dessous:
1. C'est un paradigme de je maitrise
2. C'est en parti poussé et prévu dans react
3. C'est ce que je connais de plus fiable
4. Javascript (par extension typescript ici) sont de language fonctionnelle
5. Typescript permet un très grand expressivité des type très propice à de la programmation fonctionnel poussé (façon Haskell)

## Concept utilisé

### Immutability
Idée est impossé par react. En effect le état etant des object immutable stocker dans le composant de doit pas être muté,
Il faut récré entièrement copie de état avec le information modifé avant appeler le setter etat du composant.
React est structurellement conçu pour immutable. Et sa permets de faire des tests unitaire plus simple car le 
fonction de manipulation de état sont de fonction pure

### Fonction pure

Une fonction qui n'a pas effet de bord (qui ne execute pas mais évalue).
Des fonction très simple à tester, il suffit appeller la fonction avec une donnée et assert le type de retour
Il n'y a pas de mock (car pas effet de bord)

### Optics / Lens

Pour manipuler des object immutable, generalement approche utilisé et appltire notre état le plus possible,
evité la récursion. Et même utilisé un store pour stocker être de façon global et le partagé entre tous les composant
réact. Cepandant cette état un pas très composable et difficile à maintenire et concevoir même avec de outils comme redux
Surtout si on comprend que le donnée de MIDATA sont pas du ton applati et autement imbriquer avec enormement de variance
(car la spec fhir rend la plupare de champ optionel, ce qui oblige à ecire beaucoup de code pour gérér tous le cas)

Idée de lens/optic, c'est avoir un fonction qui récupé l'information (getter) et permet egalement de la transformer
(dans un copie. CF immutabilité) dans le toutes.
J'ai donc le object fhir directement comme model stocker dans les état de mes composant réact
et je le manipule a travers ces lens. Analogie est que une lentille permet de focalisé sur un parti d'une image

### Composabilité

Ce qui rende la programmation fonctionnelle puissant est la composabilité (resp. decomposabilité) des fonctions
Effectivement les lens/optics sont en faire de optics très simple mais compose afin obtenir un lens très complexe
et chaque lens primitive sont très simple et donc fiable et facile a tester et par le typage strict
on evite introduire de bug dans le composition car on ne compose pas n'import comment des optics. Tous suites les lois 
mathématique de la théorie des catégorie as avoir f: B->C, g: A->B alors f.g : A -> C
Le lens sont enfait de bête fonction pure qui se compose donc très bien et qui sont capable effectue tous action
réalisable par de lens. Dans mon cas j'ai utilisé un libraire optics-ts qui permet de les utilisé simplement.

```ts
import * as O from "optics-ts"

// Ici on a une lenses.png (d'où le suffix L) qui permet accédé à un champ name
const nameL = O.optic<{name: string, age: number}>().prop("name")

// ici on recuère le nom
const name = O.get(nameL, {name: "bob", age: 23})
// => name === "bob"

// Ici on modifie le nom sans pour autant modifier le parametre / O.set est une fonction pure
const copy = O.set(nameL, "jhon", {name: "bob", age: 23})
// => copy = {name: "jhon", age: 23}

// Ici on compose un lenses.png qui recuère un utilisateur puis le nom
const userNameL = O.optic<{user: {name: string, age: number}}>()
    .prop("user")
    .compose(nameL)

// ici on recuère le nom
const name2 = O.get(userNameL, {user: {name: "bob", age: 23}})
// => name2 === "bob"

// Ici on modifie le nom sans pour autant modifier le parametre / O.set est une fonction pure
const copy2 = O.set(userNameL, "jhon", {user: {name: "bob", age: 23}})
// => copy2 = {user: {name: "jhon", age: 23}}
```

Ici je vous ai présenté des lens prop qui focalisé sur un proriété
mais il y a aussi des lens `rewrite` qui permet force la valeur d'un champs calculer utile pour m'intenire des invariant
dans mon cas j'utilise sa pour m'intenire le status de appointment en fonction de la date du jour /
et des étant acceptation des participant de celui-ci

### Architecture

Une architecture très classique REACT avec un model (des fonction utilitaire, des types),
des hook (qui sont un peux comme les controle MVC)
et le vue qui sont le composant react et qui sont donc de vue hierachisé (imbrique les une dans les autre et qui
sont résponsable appeler les hook IoC)

### Composabilité des composant react

React suite les principe fonctionelle et donc promeut la composabilité.
Le composant on donc de propriété injecté et retour de une structure (composition) hierachique de composant graphique
qui a leur tours se rendent jusqu'a des composants primaire qui ont un code spécifique dans le moteur de rendu react
(react-native dans notre cas). Par definition le composant doivent donc être le plus simple possible qui le séparé en
plusieurs afin de le composer ensuite. Cepandent, un des paradox est que l'on partage un domain model et les donnée associé
entre plusieur composant ce qui implique generalement enormement de code boilerplate jusque pour faire passe plat en prenant
le informatation en property du composant puis en les passant aux property dex composants enfants.
(problème connu sous le nom de prop drilling). Idée est donc de partage l'information et la solution
la plus utiliser et donc un store qui stocke etant ent dehors la vue react et après de greffé les donnée dans le composant
le principal probleme de cette methode c'est qui faut utiliser d'autre library (gestionaire êtat react)
qui en plus de centralisé les donnée les rend plus complexe car un block et bien plus difficile à composé.
de plus côté composant, tous le composant on tendant à dépendre de store entier ce qui anile tous une parti de la composabilité et
impose un parti de la complexité des composant directement dans le store qui se trouve être monolithique.

De plus, en plus de géré cette état partagé, il doit aussi géré les interaction système (ici les appelle a l'api midata 
pour récupéré de information, modification) et avec cette gestion de api vient un problème de syncronisation,
de gestion potentiel de cache, gestion d'information pour des indicateur activité etc...

La solution utilisé et donc utilisé une êtat local au composant et de la passé en propriété des sous composant
donc notre cas tous le donnée d'un rendez-vous sont contenu dans un objet
et pour les donnée comme le jeton accès d'api, et stocker dans un context react
(solution inclus nativement dans react pour evité le prop drilling)

la synchronisation de donnée est assuré par SWR qui est un hook react qui utilise les état local du composant et qui 
a un cache partagé pour evité de faire 10 la même requet dans chaque compose et qui gère tous la politque de syncronisation
fetch, refetch on stale data, interval de rafreshissement, rafresshisement à le reconnection réseau,
retry request on failure. Il offre aussun un fonction mutate qui permet indique qu'un ressource fetcher est state voir même de
passe des donnée placeholding afin que l'application affiche cest donnée le temps que le hook récupère les information fresh et ne
les substitue

### Transaction

Vu le système distributé que forme les différents smartphone avec les serveur midata,
il faut avoir un gestion transaction de l'état pour sa un ensemble invarant sont maitenu via le lens (CF. lens)
et un numéro de version est utilisé afin de faire la gestion concurrent de resource REST au sein de API midiat
si on met à jour un resource avec une ancienne version alors le serveur de lui refuse car il y a conflit entre le donnée 
actuelle du server (qui sont plus récente que celle sur lesquelle la mise a jour actuelle essai) ce qui
peremtte d'ailleurs de prévoir un gestion erreur particulière pour celle-ci (409 conflict) afin de faire comme GIT
avec le diff de votre version vs celle du server et de résoudre en bonne intéligence les conflit via utilisateur
qui arbitrera le conflit.

Le serveur posède egalement un historique de tous les version permettant potentiellement
offrire des fonctionnalité similaire à git. 

### Modèle

Le domain model est donc composé le la resource fhir dans sont format JSON + un ensemble de lens qui permets d'accédé
au donnée et exploité la resource fhir comme un view model

Il est donc programmer de façon pure, en pure typescript

### Contrôle

ce qui jour le role 


# Licence

La plateforme MIDATA se base sur un logiciel open source développé par l’ETH Zurich et la Haute école spécialisée bernoise BFH. Le logiciel est publié sous le nom de « Open MIDATA Server », sous licence GNU General Public License v3.0.


