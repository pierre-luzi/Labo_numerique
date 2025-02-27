/*
    --------------------------------
    | Recherche du boson de Higgs  |
    --------------------------------

    Ce script produit l'histogramme de masse invariante pour deux photons
    à partir des données du détecteur ATLAS. Une modélisation de
    l'histogramme pour mettre en évidence l'existence d'un boson de Higgs
    à une masse de 125 GeV est proposée, avec la possibilité de modifier
    les paramètres de la fonction gaussienne qui modélise le signal.
*/





//==============================
//       Canvas curseurs
//==============================

let settingsCanvas = document.getElementById("settings_canvas");
settingsCanvas.width = mainWidth;
settingsCanvas.height = 120;

let settingsStage = new createjs.Stage(settingsCanvas);
settingsStage.enableMouseOver();
createjs.Touch.enable(settingsStage);
settingsStage.mouseMoveOutside = true;


// ===== Fonctions de création des curseurs =====

lineLength = 280;
cursorFont = "18px Quicksand";

const xminCursor = (mainWidth-lineLength)/2;    // position de l'extrémité gauche des curseurs
const xmaxCursor = xminCursor + lineLength;



// ===== Curseur pour le pas du réseau ====

const yHiggsMass = 30;      // position verticale

cursorLine(xminCursor, yHiggsMass, settingsStage);
cursorText("Masse μ", xminCursor-120, yHiggsMass, settingsStage);
cursorText("GeV/c²", xmaxCursor+70, yHiggsMass, settingsStage);
const buttonHiggsMass = cursorButton('red', xminCursor+0.5*lineLength, yHiggsMass, settingsStage);
const higgsMassText = cursorText("", xmaxCursor+20, yHiggsMass, settingsStage);

const minHiggsMass = 110;
const maxHiggsMass = 150;
let higgsMass = minHiggsMass + 0.5 * (maxHiggsMass + minHiggsMass);

function getHiggsMass() {
    /*
        Calcule la masse du boson de Higgs en fonction
        de la position du curseur et met à jour l'affichage
        de la valeur à côté du curseur.
    */
    higgsMass = (buttonHiggsMass.x - xminCursor) / lineLength * (maxHiggsMass - minHiggsMass) + minHiggsMass;
    higgsMassText.text = higgsMass.toLocaleString('fr-FR', {maximumFractionDigits: 1});
}



// ===== Curseur pour l'épaisseur d'une fente ====

const yHiggsWidth = 60;      // position verticale

cursorLine(xminCursor, yHiggsWidth, settingsStage);
cursorText("Largeur σ", xminCursor-120, yHiggsWidth, settingsStage);
cursorText("GeV/c²", xmaxCursor+70, yHiggsWidth, settingsStage);
const buttonHiggsWidth = cursorButton('red', xminCursor+0.5*lineLength, yHiggsWidth, settingsStage);
const higgsWidthText = cursorText("", xmaxCursor+20, yHiggsWidth, settingsStage);

const minHiggsWidth = 2.5;
const maxHiggsWidth = 10;
let higgsWidth = minHiggsWidth + 0.5 * (maxHiggsWidth+minHiggsWidth);

function getHiggsWidth() {
    /*
        Calcule la largeur du boson de Higgs en fonction
        de la position du curseur et met à jour l'affichage
        de la valeur à côté du curseur.
    */
    higgsWidth = (buttonHiggsWidth.x - xminCursor) / lineLength * (maxHiggsWidth - minHiggsWidth) + minHiggsWidth;
    higgsWidthText.text = higgsWidth.toLocaleString('fr-FR', {maximumFractionDigits: 2});
}



// ===== Curseur pour la longueur d'onde =====

const yAmplitude = 90;    // position verticale

cursorLine(xminCursor, yAmplitude, settingsStage);
cursorText("Amplitude A", xminCursor-120, yAmplitude, settingsStage);
const buttonAmplitude = cursorButton('red', xminCursor+0.5*lineLength, yAmplitude, settingsStage);
const amplitudeText = cursorText("", xmaxCursor+20, yAmplitude, settingsStage);

