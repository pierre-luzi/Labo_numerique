/*
    --------------------------------
    |          Avancement          |
    --------------------------------

    Simulation de l'avancement d'une transformation chimique.
    La transformation est celle entre le fer et le dioxygène, formant
    de l'oxyde de fer Fe2O3.
    Il est possible de changer les quantités de matière initiales des
    réactifs. L'avancement maximal de la réaction est calculé et la
    courbe représentant l'évolution des quantités de matière est tracée.
*/



//==============================
//  Tableau et avancement max
//==============================

let n0_Fe = 9;
let n0_O2 = 8;

const Fe_input = document.querySelector("#Fe_input");
const O2_input = document.querySelector("#O2_input");

const spans_Fe = document.querySelectorAll(".ini_Fe");
const spans_O2 = document.querySelectorAll(".ini_O2");

let xmax = 5;
let xmaxFe = 5;
let xmaxO2 = 5;
let limiting = 'Fe';

function computeXMax() {
    /*
        Calcule l'avancement maximal.
    */
    xmaxFe = n0_Fe / 3;
    xmaxO2 = n0_O2 / 2;
    xmax = Math.min(xmaxFe, xmaxO2);
    
    document.querySelector("#xmax_Fe").innerHTML = xmaxFe.toLocaleString('fr-FR', {maximumFractionDigits: 3});
    document.querySelector("#xmax_O2").innerHTML = xmaxO2.toLocaleString('fr-FR', {maximumFractionDigits: 3});
    document.querySelector("#xmax").innerHTML = xmax.toLocaleString('fr-FR', {maximumFractionDigits: 3});
    
    if (xmaxFe < xmaxO2) {
        limiting = 'Fe';
    } else if (xmaxFe > xmaxO2) {
        limiting = 'O2';
    } else {
        limiting = 'both';
    }
}

function setIronInitialConditions() {
    /*
        Modifie les conditions initiales pour le fer.
    */
    n0_Fe = Fe_input.value;
    for (span of spans_Fe) {
        span.innerHTML = parseFloat(n0_Fe).toLocaleString('fr-FR', {maximumFractionDigits: 1});
    }
    changeInitialConditions();
}

function setDioxygenInitialConditions() {
    /*
        Modifie les conditions initiales pour le dioxygène.
    */
    n0_O2 = O2_input.value;
    for (span of spans_O2) {
        span.innerHTML = parseFloat(n0_O2).toLocaleString('fr-FR', {maximumFractionDigits: 1});
    }
    changeInitialConditions();
}

function changeInitialConditions() {
    /*
        Change les conditions initiales.
    */
    computeXMax();
    
    drawFePlot();
    drawO2Plot();
    drawFe2O3Plot();
    
    if (limiting == 'Fe') {
        drawO2Cursor();
    } else if (limiting == 'O2') {
        drawFeCursor();
    }
    drawFe2O3Cursor();
    
    writeMaxExtentLegend()
    
    stage.update();
}

Fe_input.addEventListener("change", setIronInitialConditions);
O2_input.addEventListener("change", setDioxygenInitialConditions);





//==============================
//       Canvas graphique
//==============================

const canvas = document.querySelector("#canvas");
const stage = new createjs.Stage(canvas);
stage.enableMouseOver();
createjs.Touch.enable(stage);
stage.mouseMoveOutside = true;

const container = new createjs.Container();
stage.addChild(container);
container.x = 30;
container.y = 220;



// ===== Axes du graphique =====

const axes = new createjs.Shape();
container.addChild(axes);

const xscale = 300 * 3 / 15;
const yscale = 200 / 15;

axes.graphics.ss(2, 1, 1).s('black');
axes.graphics.mt(0, 0).lt(330, 0);
axes.graphics.mt(0, 0).lt(0, -210);
axes.graphics.mt(325, 5).lt(330, 0).lt(325, -5);
axes.graphics.mt(-5, -205).lt(0, -210).lt(5, -205);

// graduations abscisses
for (let i = 1; i <= 5; i++) {
    axes.graphics.mt(i * xscale, -5).lt(i * xscale, 5);
    let xText = new createjs.Text(i, "16px Quicksand");
    container.addChild(xText);
    xText.x = i * xscale;
    xText.y = 17;
    xText.textBaseline = 'middle';
    xText.textAlign = 'center';
}

// graduations ordonnées
for (let i = 2; i <= 15; i+=2) {
    axes.graphics.mt(-5, -i * yscale).lt(5, -i * yscale);
    let yText = new createjs.Text(i, "16px Quicksand");
    container.addChild(yText);
    yText.x = -17;
    yText.y = -i * yscale;
    yText.textBaseline = 'middle';
    yText.textAlign = 'center';
}

// légende abscisses
const xLegend = new createjs.Text("x (mol)", "16px Quicksand");
container.addChild(xLegend);
xLegend.x = 335;
xLegend.textBaseline = 'middle';
xLegend.textAlign = 'left';



// ===== Courbe du fer =====

const plotFe = new createjs.Shape();
container.addChild(plotFe);

