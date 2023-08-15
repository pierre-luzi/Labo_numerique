/* Écriture scientifique */

let number = 0;
let numberExponent = 0;
let longNotation = "";
let decimalNotation = "";
let resultExponent = 0;

function draw() {
    /*
        Réalise un tirage aléatoire pour générer la question.
    */
    number = randomNumber();
    numberExponent = randomExponent();
    longNotation = writeLongNotation(number, numberExponent);
    decimalNotation = writeDecimalNotation(number);
    resultExponent = numberExponent + String(number).length - 1;
}

function randomNumber(digitsMax=4) {
    /*
        Renvoie un nombre dont le nombre de chiffres est au plus digitsMax.
    */
    digits = Math.floor(Math.random() * digitsMax) + 1;
    number = 0;
    for (let i = 0; i < digits; i++) {
        number += Math.floor(Math.random() * 10) * 10**i;
    }
    if (number == 0) {
        number = randomNumber();
    }
    return number;
}

function randomExponent(minExponent=-8, maxExponent=6) {
    /*
        Renvoie une puissance entre -8 et 6.
    */
    return Math.floor(Math.random() * (maxExponent - minExponent)) + minExponent;
}

function writeLongNotation(num, exponent) {
    /*
        Renvoie une chaîne de caractères représentant le nombre
        écrit de manière "naïve".
        Exemple : pour num = 29 et exponent = -3, la fonction
        renvoie "0,029".
    */
    let stringNumber = String(num);
    let numberLength = stringNumber.length;
    
    let string = "";
    if (exponent > 0) {
        string += stringNumber;
        for(let i = 0; i < exponent; i++) {
            string += "0";
        }
        string = addSpacesToNumber(string);
    } else if (exponent < 0) {
        if (Math.abs(exponent) < numberLength) {
            string += addSpacesToNumber(stringNumber.substring(0, numberLength + exponent));
            string += ",";
            string += addSpacesToNumber(stringNumber.substring(numberLength + exponent), true);
        } else {
            let postCommaString = "";
            for (let i = 0; i < Math.abs(exponent) - numberLength; i++) {
                postCommaString += "0";
            }
            postCommaString += stringNumber;
            string = "0," + addSpacesToNumber(postCommaString, true);
        }
    } else {
        string = addSpacesToNumber(stringNumber);
    }
    
    return string;
}

function writeDecimalNotation(num) {
    /*
        Renvoie une chaîne de caractères représentant un nombre
        compris entre 0 et 10, préfacteur de la puissance de 10
        dans l'écriture scientifique.    
        Exemple : pour 192, renvoie "1,92".
    */
    let stringNumber = String(num);
    let string = stringNumber[0];
    if (stringNumber.length > 1) {
        string += ",";
        string += addSpacesToNumber(stringNumber.substring(1), true);
    }
    return string;
}

function addSpacesToNumber(stringNumber, afterComma=false) {
    /*
        Transforme une chaîne de caractères numériques pour ajouter
        des espaces tous les 3 chiffres.
        Exemples :
            - stringNumber = 29384, afterComma=false : renvoie 29 384 ;
            - stringNumber = 3842, afterComma=true : renvoie 384 2.
    */
    let string = stringNumber;
    let len = string.length;
    if (afterComma) {
        for (i = (len - len%3)/3; i > 0; i--) {
            string = string.substring(0, 3*i) + " " + string.substring(3*i);
        }
    } else {
        for (i = 1; 3 * i < len; i++) {
            string = string.substring(0, len-3*i) + " " + string.substring(len-3*i);
        }
    }
    return string;
}





//======================================
//  Création des différentes fenêtres
//======================================

const container = document.getElementById("container");

const homeIcon = document.getElementById("home");
homeIcon.style.cursor = 'pointer';
homeIcon.addEventListener('mousedown', displayLevelChoice);



// ===== Éléments de l'exercice =====

const divExercise = document.getElementById("exercise");

const spanLevel = document.getElementById("level");
const divQuestion = document.getElementById("question");
const divNumber = document.getElementById("number");
const divValidate = document.getElementById("div_validate");
const validateButton = document.getElementById("validate");

// label précédant la partie décimale
const decimalLabel = document.createElement("label");
decimalLabel.setAttribute("id", "decimal_label");
decimalLabel.setAttribute("for", "decimal");

// input pour la partie décimale (niveau 3)
const decimalInput = document.createElement("input");
decimalInput.setAttribute("type", "text");
decimalInput.setAttribute("inputmode", "decimal");
decimalInput.setAttribute("name", "decimal");
decimalInput.setAttribute("id", "decimal_input");

// label précédant l'exposant (niveaux 2 et 3)
const exponentLabel = document.createElement("label");
exponentLabel.setAttribute("id", "exponent_label");
exponentLabel.setAttribute("for", "exponent");

// input pour l'exposant (niveaux 2 et 3)
const exponentInput = document.createElement("input");
exponentInput.setAttribute("type", "text");
exponentInput.setAttribute("inputmode", "decimal");
exponentInput.setAttribute("name", "exponent");
exponentInput.setAttribute("id", "exponent_input");



