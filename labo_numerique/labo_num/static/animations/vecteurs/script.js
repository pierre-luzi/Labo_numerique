//==============================
//       Canvas graphique
//==============================

canvas = document.querySelector("#canvas");
stage = new createjs.Stage(canvas);
stage.enableMouseOver();
createjs.Touch.enable(stage);
stage.mouseMoveOutside = true;



// ===== Création d'une grille ====

grid = new createjs.Shape();
stage.addChild(grid);

// grille secondaire
grid.graphics.ss(1, 1, 1).s('#aaa');
for (let x = -360; x <= 360; x += 20) {
    grid.graphics.mt(x, -230).lt(x, 230);
}
for (let y = -200; y <= 200; y += 20) {
    grid.graphics.mt(-380, y).lt(380, y);
}

// grille principale
grid.graphics.ss(2, 1, 1).s('black');
for (let x = -360; x <= 360; x += 40) {
    grid.graphics.mt(x, -230).lt(x, 230);
}
for (let y = -200; y <= 200; y += 40) {
    grid.graphics.mt(-380, y).lt(380, y);
}

// axes
grid.graphics.ss(3, 1, 1).s('black');

// axe des abscisses
grid.graphics.mt(-380, 0).lt(380, 0);
grid.graphics.mt(370, 10).lt(380, 0).lt(370, -10);

xText = new createjs.Text("x", "20px Quicksand", 'black');
xText.x = 790;
xText.y = 260;
xText.textBaseline = 'middle';
stage.addChild(xText);

// axe des ordonnées
grid.graphics.mt(0, -230).lt(0, 230);
grid.graphics.mt(-10, -220).lt(0, -230).lt(10, -220);

yText = new createjs.Text("y", "20px Quicksand", 'black');
yText.x = 400;
yText.y = 10;
yText.textBaseline = 'middle';
yText.textAlign = 'center';
stage.addChild(yText);

// position de la grille
grid.x = 400;
grid.y = 260;

// vecteurs unitaires
grid.graphics.s('red');
grid.graphics.mt(0, 0).lt(40, 0);
grid.graphics.mt(30, -10).lt(40, 0).lt(30, 10);

grid.graphics.s('green');
grid.graphics.mt(0,0).lt(0, -40);
grid.graphics.mt(-10, -30).lt(0, -40).lt(10, -30);



// ===== Vecteur ====

let xStart = 0;
let yStart = 0;
let xEnd = 0;
let yEnd = 0;
let fixedToOrigin = false;
let showComponents = true;

vector = new createjs.Shape();
vector.graphics.ss(3, 1, 1).s('red');
vector.x = 400;
vector.y = 260;
stage.addChild(vector);

function clearVector() {
    vector.graphics.clear();
    vector.graphics.ss(3, 1, 1);
}

function newExercise() {
    clearVector();
        
    if (!fixedToOrigin) {
        // tirage au sort des coordonnées de départ
        xStart = (Math.floor(Math.random() * 36) - 18) * 20;
        yStart = (Math.floor(Math.random() * 20) - 10) * 20;
    }
    
    // tirage au sort des coordonnées d'arrivée
    xEnd = xStart;
    yEnd = yStart;
    while (xEnd == xStart && yEnd == yStart) {
        xEnd = (Math.floor(Math.random() * 36) - 18) * 20;
        yEnd = (Math.floor(Math.random() * 20) - 10) * 20;
    }
    
    if (showComponents) {
        if (xEnd != xStart && yEnd != yStart) {
            drawVector(vector, xStart, -yStart, xEnd, -yStart, 'purple', dashed=true);
            drawVector(vector, xEnd, -yStart, xEnd, -yEnd, 'purple', dashed=true);
        }
    }
    drawVector(vector, xStart, -yStart, xEnd, -yEnd, 'blue');
    
    stage.update();
}





//==============================
//          Exercice
//==============================

button = document.querySelector("#button");
xAnswer = document.querySelector("#x_answer");
yAnswer = document.querySelector("#y_answer");
button.addEventListener("mousedown", validate);

for (input of document.querySelectorAll('input[type="text"]')) {
    input.addEventListener("keypress", function(event) {
        if (event.key == 'Enter') {
            validate();
        }
    });
}

function validate() {
    if (
        parseFloat(xAnswer.value.replace(",", ".") * 40) == (xEnd - xStart)
        && parseFloat(yAnswer.value.replace(",", ".")) * 40 == (yEnd - yStart)
    ) {
        xAnswer.value = "";
        yAnswer.value = "";
        displayNotification(correctAnswer);
    } else if (xAnswer.value != "" && yAnswer.value != "") {
        // TO-DO : afficher message d'erreur
        // si les valeurs entrées ne sont pas des nombres
        displayNotification(wrongAnswer);
    }
}



// ===== Notification ====

correctAnswer = document.querySelector("#correct");
wrongAnswer = document.querySelector("#wrong");

function displayNotification(notificationDiv) {
    notificationDiv.className = "notification visible_notification";
    
    let id = null;
    clearInterval(id);
    id = setInterval(display, 1500);
    function display() {
        clearInterval(id);
        notificationDiv.className = "notification hidden_notification";
        if (notificationDiv == correctAnswer) {
            newExercise();
        }
    }
}



//==============================
//          Paramètres
//==============================

// ===== Afficher les composants du vecteur ====

document.querySelector("#components_yes").addEventListener(
    "change",
    function(event) {
        if (this.checked) {
            showComponents = true;
            if (xEnd != xStart && yEnd != yStart) {
                drawVector(vector, xStart, -yStart, xEnd, -yStart, 'purple', dashed=true);
                drawVector(vector, xEnd, -yStart, xEnd, -yEnd, 'purple', dashed=true);
            }
            stage.update();
        }
    }
);

document.querySelector("#components_no").addEventListener(
    "change",
    function(event) {
        showComponents = false;
        if (this.checked) {
            clearVector();
            drawVector(vector, xStart, -yStart, xEnd, -yEnd, 'blue');
            stage.update();
        }
    }
);



// ===== Placer le vecteur à l'origine du repère ====

document.querySelector("#origin_yes").addEventListener(
    "change",
    function(event) {
        if (this.checked) {
            fixedToOrigin = true;
            xStart = 0;
            yStart = 0;
            newExercise();
        }
    }
);

document.querySelector("#origin_no").addEventListener(
    "change",
    function(event) {
        if (this.checked) {
            fixedToOrigin = false;
            
        }
    }
);






//==============================
//       Initialisation
//==============================

document.querySelector("#components_yes").checked = true;
document.querySelector("#origin_no").checked = true;
newExercise();