const legendFe = new createjs.Shape();
container.addChild(legendFe);
legendFe.graphics.ss(2, 1, 1).s('green');
legendFe.graphics.mt(240, -200).lt(260, -200);

const textFe = new createjs.Text("n(Fe)", "16px Quicksand", 'green');
container.addChild(textFe);
textFe.x = 270;
textFe.y = -200;
textFe.textBaseline = 'middle';
textFe.textAlign = 'left';

function drawFePlot() {
    /*
        Trace la courbe d'évolution de la quantité de matière
        de fer.
    */
    plotFe.graphics.clear();
    plotFe.graphics.ss(2, 1, 1).s('green');
    plotFe.graphics.mt(0, -n0_Fe * yscale);
    plotFe.graphics.lt(xmax * xscale, -yscale * (n0_Fe - 3 * xmax));
}

function drawFeCursor() {
    /*
        Trace le curseur pour l'état final du fer.
    */
    plotFe.graphics.setStrokeDash([5,6]);
    plotFe.graphics.mt(0, -yscale * (n0_Fe - 3 * xmax));
    plotFe.graphics.lt(xmax * xscale, -yscale * (n0_Fe - 3 * xmax));
    plotFe.graphics.lt(xmax * xscale, 0);
}



// ===== Courbe du dioxygène =====

const plotO2 = new createjs.Shape();
container.addChild(plotO2);

const legendO2 = new createjs.Shape();
container.addChild(legendO2);
legendO2.graphics.ss(2, 1, 1).s('orange');
legendO2.graphics.mt(240, -180).lt(260, -180);

const textO2 = new createjs.Text("n(O₂)", "16px Quicksand", 'orange');
container.addChild(textO2);
textO2.x = 270;
textO2.y = -180;
textO2.textBaseline = 'middle';
textO2.textAlign = 'left';

function drawO2Plot() {
    /*
        Trace la courbe d'évolution de la quantité de matière
        de dioxygène.
    */
    plotO2.graphics.clear();
    plotO2.graphics.ss(2, 1, 1).s('orange');
    plotO2.graphics.mt(0, -n0_O2 * yscale);
    plotO2.graphics.lt(xmax * xscale, -yscale * (n0_O2 - 2 * xmax));
}

function drawO2Cursor() {
    /*
        Trace le curseur pour l'état final du dioxygène.
    */
    plotO2.graphics.setStrokeDash([5,6]);
    plotO2.graphics.mt(0, -yscale * (n0_O2 - 2 * xmax));
    plotO2.graphics.lt(xmax * xscale, -yscale * (n0_O2 - 2 * xmax));
    plotO2.graphics.lt(xmax * xscale, 0);
}



// ===== Courbe de l'oxyde de fer =====

const plotFe2O3 = new createjs.Shape();
container.addChild(plotFe2O3);

const legendFe2O3 = new createjs.Shape();
container.addChild(legendFe2O3);
legendFe2O3.graphics.ss(2, 1, 1).s('purple');
legendFe2O3.graphics.mt(240, -160).lt(260, -160);

const textFe2O3 = new createjs.Text("n(Fe₃O₄)", "16px Quicksand", 'purple');
container.addChild(textFe2O3);
textFe2O3.x = 270;
textFe2O3.y = -160;
textFe2O3.textBaseline = 'middle';
textFe2O3.textAlign = 'left';

function drawFe2O3Plot() {
    /*
        Trace la courbe d'évolution de la quantité de matière
        d'oxyde de fer.
    */
    plotFe2O3.graphics.clear();
    plotFe2O3.graphics.ss(2, 1, 1).s('purple');
    plotFe2O3.graphics.mt(0, 0);
    plotFe2O3.graphics.lt(xmax * xscale, -yscale * xmax);
}

function drawFe2O3Cursor() {
    /*
        Trace le curseur pour l'état final de l'oxyde de fer.
    */
    plotFe2O3.graphics.setStrokeDash([5,6]);
    plotFe2O3.graphics.mt(0, -yscale * xmax);
    plotFe2O3.graphics.lt(xmax * xscale, -yscale * xmax);
    plotFe2O3.graphics.lt(xmax * xscale, 0);
}



// ===== Avancement maximal =====

const maxExtent = new createjs.Text("x", "16px Quicksand", 'purple');
container.addChild(maxExtent);
maxExtent.textBaseline = 'middle';
maxExtent.textBaseline = 'center';

const maxText = new createjs.Text("max", "12px Quicksand", 'purple');
container.addChild(maxText);
maxText.textBaseline = 'middle';
maxText.textBaseline = 'center';

function writeMaxExtentLegend() {
    /*
        Indique l'avancement maximal sur le graphe.
    */
    maxExtent.x = xmax * xscale - 5;
    maxExtent.y = 35;
    maxText.x = xmax * xscale+5;
    maxText.y = 38;
}





//==============================
//        Initialisation
//==============================

Fe_input.value = n0_Fe;
O2_input.value = n0_O2;
setIronInitialConditions();
setDioxygenInitialConditions();