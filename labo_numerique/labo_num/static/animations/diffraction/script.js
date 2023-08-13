/*
    --------------------------------
    |   Diffraction par N fentes   |
    --------------------------------

    Ce script simule les franges d'égale inclinaison produites par un
    interféromètre de Michelson réglé en lame d'air.
    Un curseur permet de régler l'épaisseur de la lame d'air. Un autre
    curseur permet de choisir la longueur d'onde.
    Un schéma du montage est représenté, ainsi que deux rayons lumineux
    secondaires issus d'un rayon primaire.
*/





//==============================
//       Canvas curseurs
//==============================

let settingsCanvas = document.getElementById("settings_canvas");
settingsCanvas.width = window.screen.width;
settingsCanvas.height = 120;

let settingsStage = new createjs.Stage(settingsCanvas);
settingsStage.enableMouseOver();
createjs.Touch.enable(settingsStage);
settingsStage.mouseMoveOutside = true;


// ===== Fonctions de création des curseurs =====

lineLength = 280;
cursorFont = "18px Quicksand";

const xminCursor = 350;    // position de l'extrémité gauche des curseurs
const xmaxCursor = xminCursor + lineLength;



// ===== Curseur pour le pas du réseau ====

const yStep = 30;      // position verticale

cursorLine(xminCursor, yStep, settingsStage);
cursorText("Pas du réseau a", xminCursor-210, yStep, settingsStage);
cursorText("µm", xmaxCursor+70, yStep, settingsStage);
const buttonStep = cursorButton('gray', xminCursor+0.5*lineLength, yStep, settingsStage);
const stepText = cursorText("", xmaxCursor+20, yStep, settingsStage);

const minStep = 10e-6;
const maxStep = 40e-6;
let step = 5;

function getStep() {
    /*
        Calcule l'épaisseur de la lame d'air en fonction
        de la position du curseur et met à jour l'affichage
        de la valeur à côté du curseur.
    */
    step = (buttonStep.x - xminCursor) / lineLength * (maxStep - minStep) + minStep;
    stepText.text = (step*1e6).toLocaleString('fr-FR', {maximumFractionDigits: 1});
}



// ===== Curseur pour l'épaisseur d'une fente ====

const yWidth = 60;      // position verticale

cursorLine(xminCursor, yWidth, settingsStage);
cursorText("Épaisseur d'une fente b", xminCursor-210, yWidth, settingsStage);
cursorText("µm", xmaxCursor+70, yWidth, settingsStage);
const buttonWidth = cursorButton('gray', xminCursor+0.5*lineLength, yWidth, settingsStage);
const widthText = cursorText("", xmaxCursor+20, yWidth, settingsStage);

const minWidth = 1e-6;
const maxWidth = 10e-6;
let width = 5;

function getWidth() {
    /*
        Calcule l'épaisseur de la lame d'air en fonction
        de la position du curseur et met à jour l'affichage
        de la valeur à côté du curseur.
    */
    width = (buttonWidth.x - xminCursor) / lineLength * (maxWidth - minWidth) + minWidth;
    widthText.text = (width*1e6).toLocaleString('fr-FR', {maximumFractionDigits: 2});
}



// ===== Curseur pour la longueur d'onde =====

const yWavelength = 90;    // position verticale

cursorLine(xminCursor, yWavelength, settingsStage);
cursorText("Longueur d'onde λ", xminCursor-210, yWavelength, settingsStage);
cursorText("nm", xmaxCursor+70, yWavelength, settingsStage);
const buttonWavelength = cursorButton('red', xminCursor+0.7*lineLength, yWavelength, settingsStage);
const wavelengthText = cursorText("", xmaxCursor+20, yWavelength, settingsStage);

const minWavelength = 400;
const maxWavelength = 750;
let wavelength = minWavelength;
let wavelengthRGB = wavelengthToRGB(wavelength);

