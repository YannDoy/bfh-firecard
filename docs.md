# Firecard

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
dans


2. Problématique
3. Context
4. Design
5. Implementation
6. Conclusion
7. Appendix
8. 