const minAmplitude = 50;
const maxAmplitude = 150;
let amplitude = minAmplitude + 0.5 * (maxAmplitude + minAmplitude);

function getAmplitude() {
    /*
        Calcule l'amplitude du signal en fonction
        de la position du curseur et met à jour l'affichage
        de la valeur à côté du curseur.
    */
    amplitude = (buttonAmplitude.x - xminCursor) / lineLength * (maxAmplitude - minAmplitude) + minAmplitude;
    amplitudeText.text = amplitude.toLocaleString('fr-FR', {maximumFractionDigits: 0});
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
        Action lors du déplacement d'un curseur : modifie la fonction
        modélisant le signal est met à jour la courbe.
    */
    button = event.currentTarget;
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xmaxCursor);
    
    getHiggsMass();
    getHiggsWidth();
    getAmplitude();
    
    drawFitFunction();
    drawSignal();
    
    computeChiSquare();
    
    settingsStage.update();
}

buttonHiggsMass.addEventListener('mousedown', onMouseDown);
buttonHiggsMass.addEventListener('pressmove', onPressMove);

buttonHiggsWidth.addEventListener('mousedown', onMouseDown);
buttonHiggsWidth.addEventListener('pressmove', onPressMove);

buttonAmplitude.addEventListener('mousedown', onMouseDown);
buttonAmplitude.addEventListener('pressmove', onPressMove);





//==============================
//       Canvas graphique
//==============================

const graphicCanvas = document.getElementById("graphic_canvas");
graphicCanvas.width = mainWidth;
graphicCanvas.height = 435;

const graphicStage = new createjs.Stage(graphicCanvas);



// ===== Conteneur du graphe =====

const plotContainer = new createjs.Container();
graphicStage.addChild(plotContainer);
plotContainer.x = mainWidth/2 - 300;
plotContainer.y = 320;

// distribution des masses invariantes
let masses = [1222,1107,984,896,906,816,804,780,754,720,640,578,635,539,542,524,519,470,430,425];



// ===== Axes du graphe =====

const axes = new createjs.Shape();
plotContainer.addChild(axes);

axes.graphics.ss(1, 1, 1).s('black').f('white');
axes.graphics.drawRect(0, 0, 600, yMax);
axes.graphics.drawRect(0, 0, 600, 80);
axes.graphics.ef();

// échelle pour la masse
for (let m = 100; m <= 160; m += 10) {
    let massLegend = new createjs.Text(m, "14px Quicksand", 'black');
    plotContainer.addChild(massLegend);
    massLegend.x = (m-100) * xScale;
    massLegend.y = 92;
    massLegend.textBaseline = 'middle';
    massLegend.textAlign = 'center';
}

for (let m = 102; m < 160; m += 2) {
    let x = (m-100) * xScale;
    if (m % 10 == 0) {
        axes.graphics.mt(x, -6).lt(x, 6);
        axes.graphics.mt(x, nMax * yScale).lt(x, nMax * yScale + 6);
        axes.graphics.mt(x, 80).lt(x, 74);
    } else {
        axes.graphics.mt(x, -3).lt(x, 3);
        axes.graphics.mt(x, nMax * yScale).lt(x, nMax * yScale + 3);
        axes.graphics.mt(x, 80).lt(x, 77);
    }
}

// échelle pour le nombre d'entrées
for (let n = 200; n < 1400; n += 200) {
    let nLegend = new createjs.Text(n, "14px Quicksand", 'black');
    plotContainer.addChild(nLegend);
    nLegend.x = -5;
    nLegend.y = n * yScale;
    nLegend.textBaseline = 'middle';
    nLegend.textAlign = 'right';
}

for (let n = 40; n < nMax; n += 40) {
    let y = n * yScale;
    if (n % 200 == 0) {
        axes.graphics.mt(0, y).lt(6, y);
        axes.graphics.mt(600, y).lt(594, y);
    } else {
        axes.graphics.mt(0, y).lt(3, y);
        axes.graphics.mt(600, y).lt(597, y);
    }
}