function getWavelength() {
    /*
        Calcule la longueur d'onde du rayonnement en fonction
        de la position du curseur et met à jour l'affichage
        de la valeur à côté du curseur.
    */
    wavelength = (buttonWavelength.x - xminCursor) / lineLength * (maxWavelength - minWavelength) + minWavelength;
    wavelengthText.text = (wavelength).toLocaleString('fr-FR', {maximumFractionDigits: 0});
    
    // mise à jour de la couleur du curseur
    buttonWavelength.graphics.clear();
    wavelengthRGB = wavelengthToRGB(wavelength);
    color = "rgba(" + wavelengthRGB + ")";
    buttonWavelength.graphics.f(color).dc(0, 0, 10).ef().es();
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
        Action lors du déplacement d'un curseur : l'épaisseur
        de la lame d'air et la longueur d'onde sont mise à jour
        et la figure d'interférence est tracée.
    */
    button = event.currentTarget;
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xmaxCursor);
    getStep();
    getWidth();
    getWavelength();
    updateGraphics();
    settingsStage.update();
    graphicStage.update();
}

buttonStep.addEventListener('mousedown', onMouseDown);
buttonStep.addEventListener('pressmove', onPressMove);

buttonWidth.addEventListener('mousedown', onMouseDown);
buttonWidth.addEventListener('pressmove', onPressMove);

buttonWavelength.addEventListener('mousedown', onMouseDown);
buttonWavelength.addEventListener('pressmove', onPressMove);



//==============================
//         Paramètres
//==============================

xminSettings = xmaxCursor + 200;




// ===== Nombre de fentes ====

let N = 2;

let slicesNumberLegend = new createjs.Text("Nombre N de fentes", cursorFont, 'black');
settingsStage.addChild(slicesNumberLegend);
slicesNumberLegend.x = xminSettings;
slicesNumberLegend.y = yStep;
slicesNumberLegend.textBaseline = 'middle';

let slicesNumberText = new createjs.Text(N, cursorFont, 'black');
settingsStage.addChild(slicesNumberText);
slicesNumberText.x = xminSettings+slicesNumberLegend.getMeasuredWidth()+60;
slicesNumberText.y = yStep;
slicesNumberText.textBaseline = 'middle';
slicesNumberText.textAlign = 'center';

function updateSlicesNumber() {
    /*
        Met à jour le nombre de fentes.
    */
    slicesNumberText.text = N;
    settingsStage.update();
    updateGraphics();
}



// ===== Diminuer le nombre de fentes ====

let decreaseArrow = new createjs.Shape();
settingsStage.addChild(decreaseArrow);
decreaseArrow.cursor = 'pointer';

decreaseArrow.graphics.ss(1, 1, 1).s('black').f('black');
decreaseArrow.graphics.mt(
    xminSettings+slicesNumberLegend.getMeasuredWidth()+35,
    yStep
);
decreaseArrow.graphics.lt(
    xminSettings+slicesNumberLegend.getMeasuredWidth()+45,
    yStep-5
);
decreaseArrow.graphics.lt(
    xminSettings+slicesNumberLegend.getMeasuredWidth()+45,
    yStep+5
);
decreaseArrow.graphics.lt(
    xminSettings+slicesNumberLegend.getMeasuredWidth()+35,
    yStep
);

decreaseArrow.addEventListener("mousedown", decreaseSlicesNumber);

function decreaseSlicesNumber() {
    /*
        Diminue le nombre de fentes.
    */
    N = Math.max(1, N-1);
    updateSlicesNumber();
}



// ===== Augmenter le nombre de fentes ====

let increaseArrow = new createjs.Shape();
settingsStage.addChild(increaseArrow);
increaseArrow.cursor = 'pointer';

increaseArrow.graphics.ss(1, 1, 1).s('black').f('black');
increaseArrow.graphics.mt(
    xminSettings+slicesNumberLegend.getMeasuredWidth()+85,
    yStep
);
increaseArrow.graphics.lt(
    xminSettings+slicesNumberLegend.getMeasuredWidth()+75,
    yStep-5
);
increaseArrow.graphics.lt(
    xminSettings+slicesNumberLegend.getMeasuredWidth()+75,
    yStep+5
);
increaseArrow.graphics.lt(
    xminSettings+slicesNumberLegend.getMeasuredWidth()+85,
    yStep
);

increaseArrow.addEventListener("mousedown", increaseSlicesNumber);

function increaseSlicesNumber() {
    /*
        Augmente le nombre de fentes.
    */
    N = Math.min(8, N+1);
    updateSlicesNumber();
}



