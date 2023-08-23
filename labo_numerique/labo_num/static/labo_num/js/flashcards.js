//==============================
//      Gestion des cartes
//==============================

const cardsContainer = document.querySelector("#cards");
const cards = [];
for (card of document.querySelectorAll(".flashcard")) {
    cards.push(card);
    card.addEventListener("click", flipCard);
}
cardsNumber = cards.length;

function flipCard() {
    /*
        Retourne la flashcard.
    */
    if (this.className == "flashcard") {
        this.className += " rotated";
    } else {
        this.className = "flashcard";
    }
}

shuffleArray(cards);
let currentIndex = 0;
let currentCard = cards[0];
currentCard.style.display = 'inline-block';



//==============================
//          Validation
//==============================

const wrong = document.querySelector("#wrong");
const correct = document.querySelector("#correct");
// let wrongNumber = 0;
// let correctNumber = 0;

let wrongScore = document.querySelector("#wrong_score");
wrongScore.innerText = 0;
wrongRect = wrong.getBoundingClientRect();
wrongScore.style.width = wrongRect.width + "px";
wrongScore.style.top = (wrongRect.top - 40) + "px";
wrongScore.style.left = wrongRect.left + "px";

let correctScore = document.querySelector("#correct_score");
correctScore.innerText = 0;
correctRect = correct.getBoundingClientRect();
correctScore.style.width = correctRect.width + "px";
correctScore.style.top = (correctRect.top - 40) + "px";
correctScore.style.left = correctRect.left + "px";

let interval = null;

function nextCard(correct) {
    /*
        Passe à la carte suivante.
    */
    removeSwipeListeners();
    
    // incrémente le score
    if (correct) {
        // correctNumber++;
        // correctScore.innerText = correctNumber;
        correctScore.innerText++;
    } else {
        // wrongNumber++;
        // wrongScore.innerText = wrongNumber;
        wrongScore.innerText++;
    }
    
    // passage à la carte suivante
    let oldCard = currentCard;
    currentIndex++;
    if (currentIndex < cardsNumber) {
        currentCard = cards[currentIndex];
    } else {
        if (wrongScore.innerText != 0) {
            currentCard = document.querySelector(".last_card_wrong");
        } else {
            currentCard = document.querySelector(".last_card_correct");
        }
    }
    currentCard.style.display = 'inline-block';
    oldCard.style.zIndex = 15;
    currentCard.style.zIndex = 10;
    
    
    // initialisation de l'animation
    let deltaTime = 10;
    let time = 0;
    clearInterval(interval);
    interval = setInterval(swipe, deltaTime);

    function swipe() {
        /*
            Déplace la carte :
                - vers la gauche si correct = false ;
                - vers la droite si correct = true.
        */
        time += deltaTime;
        if (correct) {
            oldCard.style.transform = "translateX(" + 1.2*time + "px)" + " rotateZ(" + (time%10000)/10000 + "turn)";
        } else {
            oldCard.style.transform = "translateX(" + -1.2*time + "px)" + " rotateZ(" + -(time%10000)/10000 + "turn)";
        }
        if (time > 0.8 * window.screen.width) {
            clearInterval(interval);
            oldCard.style.display = 'none';
            console.log(currentIndex+1);
            console.log(cardsNumber);
            if (currentIndex < cardsNumber) {
                console.log(currentIndex + " " + cardsNumber);
                addSwipeListeners();
            } else {
                removeSwipeListeners();
            }
        }
    }
}

let swipeRight = nextCard.bind(null, true);
let swipeLeft = nextCard.bind(null, false);

function addSwipeListeners() {
    /*
        Active les écouteurs pour les boutons de validation.
    */
    correct.addEventListener("click", swipeRight, true);
    wrong.addEventListener("click", swipeLeft, true);
}

function removeSwipeListeners() {
    /*
        Désactive les écouteurs pour les boutons de validation.
    */
    correct.removeEventListener("click", swipeRight, true);
    wrong.removeEventListener("click", swipeLeft, true);
}

addSwipeListeners();