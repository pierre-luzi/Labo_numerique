const questionnaire = document.getElementById("questionnaire");

function randomNumber(maxNumber=10000) {
    /*
        Renvoie un nombre compris entre 1 et maxNumber.
    */
    return Math.floor(Math.random() * maxNumber) + 1;
}

function createLabel(number1, number2, i) {
    /*
        Renvoie un label de formulaire affichant le calcul à effectuer.
    */
    let calculLabel = document.createElement("label");
    calculLabel.setAttribute("class", "label");
    calculLabel.setAttribute("for", "calcul" + i);
    
    if (type_punition == 'addition') {
        calculLabel.innerText = number1 + " + " + number2 + " = ";
    } else if (type_punition == 'multiplication') {
        calculLabel.innerText = number1 + " × " + number2 + " = ";
    }
    
    return calculLabel;
}

function createInput(result, i) {
    /*
        Renvoie un input de formulaire devant recevoir le résultat
        du calcul.
        Selon que la valeur de l'input est correcte ou non, le
        style de l'input diffère grâce à sa classe.
    */
    let calculInput = document.createElement("input");
    calculInput.setAttribute("type", "text");
    calculInput.setAttribute("name", "calcul" + i);
    calculInput.setAttribute("id", "calcul" + i);
    
    // ajout d'un écouteur pour valider ou non la réponse
    calculInput.addEventListener('keyup', function(event) {
        /*
            La fonction modifie la classe de l'input.
            Le style est géré dans le fichier CSS :
                - les inputs corrects apparaissent en vert ;
                - les inputs incorrects apparaissent en rouge.
        */
        if (event.target.value == result) {
            event.target.className = 'correct';
            return true;
        } else {
            event.target.className = 'incorrect';
            return false;
        }
    });
    
    return calculInput;
}

function createEntry(number1, number2, result, i) {
    /*
        Crée une entrée du questionnaire, incluant le label et
        l'input.
    */
    let paragraph = document.createElement("p");
    questionnaire.appendChild(paragraph);

    let calculLabel = createLabel(number1, number2, i);
    paragraph.appendChild(calculLabel);
    
    let calculInput = createInput(result, i);
    paragraph.appendChild(calculInput);
}

const questionsNumber = 20;
for (let i = 0; i < questionsNumber; i++) {
    // === Tirage aléatoire des nombres et choix du calcul === //
    let number1 = randomNumber();
    let number2 = randomNumber();
    let result = 0;

    if (type_punition == 'addition') {
        result = number1 + number2;
    } else if (type_punition == 'multiplication') {
        result = number1 * number2;
    }
    
    createEntry(number1, number2, result, i);
}



//======================================
//        Bouton de validation
//======================================

const bouton = document.getElementById("bouton");
const button = document.createElement("input");
button.setAttribute("type", "submit");
button.setAttribute("value", "Valider le travail");
button.setAttribute("class", "visible_button");

// vérification des inputs
const inputs = questionnaire.querySelectorAll('input');
function isFormCorrect () {
    for (input of inputs) {
        if (input.className != 'correct') {
            return false;
        }
    }
    return true;
}

// ajout d'un écouteur pour vérifier si le questionnaire est correct
let isButtonVisible = false;
document.addEventListener('keyup', function(event) {
    if (isFormCorrect() && !isButtonVisible) {
        bouton.appendChild(button);
        isButtonVisible = true;
    } else if (!isFormCorrect() && isButtonVisible) {
        bouton.removeChild(button);
        isButtonVisible = false;
    }
});