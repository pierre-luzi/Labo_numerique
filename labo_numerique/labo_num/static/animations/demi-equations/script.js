/*
    --------------------------------
    | Demi-équations électroniques |
    --------------------------------

    Exercice interactif pour s'entraîner à ajuster
    des demi-équations électroniques.
*/



let index = 0;
let element = list[0];



// ===== Oxydant et réducteur =====

const oxydant = document.querySelector("#oxydant");
const reductant = document.querySelector("#reductant");



// ===== Coefficients stœchiométriques =====

const ox_input = document.querySelector("#ox_input");
const H_input = document.querySelector("#H_input")
const electron_input = document.querySelector("#electron_input");
const red_input = document.querySelector("#red_input");
const H2O_input = document.querySelector("#H2O_input");



// ===== Numéros de la méthodologie =====

const number1 = document.querySelector("#number1");
const oxRect = ox_input.getBoundingClientRect();
number1.style.top = (oxRect.top+30) + "px";
number1.style.left = oxRect.left + oxRect.width/2 + "px";

const number1p = document.querySelector("#number1p");
const redRect = red_input.getBoundingClientRect();
number1p.style.top = (redRect.top+30) + "px";
number1p.style.left = redRect.left + redRect.width/2 + "px";

const number2 = document.querySelector("#number2");
const H2ORect = H2O_input.getBoundingClientRect();
number2.style.top = (H2ORect.top+30) + "px";
number2.style.left = H2ORect.left + H2ORect.width/2 + "px";

const number3 = document.querySelector("#number3");
const HRect = H_input.getBoundingClientRect();
number3.style.top = (HRect.top+30) + "px";
number3.style.left = HRect.left + HRect.width/2 + "px";

const number4 = document.querySelector("#number4");
const electronRect = electron_input.getBoundingClientRect();
number4.style.top = (electronRect.top+30) + "px";
number4.style.left = electronRect.left + electronRect.width/2 + "px";



// ===== Messages de réussite ou d'échec =====

const correctAnswer = document.querySelector("#correct");
const wrongAnswer = document.querySelector("#wrong");
const congratsAlert = document.querySelector("#congrats");



// ===== Bouton de validation =====

const button = document.querySelector("#button");
button.addEventListener("mousedown", validate);



// ===== Fonctions =====

function initializeCoefficients() {
    /*
        Initialise les coefficients stœchiométriques de l'équation :
        1 pour l'oxydant, le réducteur et les électrons ; 0 pour les
        ions H+ et l'eau.
    */
    ox_input.value = 1;
    H_input.value = 0;
    electron_input.value = 1;
    red_input.value = 1;
    H2O_input.value = 0;
}

function initializeEquation() {
    /*
        Initialise l'équation de réaction en indiquant les formules
        de l'oxydant et du réducteur.
    */
    initializeCoefficients();
    
    element = list[index];
    oxydant.innerHTML = element['oxydant'];
    reductant.innerHTML = element['reductant'];
}

function checkCoefficients() {
    /*
        Vérifie les coefficients stœchiométriques.
    */
    if (parseInt(ox_input.value) != element['ox_coeff']) {
        return false;
    } else if (parseInt(H_input.value) != element['H_coeff']) {
        return false;
    } else if (parseInt(electron_input.value) != element['electron_coeff']) {
        return false;
    } else if (parseInt(red_input.value) != element['red_coeff']) {
        return false;
    } else if (parseInt(H2O_input.value) != element['H2O_coeff']) {
        return false;
    }
    return true;
}

function validate() {
    /*
        Valide l'équation de réaction.
    */
    if (!checkCoefficients()) {
        displayNotification(wrongAnswer);
    } else if (index+1 < list.length) {
            displayNotification(correctAnswer);
            index++;
            initializeEquation();
    } else {
        displayNotification(congratsAlert);
    }
}

function displayNotification(notificationDiv) {
    /*
        Affiche le message de réussite ou d'échec.
    */
    notificationDiv.className = "notification visible_notification";
    
    let id = null;
    clearInterval(id);
    if (notificationDiv != congratsAlert) {
        id = setInterval(display, 1500);
        function display() {
            clearInterval(id);
            notificationDiv.className = "notification hidden_notification";
        }
    }
}



// ===== Initialisation =====

shuffleArray(list);
initializeEquation();