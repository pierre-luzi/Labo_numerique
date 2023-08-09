//==============================
//       Canvas graphiques
//==============================

canvasGraphes = document.getElementById("plots_canvas");
stageGraphes = new createjs.Stage(canvasGraphes);

function xlegend(y, name) {
    legend = new createjs.Text("temps", "20px Quicksand", "#333");
    legend.x = xmax + 60;
    legend.y = y;
    legend.name = name;
    legend.textBaseline = "middle"
    stageGraphes.addChild(legend);
}

// Limites du graphe
const xmax = 500;

// ===== Premier signal =====
let graphe1 = new createjs.Container();
stageGraphes.addChild(graphe1);
graphe1.x = 50;
graphe1.y = 70;

let axes = new createjs.Shape();
graphe1.addChild(axes);
axes.graphics.ss(3, 1, 1).s('#000').mt(-10, 0).lt(xmax, 0).mt(xmax-10, -10).lt(xmax, 0).lt(xmax-10, 10);    // axe horizontal
axes.graphics.ss(3, 1, 1).s('#000').mt(0, -60).lt(0, 60).mt(-10, -50).lt(0, -60).lt(10, -50);               // axe vertical

xlegend(70, "xlegend1");

let signal1 = new createjs.Shape();
graphe1.addChild(signal1);

// ===== Second signal =====
let graphe2 = new createjs.Container();
stageGraphes.addChild(graphe2);
graphe2.x = 50;
graphe2.y = 200;

axes = new createjs.Shape();
graphe2.addChild(axes);
axes.graphics.ss(3, 1, 1).s('#000').mt(-10, 0).lt(xmax, 0).mt(xmax-10, -10).lt(xmax, 0).lt(xmax-10, 10);    // axe horizontal
axes.graphics.ss(3, 1, 1).s('#000').mt(0, -60).lt(0, 60).mt(-10, -50).lt(0, -60).lt(10, -50);               // axe vertical

xlegend(200, "xlegend2");

let signal2 = new createjs.Shape();
graphe2.addChild(signal2);

// ===== Somme des signaux =====
let grapheSomme = new createjs.Container();
stageGraphes.addChild(grapheSomme);
grapheSomme.x = 50;
grapheSomme.y = 370;

axes = new createjs.Shape();
grapheSomme.addChild(axes);
axes.graphics.ss(3, 1, 1).s('#000');
axes.graphics.mt(-10, 0).lt(xmax, 0).mt(xmax-10, -10).lt(xmax, 0).lt(xmax-10, 10);    // axe horizontal
axes.graphics.ss(3, 1, 1).s('#000').mt(0, -100).lt(0, 100);
axes.graphics.mt(-10, -90).lt(0, -100).lt(10, -90);          // axe vertical

xlegend(370, "xlegend_somme");


// somme des signaux 1 et 2
let somme = new createjs.Shape();
grapheSomme.addChild(somme);

// enveloppes de la somme des signaux 1 et 2
let enveloppe1 = new createjs.Shape();
grapheSomme.addChild(enveloppe1);

let enveloppe2 = new createjs.Shape();
grapheSomme.addChild(enveloppe2);

const amplitude = 40;

function traceSignal(signal, frequence, color) {
    /*
        Trace une fonction sinus de fréquence donnée,
        à la color indiquée.
        Arguments :
            - signal : l'élément Shape contenant le signal à tracer ;
            - frequence : la fréquence du signal ;
            - color : la color du signal.
    */
    signal.graphics.clear();
    signal.graphics.ss(3).s(color);
    signal.graphics.mt(0, -amplitude * Math.sin(2 * Math.PI * frequence * 0 / xmax * 0.020));
    for (i = 1; i < xmax; i++) {
        signal.graphics.lt(i, -amplitude * Math.sin(2 * Math.PI * frequence * i / xmax * 0.020));
    }
    signal.graphics.es();
}

function traceSomme() {
    /*
        Cette fonction trace la somme des deux signaux harmoniques,
        ainsi que l'enveloppe des battements.
    */
    somme.graphics.clear();
    enveloppe1.graphics.clear();
    enveloppe2.graphics.clear();
        
    somme.graphics.ss(3).s('purple');
    somme.graphics.mt(
        0,
        -amplitude * Math.sin(2 * Math.PI * f1 * 0 / (2 * xmax) * 0.050)
        - amplitude * Math.sin(2 * Math.PI * f2 * 0 / (2 * xmax) * 0.050)
    );
    for (i = 1; i < xmax; i++) {
        somme.graphics.lt(
            i,
            -amplitude * Math.sin(2 * Math.PI * f1 * i / (2 * xmax) * 0.050)
            - amplitude * Math.sin(2 * Math.PI * f2 * i / (2 * xmax) * 0.050)
        );
    }
    
    enveloppe1.graphics.ss(1).s('green');
    enveloppe1.graphics.setStrokeDash([5,6]);
    enveloppe1.graphics.mt(0, 2 * amplitude * Math.cos(Math.PI * (f1 - f2) * 0 / (2 * xmax) * 0.050));
    for (i = 1; i < xmax; i++) {
        enveloppe1.graphics.lt(i, 2 * amplitude * Math.cos(Math.PI * (f1 - f2) * i / (2 * xmax) * 0.050));
    }
    
    enveloppe2.graphics.ss(1).s('green');
    enveloppe2.graphics.setStrokeDash([5,6]);
    enveloppe2.graphics.mt(0, -2 * amplitude * Math.cos(Math.PI * (f1 - f2) * 0 / (2 * xmax) * 0.050));
    for (i = 1; i < xmax; i++) {
        enveloppe2.graphics.lt(i, -2 * amplitude * Math.cos(Math.PI * (f1 - f2) * i / (2 * xmax) * 0.050));
    }
}