// ===== Niveau 1 =====

const radioInputs = [];
const radioLabels = [];

function createRadioInput(id) {
    /*
        Crée des radio buttons et les labels associés
        et les place dans une liste.
    */
    const radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "radio");
    radio.setAttribute("value", "radio" + id);
    radio.setAttribute("id", "radio" + id);
    radioInputs.push(radio);
    
    const label = document.createElement("label");
    label.setAttribute("name", "radio");
    label.setAttribute("for", "radio" + id);
    label.setAttribute("id", "label" + id);
    radioLabels.push(label);
}

for (let i = 0; i < 3; i++) {
    createRadioInput(i);
}

function randomOrder() {
    /*
        Renvoie les indices [0, 1, 2] dans un ordre aléatoire
        afin d'afficher les 3 réponses dans un ordre aléatoire.
    */
    let array = [0, 1, 2];
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function falseExponentsList() {
    /*
        Renvoie une liste de deux exposants différents et non nuls,
        ajoutés à l'exposant attendu.
    */
    let first = 0;
    while (first == 0 ) {
        first = randomExponent(-3,3);
    }
    
    let second = 0;
    while (second == 0 || second == first) {
        second = randomExponent(-3,3);
    }
    return [first, second];
}

function easyLevel() {
    /*
        Affiche une question de niveau 1 : l'élève doit choisir la
        bonne écriture scientifique ; seule la puissance de 10 change.
    */
    spanLevel.innerText = "Niveau 1";
    divQuestion.innerText = "Choisir la bonne écriture scientifique du nombre :";
        
    newEasyLevel();
    
    validateButton.addEventListener('mousedown', checkEasyLevel);
    
    container.appendChild(divExercise);
}

function newEasyLevel() {
    /*
        Affiche une nouvelle question de niveau 1.
    */
    clearElement(divNumber);
    
    draw();
    
    divNumber.appendChild(decimalLabel);
    decimalLabel.innerText = longNotation + " = ";

    for (input of radioInputs) {
        input.checked = false;
    }

    trueLabel = radioLabels[0];
    trueLabel.innerHTML = decimalNotation + " × 10<sup>" + resultExponent + "</sup>";

    let falseExponents = falseExponentsList();

    falseLabel = radioLabels[1];
    let falseExponent0 = falseExponents[0] + resultExponent;
    falseLabel.innerHTML = decimalNotation + " × 10<sup>" + falseExponent0 + "</sup>";

    falseLabel2 = radioLabels[2];
    let falseExponent1 = falseExponents[1] + resultExponent;
    falseLabel2.innerHTML = decimalNotation + " × 10<sup>" + falseExponent1 + "</sup>";
    
    for (i of randomOrder()) {
        divNumber.appendChild(radioInputs[i]);
        divNumber.appendChild(radioLabels[i]);
    }    
}

function checkEasyLevel() {
    /*
        Vérifie la réponse à une question de niveau 1.
    */
    // vérifie que l'un des choix est bien sélectionné
    inputChoosed = false;
    for (input of radioInputs) {
        if (input.checked) {
            inputChoosed = true;
            break;
        }
    }
    if (!inputChoosed) {
        return;
    }
    displayResultWindow(radioInputs[0].checked, newEasyLevel);
}



// ===== Niveau 2 =====

function intermediateLevel() {
    /*
        Affiche une question de niveau 2 : l'élève doit indiquer
        lui-même la bonne puissance de 10.
    */
    spanLevel.innerText = "Niveau 2";
    divQuestion.innerText = "Indiquer la bonne puissance de 10 :";
    
    divNumber.appendChild(exponentLabel);
    divNumber.appendChild(exponentInput);
    
    newIntermediateLevel();
    
    validateButton.addEventListener('mousedown', checkIntermediateLevel);
    
    container.appendChild(divExercise);
}

function newIntermediateLevel() {
    /*
        Affiche une nouvelle question de niveau 2.
    */
    draw();

    text = longNotation;
    text += " = ";
    text += decimalNotation;
    text += " × 10";
    exponentLabel.innerText = text;
    
    exponentInput.value = "";
    exponentInput.focus();
}

function checkIntermediateLevel() {
    /*
        Vérifie la réponse à une question de niveau 2.
    */
    // vérifie que les champs sont bien remplis
    if (isNaN(exponentInput.value) || exponentInput.value == "") {
        return;
    }
    displayResultWindow(
        exponentInput.value == resultExponent,
        newIntermediateLevel
    );
}



// ===== Niveau 3 =====

function hardLevel() {
    /*
        Affiche une question de niveau 3 : l'élève doit indiquer
        l'écriture scientifique complète, grâce à un champ prenant
        la valeur décimale et un champ prenant l'exposant.
    */
    spanLevel.innerText = "Niveau 3";
    divQuestion.innerText = "Donner l'écriture scientifique du nombre :";
    
    divNumber.appendChild(decimalLabel);
    divNumber.appendChild(decimalInput);
    divNumber.appendChild(exponentLabel);
    divNumber.appendChild(exponentInput);
    
    newHardLevel();
    
    validateButton.addEventListener('mousedown', checkHardLevel);
        
    container.appendChild(divExercise);
}

function newHardLevel() {
    /*
        Affiche une nouvelle question de niveau 3.
    */
    draw();
    
    decimalLabel.innerText = longNotation + " = ";
    decimalInput.value = "";
    exponentLabel.innerText = " × 10";
    exponentInput.value = "";
    decimalLabel.focus();
}

function checkHardLevel() {
    /*
        Vérifie la réponse à une question de niveau 3.
    */
    // vérifie que les champs sont bien remplis
    let resultDecimal = parseFloat(decimalNotation.replace(",", ".").replace(/ /g, ""));
    let decimalValue = parseFloat(decimalInput.value.replace(",", ".").replace(/ /g, ""));
    if (isNaN(decimalValue) || decimalValue == "" || isNaN(exponentInput.value) || exponentInput.value == "") {
        return;
    }
    displayResultWindow(
        exponentInput.value == resultExponent && decimalValue == resultDecimal,
        newHardLevel
    );
}



// ===== Fenêtre de résultat =====

const divResult = document.createElement("div");
divResult.setAttribute("class", "result");

const resultText = document.createElement("p");
resultText.setAttribute("class", "result_text");
divResult.appendChild(resultText);

const divResultButton = document.createElement("div");
divResultButton.setAttribute("class", "div_button");
const resultButton = document.createElement("span");
resultButton.setAttribute("class", "button");
resultButton.innerText = "Suivant";

// la fenêtre de résultat disparaît lorsque l'on clique sur le bouton
resultButton.addEventListener('mousedown', event => {
    divExercise.removeChild(divResult);
});

divResultButton.appendChild(resultButton);
divResult.appendChild(divResultButton);

function displayResultWindow(condition, newLevel) {
    if (condition) {
        // l'élève a donné une bonne réponse
        resultText.innerText = "Bonne réponse !";
        resultButton.innerText = "Suivant";
        resultButton.style.backgroundColor = 'rgba(0, 195, 20, 0.8)';
        resultButton.addEventListener('mousedown', newLevel);
    } else {
        // l'élève a donné une mauvaise réponse
        resultText.innerText = "Mauvaise réponse !";
        resultButton.innerText = "Réessayer";
        resultButton.style.backgroundColor = 'red';
        resultButton.removeEventListener('mousedown', newLevel);
    }
    divExercise.appendChild(divResult);
}



// ===== Choix du niveau =====

function clearElement(element) {
    /*
        Enlève tous les enfants de l'élément passé en argument.
    */
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function changeWindow(wrapper) {
    /*
        Décorateur pour les fonctions exécutées lors d'un changement
        de fenêtre (changement de niveau, retour au menu de sélection
        du niveau).
    */
    return function() {
        // vide les éléments
        clearElement(container);
        clearElement(divNumber);
        
        // suppression des écouteurs
        validateButton.removeEventListener('mousedown', checkEasyLevel);
        validateButton.removeEventListener('mousedown', checkIntermediateLevel);
        validateButton.removeEventListener('mousedown', checkHardLevel);
        
        // renvoie la fonction à exécuter
        const result = wrapper.apply(this, arguments);
        return result;
    }
}

function createDivLevel(level) {
    /*
        Ajoute à l'élément "divLevels" un élément div contenant
        le numéro du niveau. Un clic sur le div change la fenêtre
        pour afficher une question du niveau choisi.
        Argument : level est le numéro du niveau.
            - 1 : niveau facile ;
            - 2 : niveau intermédiaire ;
            - 3 : niveau difficile.
    */
    const divLevel = document.createElement("div");
    divLevel.setAttribute("class", "level_choice");
    divLevel.innerText = level;
    
    switch (level) {
        case 1:
            action = changeWindow(easyLevel);
            break;
        case 2:
            action = changeWindow(intermediateLevel);
            break;
        case 3:
            action = changeWindow(hardLevel);
            break;
    }
    divLevel.addEventListener('mousedown', action);
        
    divLevels.appendChild(divLevel);
}

const divSelectLevel = document.createElement("div");
divSelectLevel.setAttribute("class", "select_level");

const divChoose = document.createElement("div");
divChoose.setAttribute("class", "choose");
divChoose.innerText = "Choisir un niveau de difficulté";
divSelectLevel.appendChild(divChoose);

const divLevels = document.createElement("div");
divLevels.setAttribute("class", "levels");
divSelectLevel.appendChild(divLevels);

// création des éléments div pour les 3 niveaux
for (i = 1; i < 4; i++) {
    const divLevel = createDivLevel(i);
}

function displayLevelChoice() {
    /*
        Affiche le menu de sélection du niveau.
    */
    clearElement(container);
    resultButton.removeEventListener('mousedown', newEasyLevel);
    resultButton.removeEventListener('mousedown', newIntermediateLevel);
    resultButton.removeEventListener('mousedown', newHardLevel);
    container.appendChild(divSelectLevel);
}





//======================================
//           Initialisation
//======================================

displayLevelChoice();
// divExercise.appendChild(divResult);