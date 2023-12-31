// Séparation des notions et des capacités
const notions = [];
const capacites = [];
for (entree of entrees) {
    if (entree.type == 'notion') {
        notions.push(entree);
    } else if (entree.type == 'capacite') {
        capacites.push(entree);
    }    
}

// Récupération des div
const formulaire = document.getElementById("formulaire");
const divNotions = document.getElementById("divNotions");
const divCapacites = document.getElementById("divCapacites");

// Niveaux de maîtrise
const maitrises = ['A', 'B', 'C']

// Création des entrées pour les notions
for(let i in notions) {
    createLine(i, "notion");
}

// Créations des entrées pour les capacités
for(let i in capacites) {
    createLine(i, "capacite");
}

function createInput(typeEntree, value, i) {
    /*
        Cette fonction crée un bouton radio pour le formulaire.
            - typeEntree : "notion" ou "capacite" ;
            - value : "A", "B" ou "C" ;
            - i : numéro de l'entrée.
    */
    const input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", typeEntree + i);
    input.setAttribute("value", value);
    return input;
}


function createLine(i, typeEntree) {
    /*
        Cette fonction crée une ligne du formulaire avec :
            - la notion ou la capacité ;
            - les boutons radio correspondant aux trois niveaux de maîtrise ;
            - le commentaire à afficher en fonction du niveau de maîtrise.
    */

    if (typeEntree == "notion") {
        parentDiv = divNotions;
        entree = notions[i];
    } else {
        parentDiv = divCapacites;
        entree = capacites[i];
    }
    
    // Création d'un div pour la ligne du formulaire
    const div = document.createElement("div");
    const classe = (i%2 == 0) ? "entree paire" : "entree impaire";
    div.setAttribute("class", classe);
    div.style.minHeight = '3em';
    parentDiv.appendChild(div);
    
    // Création d'un div pour le contenu du savoir
    const divEntree = document.createElement("div");
    divEntree.setAttribute("class", "notion");
    divEntree.setAttribute("id", `${typeEntree}${i}`);
    divEntree.setAttribute("name", `${typeEntree}${i}`);
    div.appendChild(divEntree);
    divEntree.innerHTML = entree.savoir;
    
    // Création des boutons radio pour le niveau de maîtrise
    const inputA = createInput(typeEntree, "A", i);
    div.appendChild(inputA);
    const inputB = createInput(typeEntree, "B", i);
    div.appendChild(inputB);
    const inputC = createInput(typeEntree, "C", i);
    div.appendChild(inputC);
                
    // Création du commentaire à afficher en fonction du niveau
    const divCommentaire = document.createElement("div");
    divCommentaire.setAttribute("class", "commentaire");
    divCommentaire.setAttribute("id", `comment${typeEntree}${i}`);
    div.appendChild(divCommentaire);
    
    // Affichage du commentaire pour le niveau A
    inputA.addEventListener('change', function(event) {
        if(this.checked) {
            divCommentaire.innerHTML = entree.textA;
        }
    });
    
    // Affichage du commentaire pour le niveau B
    inputB.addEventListener('change', function(event) {
        if(this.checked) {
            divCommentaire.innerHTML = entree.textB;
        }
    });
    
    // Affichage du commentaire pour le niveau C
    inputC.addEventListener('change', function(event) {
        if(this.checked) {
            divCommentaire.innerHTML = entree.textC;
        }
    });
}