// légende pour les résidus
for (let n = -100; n <= 100; n += 100) {
    let nLegend = new createjs.Text(n, "14px Quicksand", 'black');
    plotContainer.addChild(nLegend);
    nLegend.x = -5;
    nLegend.y = 40 + n * yScaleSignal;
    nLegend.textBaseline = 'middle';
    nLegend.textAlign = 'right';
}

for (let n = 20; n < 180; n += 20) {
    let y = n * yScaleSignal;
    if (n % 100 == 0) {
        axes.graphics.mt(0, 40 + y).lt(6, 40 + y);
        axes.graphics.mt(0, 40 - y).lt(6, 40 - y);
        axes.graphics.mt(600, 40 + y).lt(594, 40 + y);
        axes.graphics.mt(600, 40 - y).lt(594, 40 - y);
    } else {
        axes.graphics.mt(0, 40 + y).lt(3, 40 + y);
        axes.graphics.mt(0, 40 - y).lt(3, 40 - y);
        axes.graphics.mt(600, 40 + y).lt(597, 40 + y);
        axes.graphics.mt(600, 40 - y).lt(597, 40 - y);
    }
}



// ===== Légende du graphe =====

const xLegend = 390;

const ATLASLegend = new createjs.Text("ATLAS Open Data", "20px Quicksand", 'black');
plotContainer.addChild(ATLASLegend);
ATLASLegend.x = xLegend;
ATLASLegend.y = yMax + 25;
ATLASLegend.textBaseline = 'middle';
ATLASLegend.textAlign = 'left';

const educationLegend = new createjs.Text("for education", "14px Quicksand", 'black');
plotContainer.addChild(educationLegend);
educationLegend.x = xLegend;
educationLegend.y = yMax + 45;
educationLegend.textBaseline = 'middle';
educationLegend.textAlign = 'left';

const lumiLegend = new createjs.Text("√s = 13 TeV, ∫ L dt = 36,1 fb⁻¹", "16px Quicksand", 'black');
plotContainer.addChild(lumiLegend);
lumiLegend.x = xLegend;
lumiLegend.y = yMax + 65;
lumiLegend.textBaseline = 'middle';
lumiLegend.textAlign = 'left';

const canalLegend = new createjs.Text("H → γγ", "16px Quicksand", 'black');
plotContainer.addChild(canalLegend);
canalLegend.x = xLegend;
canalLegend.y = yMax + 85;
canalLegend.textBaseline = 'middle';
canalLegend.textAlign = 'left';

const chiSquareLegend = new createjs.Text("", "20px Quicksand", 'black');
plotContainer.addChild(chiSquareLegend);
chiSquareLegend.x = 200;
chiSquareLegend.y = yMax + 50;
chiSquareLegend.textBaseline = 'middle';
chiSquareLegend.textAlign = 'left';

const massLegend = new createjs.Text("Masse invariante (GeV/c²)", "16px Quicksand", 'black');
plotContainer.addChild(massLegend);
massLegend.x = 600;
massLegend.y = 110;
massLegend.textBaseline = 'middle';
massLegend.textAlign = 'right';

const eventsLegend = new createjs.Text("Événements / 3 GeV/c²", "16px Quicksand", 'black');
plotContainer.addChild(eventsLegend);
eventsLegend.x = -50;
eventsLegend.y = yMax;
eventsLegend.textBaseline = 'middle';
eventsLegend.textAlign = 'right';
eventsLegend.rotation = -90;



// ===== Éléments du graphe =====

// histogramme
const histogram = new createjs.Shape();
plotContainer.addChild(histogram);

// courbe de l'ajustement
const fit = new createjs.Shape();
plotContainer.addChild(fit);

// courbe du signal
const signal = new createjs.Shape();
plotContainer.addChild(signal);

// courbe du bruit de fond
const background = new createjs.Shape();
plotContainer.addChild(background);

// paramètres du polynôme pour le bruit de fond
let polynomialParams = [
    47422.71435268009,
    -1228.1438111476673,
    12.06175491533642,
    -0.05233152585190114,
    8.399791587200754e-05
];