// ===== Chekcbox facteur de forme ====

let showShapeFactor = false;

let shapeCheckbox = new createjs.Shape();
settingsStage.addChild(shapeCheckbox);
shapeCheckbox.cursor = 'pointer';

drawEmptyCheckbox(shapeCheckbox, yWidth);

let shapeText = new createjs.Text("Montrer le facteur de forme", cursorFont, 'black');
settingsStage.addChild(shapeText);
shapeText.x = xminSettings + 25;
shapeText.y = yWidth;
shapeText.textBaseline = 'middle';




// ===== Checkbox facteur de structure ====

let showStructureFactor = false;

let structureCheckbox = new createjs.Shape();
settingsStage.addChild(structureCheckbox);
structureCheckbox.cursor = 'pointer';

drawEmptyCheckbox(structureCheckbox, yWavelength);

let structureText = new createjs.Text("Montrer le facteur de structure", cursorFont, 'black');
settingsStage.addChild(structureText);
structureText.x = xminSettings + 25;
structureText.y = yWavelength;
structureText.textBaseline = 'middle';




// ===== Mise à jour des checkboxes ====

function drawEmptyCheckbox(checkbox, yPosition) {
    /*
        Trace une checkbox vide.
        Arguments :
            - checkbox : l'élément Shape représentant la checkbox ;
            - yPosition : la position verticale du centre de la checkbox.
    */
    checkbox.graphics.clear();
    checkbox.graphics.ss(2, 1, 1).s('black').f('white');
    checkbox.graphics.dr(xminSettings, yPosition-9, 18, 18);
}

function changeCheckbox(checkbox, show, yPosition, color) {
    /*
        Change l'état de la checkbox.
    */
    if (show) {
        drawEmptyCheckbox(checkbox, yPosition);
    } else {
        checkbox.graphics.ss(1, 1, 1).s(color).f(color);
        checkbox.graphics.dr(xminSettings+4, yPosition-5, 10, 10);
    }
    settingsStage.update();
}

shapeCheckbox.addEventListener("mousedown", function() {
    changeCheckbox(shapeCheckbox, showShapeFactor, yWidth, 'blue');
    showShapeFactor = !showShapeFactor;
    updateGraphics();
});

structureCheckbox.addEventListener("mousedown", function() {
    changeCheckbox(structureCheckbox, showStructureFactor, yWavelength, 'green');
    showStructureFactor = !showStructureFactor;
    updateGraphics();
});





//==============================
//       Canvas graphique
//==============================

let graphicCanvas = document.getElementById("graphic_canvas");
graphicCanvas.width = window.screen.width;
graphicCanvas.height = 380;

let graphicStage = new createjs.Stage(graphicCanvas);

const xScale = 1/4000;
const yScale = -250;



// ===== Conteneur du graphe =====

let plotContainer = new createjs.Container();
graphicStage.addChild(plotContainer);
plotContainer.x = window.screen.width/2;
plotContainer.y = 280;

let axes = new createjs.Shape();
plotContainer.addChild(axes);

axes.graphics.ss(2, 1, 1).s('black');
axes.graphics.mt(-400, 0).lt(-400, -270).lt(400, -270).lt(400, 0).lt(-400, 0);

for (x = -400; x < 401; x += 100) {
    axes.graphics.mt(x, 0).lt(x, 5);
    let axesLegend = new createjs.Text(
        (x * xScale).toLocaleString('fr-FR', {maximumFractionDigits: 3}),
        "16px Quicksand",
        'black'
    );
    plotContainer.addChild(axesLegend);
    axesLegend.x = x;
    axesLegend.y = 18;
    axesLegend.textBaseline = 'middle';
    axesLegend.textAlign = 'center';
}


// ===== Graphe de l'intensité =====

let intensityPlot = new createjs.Shape();
plotContainer.addChild(intensityPlot);



// ===== Facteur de forme =====

let shapeFactorPlot = new createjs.Shape();
plotContainer.addChild(shapeFactorPlot);



// ===== Facteur de structure =====

let structureFactorPlot = new createjs.Shape();
plotContainer.addChild(structureFactorPlot);



// ===== Conteneur de l'écran =====