//==============================
//       Canvas curseurs
//==============================

canvasCurseurs = document.getElementById("cursors_canvas");
cursorsStage = new createjs.Stage(canvasCurseurs);
cursorsStage.enableMouseOver();
createjs.Touch.enable(cursorsStage);
cursorsStage.mouseMoveOutside = true;

const xminCursor = 130;    // position de l'extrémité gauche des curseurs
const xmaxCursor = xminCursor + lineLength;
let f1 = 440;
let f2 = 440;



// ===== Curseur pour la fréqence du signal 1 =====

const yF1 = 70;     // position verticale du curseur

// création du curseur
cursorLine(xminCursor, yF1, cursorsStage);
cursorText("Signal 1", xminCursor-90, yF1, cursorsStage);
cursorText("Hz", xmaxCursor+60, yF1, cursorsStage);
const f1Button = cursorButton('red', xminCursor+0.5*lineLength, yF1, cursorsStage);
const f1Text = cursorText("", xmaxCursor+50, yF1, cursorsStage);
f1Text.textAlign = 'right';

const f1Span = document.querySelector("#freq1");

// valeurs limites
const minF1 = 240;
const maxF1 = 640;
getF1();

function getF1() {
    /*
        Récupère la valeur de C0 à partir de la position du curseur
        et met à jour l'affichage de la valeur.
    */
    f1 = (f1Button.x - xminCursor) / lineLength * (maxF1 - minF1) + minF1;
    text = f1.toLocaleString('fr-FR', {maximumFractionDigits: 0});
    f1Text.text = text;
    f1Span.innerText = text;
    traceSignal(signal1, f1, 'red');
}



// ===== Curseur pour la fréqence du signal 2 =====

const yF2 = 200;     // position verticale du curseur

// création du curseur
cursorLine(xminCursor, yF2, cursorsStage);
cursorText("Signal 2", xminCursor-90, yF2, cursorsStage);
cursorText("Hz", xmaxCursor+60, yF2, cursorsStage);
const f2Button = cursorButton('blue', xminCursor+0.5*lineLength, yF2, cursorsStage);
const f2Text = cursorText("", xmaxCursor+50, yF2, cursorsStage);
f2Text.textAlign = 'right';

const f2Span = document.querySelector("#freq2");

// valeurs limites
const minF2 = 240;
const maxF2 = 640;
getF2();

function getF2() {
    /*
        Récupère la valeur de C0 à partir de la position du curseur
        et met à jour l'affichage de la valeur.
    */
    f2 = (f2Button.x - xminCursor) / lineLength * (maxF2 - minF2) + minF2;
    text = f2.toLocaleString('fr-FR', {maximumFractionDigits: 0});
    f2Text.text = text;
    f2Span.innerText = text;
    traceSignal(signal2, f2, 'blue');
}



// ===== Mise à jour =====

function onMouseDown(event) {
    object = event.currentTarget;
    object.offsetX = object.x - event.stageX;
}

function onPressMove(event) {
    /*
    Cette fonction met à jour le curseur et les graphes lors du déplacement d'un bouton.
    */
    button = event.currentTarget;
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xmaxCursor);
    update();
}

const fmSpan = document.querySelector("#fm");
const dfSpan = document.querySelector("#df");

function update() {
    getF1();
    getF2();
    fmSpan.innerText = ((f1+f2)/2).toLocaleString('fr-FR', {maximumFractionDigits: 0});
    dfSpan.innerText = (Math.abs(f1-f2)/2).toLocaleString('fr-FR', {maximumFractionDigits: 0});
    traceSomme();
    cursorsStage.update();
    stageGraphes.update();
}

// ajout des écouteurs
f1Button.addEventListener("mousedown", onMouseDown);
f1Button.addEventListener("pressmove", onPressMove);

f2Button.addEventListener("mousedown", onMouseDown);
f2Button.addEventListener("pressmove", onPressMove);





// ===== Initialisation =====

update();
// traceSignal(signal1, f1, 'red');
// traceSignal(signal2, f2, 'blue');
// traceSomme();

// cursorsStage.update();
// stageGraphes.update();