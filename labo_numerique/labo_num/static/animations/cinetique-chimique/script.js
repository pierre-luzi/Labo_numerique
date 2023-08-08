//==============================
//       Canvas curseurs
//==============================

cursorsCanvas = document.getElementById("cursors_canvas");
cursorsStage = new createjs.Stage(cursorsCanvas);
cursorsStage.enableMouseOver();
createjs.Touch.enable(cursorsStage);
cursorsStage.mouseMoveOutside = true;

const xminCursor = 260;    // position de l'extrémité gauche des curseurs
const xmaxCursor = xminCursor + lineLength;
let C0 = 0.6;
let k = 0.02;



// ===== Curseur pour la concentration initiale =====

const yC0 = 30;     // position verticale du curseur

// création du curseur
cursorLine(xminCursor, yC0, cursorsStage);
cursorText("Concentration initiale C₀", xminCursor-240, yC0, cursorsStage);
cursorText("mol.L⁻¹", xmaxCursor+78, yC0, cursorsStage);
const C0Button = cursorButton('blue', xminCursor+0.5*lineLength, yC0, cursorsStage);
const C0Text = cursorText("", xmaxCursor+75, yC0, cursorsStage);
C0Text.textAlign = 'right';

// valeurs limites
const minC0 = 0.2;
const maxC0 = 1;
getC0();

function getC0() {
    /*
        Récupère la valeur de C0 à partir de la position du curseur
        et met à jour l'affichage de la valeur.
    */
    C0 = (C0Button.x - xminCursor) / lineLength * (maxC0 - minC0) + minC0;
    C0Text.text = C0.toLocaleString('fr-FR', {maximumFractionDigits: 2});
}



// ===== Curseur pour la concentration initiale =====

const yK = 60;     // position verticale du curseur

// création du curseur
cursorLine(xminCursor, yK, cursorsStage);
cursorText("Constante de vitesse k", xminCursor-240, yK, cursorsStage);
const kUnitText = cursorText("s⁻¹", xmaxCursor+78, yK, cursorsStage);
const kButton = cursorButton('orange', xminCursor+0.5*lineLength, yK, cursorsStage);
const kText = cursorText("", xmaxCursor+75, yK, cursorsStage);
kText.textAlign = 'right';

// valeurs limites
const minK = 0.002;
const maxK = 0.02;
getK();

function getK() {
    /*
        Récupère la valeur de k à partir de la position du curseur
        et met à jour l'affichage de la valeur.
    */
    k = (kButton.x - xminCursor) / lineLength * (maxK - minK) + minK;
    kText.text = k.toLocaleString('fr-FR', {maximumFractionDigits: 4});
}



// ===== Fonctions de mise à jour =====

function onMouseDown(event) {
    /*
        Lors d'un clic sur un bouton, enregistre l'offset entre
        la position du clic et du bouton.
    */
    object = event.currentTarget;
    object.offsetX = object.x - event.stageX;
}

function onPressMove(event) {
    /*
        Action lors du déplacement d'un curseur.
    */
    button = event.currentTarget;
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xminCursor+lineLength);
    getC0();
    getK();
    cursorsStage.update();
    drawPlot();
    drawPointer();
    updateConcentrationEquation();
    plotsStage.update();
}

function updateConcentrationEquation() {
    for (C0Span of document.querySelectorAll(".C0")) {
        C0Span.innerText = C0Text.text;
    }
    
    for (kSpan of document.querySelectorAll(".k")) {
        kSpan.innerText = kText.text;
    }
}

// écouteurs
C0Button.addEventListener("mousedown", onMouseDown);
C0Button.addEventListener("pressmove", onPressMove);

kButton.addEventListener("mousedown", onMouseDown);
kButton.addEventListener("pressmove", onPressMove);





//==============================
//       Canvas graphiques
//==============================

canvasGraphe = document.getElementById("plot_canvas");
plotsStage = new createjs.Stage(canvasGraphe);



// ===== Création du graphe =====

const xmax = 550;

plot = new createjs.Container();
plotsStage.addChild(plot);
plot.x = 100;
plot.y = 300;

axes = new createjs.Shape();
plot.addChild(axes);
axes.graphics.ss(3, 1, 1).s('#000')



// ===== Axe des abscisses =====

axes.graphics.mt(0, 0).lt(xmax, 0);
axes.graphics.mt(xmax-10, -10).lt(xmax, 0).lt(xmax-10, 10);

xlegend = new createjs.Text("temps", "20px Quicksand", 'black');
xlegend.x = xmax + 60;
xlegend.y = 320;
xlegend.name = "xlegend";
xlegend.textBaseLine = "middle";
plotsStage.addChild(xlegend);



// ===== Axe des ordonnées =====

axes.graphics.mt(0, 0).lt(0, -240);
axes.graphics.mt(-10, -230).lt(0, -240).lt(10, -230);

ylegend = new createjs.Text("concentration", "20px Quicksand", 'black');
ylegend.x = 50;
ylegend.y = 25;
ylegend.name = "ylegend";
plotsStage.addChild(ylegend);



// ===== Tracé de la courbe =====

courbe = new createjs.Shape();
plot.addChild(courbe);

function drawPlot() {
    /*
        Cette fonction trace la courbe représentant la concentration
        du réactif en fonction du temps.
    */
    courbe.graphics.clear();
    
    let amplitude = C0 * facteur_concentration;
    courbe.graphics.ss(3).s('red').mt(0, -amplitude);
    
    switch (ordre) {
        case 0:
            for (i = 1; i < xmax; i++) {
                y = facteur_concentration * (C0 - k * i);
                courbe.graphics.lt(i, -y);
                if (y < 0) { break; }
            }
            break;
        case 1:
            for (i = 1; i < xmax; i++) {
                courbe.graphics.lt(i, -amplitude * Math.exp(-k * i));
            }
            break;
        case 2:
            for (i = 1; i < xmax; i++) {
                courbe.graphics.lt(i, -facteur_concentration * C0 / (1 + 2 * C0 * k * i));
            }
            break;
    }
    
    courbe.graphics.es();
}