let screenContainer = new createjs.Container();
graphicStage.addChild(screenContainer);
screenContainer.x = window.screen.width/2;
screenContainer.y = 340;

let screenShape = new createjs.Shape();
screenContainer.addChild(screenShape);
screenShape.graphics.ss(2, 1, 1).f('black');
screenShape.graphics.drawRect(-400, -30, 800, 60).ef();

let diffractionFigure = new createjs.Shape();
screenContainer.addChild(diffractionFigure);



// ===== Tracé des graphes et de la figure de diffraction =====

Math.sinc = function(x) {
    if (x === 0) {
        return 1
    }
    return (Math.sin(Math.PI * x)) / (Math.PI * x);
}


function computeShapeFactor(x) {
    /*
        Calcule le facteur de forme.
        Argument :
            - x : abscisse du point.
    */
    return (Math.sinc(Math.PI * x * width / (wavelength*1e-9)))**2;
}

function computeStructureFactor(x) {
    /*
        Calcule le facteur de structure.
        Argument :
            - x : abscisse du point.
    */
    if (x == 0) {
        return 1;
    } else {
        X = step * x / (wavelength*1e-9);
        if (Math.abs(Math.round(X) - X) < 1e-6) {
            // prévient le cas où la phase est un multiple de Pi
            return 1;
        }
    }
    return (Math.sin(N * Math.PI * X) / (N * Math.sin(Math.PI * X)))**2;
}

function initializeGraphics() {
    /*
        Initialise les graphes.
    */
    intensityPlot.graphics.clear();
    intensityPlot.graphics.ss(3, 1, 1).s('red');
    
    shapeFactorPlot.graphics.clear();
    shapeFactorPlot.graphics.ss(2, 1, 1).s('blue');
    shapeFactorPlot.graphics.setStrokeDash([5,6]);
    
    structureFactorPlot.graphics.clear();
    structureFactorPlot.graphics.ss(2, 1, 1).s('green');
    structureFactorPlot.graphics.setStrokeDash([5,6]);
    
    diffractionFigure.graphics.clear();
}

function updateGraphics() {
    /*
        Met à jour les graphes et la figure de diffraction.
    */
    initializeGraphics();
    
    let x = -400;
    let shape = [];
    let structure = [];
    let intensity = [];
    
    for (x = 0; x < 401; x++) {
        shape.push(computeShapeFactor(x * xScale));
        structure.push(computeStructureFactor(x * xScale));
        intensity.push(shape[x] * structure[x]);
    }
    
    for (x = Math.floor(0.048 / xScale); x < Math.floor(0.050 / xScale); x++) {
        console.log(x + " : " + structure[x]);
    }
    
    shapeFactorPlot.graphics.mt(-400, yScale * shape[400]);
    structureFactorPlot.graphics.mt(-400, yScale * structure[400]);
    intensityPlot.graphics.mt(-400, yScale * intensity[400]);
    
    for (x = -399; x < 401; x++) {
        if (showShapeFactor) {
            shapeFactorPlot.graphics.lt(x, yScale * shape[Math.abs(x)]);
        }
        if (showStructureFactor) {
            structureFactorPlot.graphics.lt(x, yScale * structure[Math.abs(x)]);
        }
        intensityPlot.graphics.lt(x, yScale * intensity[Math.abs(x)]);
    }
    
    for (x = 0; x < 400; x+=2) {
        for (y = 0; y < 30; y+=2) {
            let opacity = shape[x] * structure[x] * Math.exp( -(y**2/15**2) );
            // let opacity = Math.exp( - (y/15)**2 );
            let color = 'rgba(' + wavelengthRGB + ', ' + opacity + ')';
            diffractionFigure.graphics.f(color);
            diffractionFigure.graphics.dr(x, y, 2, 2);
            if (y != 0) {
                diffractionFigure.graphics.dr(x, -y, 2, 2);
            }
            if (x !=0) {
                diffractionFigure.graphics.dr(-x, y, 2, 2);
                diffractionFigure.graphics.dr(-x, -y, 2, 2);
            }
        }
    }
    
    graphicStage.update();
}



// ===== Initialisation =====

getStep();
getWidth();
getWavelength();
updateGraphics();
settingsStage.update();
graphicStage.update();