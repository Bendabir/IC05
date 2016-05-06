#Platerforme de visualisation du parcours des étudiants.


## Front : Idées de changement et/ou ajout

* Utiliser le plugin Tooltip pour implémenter un click droit personnalisé sur les noeuds

* Rajouter deux boutons (ou un seul qui change selon l'état) au dessus du menu de gauche pour tout dérouler ou tout refermer

* Diminuer l'épaisseur du cercle des halos sur le parcours étudiant ?
    * Dans nodeHaloSize :
        * Actuel : 4 / Math.pow(s.camera.ratio, 0.5)
        * Tester : 2 / Math.pow(s.camera.ratio, 0.5)

* Ajouter des possibilités de paramétrage dans la modal "Paramètres"
    * Multi-sélection donne l'intersection mais peut aussi donner l'union
    * ...

* Penser différement l'intéraction sur le graphe quand un étudiant veut construire son parcours futur
    * Par exemple, il veut regarder les UVs qu'il prendra en GI04 :
        * Il clique sur GI04 pour voir les UVs qui sont prises en général lors de ce semestre
        * Il va ensuite cliquer sur les UVs qui l'intéressent pour avoir des infos, sauf que cela va masquer les autres UVs et afficher seulement les voisins de l'UV sur laquelle il vient de cliquer
        * Il faudrait peut-être, dans ces cas là, désactiver la sélection de voisins pour qu'il puisse se balader tranquillement dans les UVs de GI04

* Implémenter UVWeb
    * Possible dans une modal, avec un bouton dans le panneau de droite qui donne les infos sur l'UV
        * Ce bouton lancera la modal avec l'ensemble des infos d'UVWeb pour l'UV sélectionnée

* Changer l'affichage des infos sur une UV, ce n'est pas très "joli" actuellement