function drawHistogram() {
    /*
        Représente l'histogramme.
    */
    histogram.graphics.clear();
    histogram.graphics.ss(1, 1, 1).s('black').f('black');
    
    for (let i = 0; i < numBins; i++) {
        let x = (xBins[i]-100) * 10;
        let mass = masses[i];
        let uncertainty = Math.sqrt(masses[i]);
        let residual = mass - fitPolynomialBackground(xBins[i]);
        
        // ===== Données complètes =====
        
        // nombre d'entrées
        histogram.graphics.mt(x, yScale * mass);
        histogram.graphics.dc(x, yScale * mass, 3);
        
        // incertitudes        
        histogram.graphics.mt(x, yScale * (mass-uncertainty));
        histogram.graphics.lt(x, yScale * (mass+uncertainty));
        
        // ===== Données - background ======
        histogram.graphics.mt(x, yScaleSignal * residual + 40);
        histogram.graphics.dc(x, yScaleSignal * residual + 40, 3);
        
        histogram.graphics.mt(x, yScaleSignal * (residual-uncertainty) + 40);
        histogram.graphics.lt(x, yScaleSignal * (residual+uncertainty) + 40);
    }
    
    graphicStage.update();
}

function fitPolynomialBackground(x) {
    /*
        Renvoie la valeur du polynôme d'ordre 4 modélisant le bruit de fond.
    */
    return polynomialParams[0] + polynomialParams[1] * x + polynomialParams[2] * Math.pow(x, 2) + polynomialParams[3] * Math.pow(x, 3) + polynomialParams[4] * Math.pow(x, 4);
}

function fitGaussianSignal(x) {
    /*
        Renvoie la valeur de la gaussienne modélisant le signal.
    */
    return amplitude * Math.exp(-0.5 * ((x - higgsMass)/higgsWidth)**2);    
}

function fitFunctionValue(x) {
    /*
        Renvoie la valeur de la fonction modélisant les données.
    */
    return fitPolynomialBackground(x) + fitGaussianSignal(x);
}

function drawBackground() {
    /*
        Trace la courbe modélisant le bruit fond.
    */
    background.graphics.clear();
    background.graphics.setStrokeDash([10,6]).s('red');
    background.graphics.mt(0, yScale * fitPolynomialBackground(100));
    for (let x = 102; x <= 160; x++) {
        background.graphics.lt((x-100)*10, yScale * fitPolynomialBackground(x));
    }
    
    background.graphics.mt(0, 40).lt(600, 40);
    
    graphicStage.update();
}

function drawFitFunction() {
    /*
        Trace la courbe modélisant les données.
    */
    fit.graphics.clear();
    fit.graphics.ss(2, 1, 1).s('red');
    fit.graphics.mt(0, yScale * fitFunctionValue(100));
    for (let x = 102; x <= 160; x++) {
        fit.graphics.lt((x-100)*10, yScale * fitFunctionValue(x));
    }
    
    graphicStage.update();
}

function drawSignal() {
    /*
        Trace la courbe modélisant le signal.
    */
    signal.graphics.clear();
    signal.graphics.ss(2, 1, 1).s('red');
    signal.graphics.mt(0, yScaleSignal * fitGaussianSignal(100)+40);
    for (let x = 102; x <= 160; x++) {
        signal.graphics.lt((x-100)*10, yScaleSignal * fitGaussianSignal(x)+40);
    }
    
    graphicStage.update();
}

function computeChiSquare() {
    /*
        Calcule le chi2 de la modélisation.
    */
    chiSquare = 0;
    for (let i = 0; i < numBins; i++) {
        let mass = masses[i];
        let x = min + (i+0.5) * binSize;
        let expectedMass = fitFunctionValue(x);
        chiSquare += (mass-expectedMass)**2/mass;
    }
    
    chiSquareLegend.text = "χ² = " + chiSquare.toLocaleString('fr-FR', {maximumFractionDigits: 3});
}





// ===== Initialisation =====

getHiggsMass();
getHiggsWidth();
getAmplitude();
drawHistogram();
drawBackground();
drawFitFunction();
drawSignal();

computeChiSquare();

settingsStage.update();
graphicStage.update();