// ===== Tracé du pointeur =====

pointeur = new createjs.Shape();
plot.addChild(pointeur);

pointeurXLabel = new createjs.Text("t", "20px Quicksand", 'green');
plot.addChild(pointeurXLabel);

pointeurXLabel2 = new createjs.Text("1/2", "12px Quicksand", 'green');
plot.addChild(pointeurXLabel2);

pointeurYLabel = new createjs.Text("C₀/2", "20px Quicksand", 'green');
plot.addChild(pointeurYLabel);

function tempsDemiReaction() {
    /*
        Cette fonction renvoie la valeur du temps de demi-réaction,
        calculée en fonction de l'ordre de réaction.
    */
    switch (ordre) {
        case 0:
            return C0 / (2 * k);
        case 1:
            return Math.log(2) / k;
        case 2:
            return 1. / (2 * k * C0);
    }
}

function drawPointer() {
    /*
        Trace deux droites sur le graphique permettant de repérer
        le point de la courbe correspond à la demi-réaction.
    */
    
    // calcul des coordonnées
    temps_demi_reaction = tempsDemiReaction();
    x = temps_demi_reaction;
    y = -C0 * facteur_concentration * 0.5;
    
    // tracé des deux droites
    pointeur.graphics.clear();
    pointeur.graphics.setStrokeDash([5,6]).s('green').mt(x, 0).lt(x, y).lt(0, y);
    
    // pointeur t1/2
    pointeurXLabel.x = x-4;
    pointeurXLabel.y = 5;
    pointeurXLabel2.x = x+3;
    pointeurXLabel2.y = 15;
    
    // pointeur C0/2
    pointeurYLabel.x = -50;
    pointeurYLabel.y = y-10;
}





//==============================
//          Ordre
//==============================

const concentrationEquations = [
    document.getElementById("loi_concentration0"),
    document.getElementById("loi_concentration1"),
    document.getElementById("loi_concentration2"),
]

function updateUnit() {
    /*
        Met à jour l'unité de la constante de vitesse,
        en fonction de l'ordre de réaction.
    */
    switch (ordre) {
        case 0:
            kUnitText.text = "mol.L⁻¹.s⁻¹";
            break;
        case 1:
            kUnitText.text = "s⁻¹";
            break;
        case 2:
            kUnitText.text = "L.mol⁻¹.s⁻¹";
            break;
    }
}

const rateEquation = document.querySelector("#rate_equation");

function updateRateLaw() {
    /*
        Met à jour la formule de la loi de vitesse.
    */
    switch (ordre) {
        case 0:
            rateEquation.innerHTML = "v = k";
            break;
        case 1:
            rateEquation.innerHTML = "v = k &times; C";
            break;
        case 2:
            rateEquation.innerHTML = "v = k &times; C<sup>2</sup>";
            break;
    }
}

const halfLifeNumerator = document.querySelector("#half_life_numerator");
const halfLifeDenominator = document.querySelector("#half_life_denominator");

function updateHalfLifeEquation() {
    /*
        Met à jour la formule du temps de demi-réaction.
    */
    switch (ordre) {
        case 0:
            halfLifeNumerator.innerHTML = "C₀";
            halfLifeDenominator.innerHTML = "2 &times; k";
            halfLifeNumerator.style.borderBottom = 'solid black 0';
            halfLifeDenominator.style.borderTop = 'solid black 2px';
            break;
        case 1:
            halfLifeNumerator.innerHTML = "ln 2";
            halfLifeDenominator.innerHTML = "k";
            halfLifeNumerator.style.borderBottom = 'solid black 2px';
            halfLifeDenominator.style.borderTop = 'solid black 0';
            break;
        case 2:
            halfLifeNumerator.innerHTML = "1";
            halfLifeDenominator.innerHTML = "2 &times; k &times; C₀";
            halfLifeNumerator.style.borderBottom = 'solid black 0';
            halfLifeDenominator.style.borderTop = 'solid black 2px';
            break;
    }
}

const inputs = document.querySelectorAll("input");
inputs[1].checked = true;

for (input of inputs) {
    /*
        Ajout d'écouteurs pour les radio buttons
        permettant de choisir l'ordre de réaction.
    */
    input.addEventListener("change", function(event) {
        if (this.checked) {
            ordre = parseInt(this.value);
                        
            for (let i = 0; i < 3; i++) {
                if (i == ordre) {
                    // rend visible les textes pour l'ordre sélectionné
                    // lois_vitesse[i].setAttribute("class", "visible");
                    concentrationEquations[i].style.display = 'flex';
                } else {
                    // rend invisible les textes pour les autres ordres
                    // lois_vitesse[i].setAttribute("class", "hidden");
                    concentrationEquations[i].style.display = 'none';
                }
            }
        }
        
        updateUnit();
        updateRateLaw();
        updateHalfLifeEquation();
        drawPlot();
        drawPointer();
        cursorsStage.update();
        plotsStage.update();
    });
}



// ===== Initialisation =====

let ordre = 1;
let temps_demi_reaction = Math.log(2) / k;

const facteur_concentration = 220;          // facteur multiplicatif pour tracer le graphe
drawPlot();
drawPointer();
updateConcentrationEquation();
updateRateLaw();
updateHalfLifeEquation();

cursorsStage.update();
plotsStage.update();