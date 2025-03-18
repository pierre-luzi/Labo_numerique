function generateGaussianRandom(mean=0, stdev=1) {
    /*
        Renvoie une valeur aléatoire suivant une distribution gaussienne.
        Arguments :
            - mean : valeur moyenne ;
            - stdev : écart standard.
    */
    let u = 1 - Math.random();
    let v = 1 - Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Retourne la valeur avec la moyenne et l'écart-type donnés
    return z * stdev + mean;
}

function dataToBins(data, bins) {
    /*
        Répartit les données dans des bins.
    */
    for (let i = 0; i < numBins; i++) {
        bins[i] = 0;
    }
    
    data.forEach(value => {
        const binIndex = Math.floor((value-min)/binSize);
        if (binIndex < numBins) {
            bins[binIndex]++;
        }
    });
}

function drawHistogram(hist, bins) {
    /*
        Représente un histogramme.
        Arguments :
            - hist : objet Shape représentant l'histogramme ;
            - bins : liste contenant les fréquences pour chaque intervalle.
    */
    hist.graphics.clear();
    hist.graphics.ss(1, 1, 1).s('black').f('blue');
    
    let binsMax = bins.reduce((max, current) => Math.max(max, current), -Infinity);
    for (let i = 0; i < numBins; i++) {
        hist.graphics.drawRect(
            i * histogramWidth / numBins,
            0,
            histogramWidth / numBins,
            -160 * bins[i]/binsMax
        );
    }
}

function computeMean(data) {
    /*
        Renvoie la valeur moyenne de la liste de données passée en argument.
    */
    return data.reduce((sum, current) => sum + current) / data.length;
}

function displayMean(data) {
    /*
        
    */
}

function computeExpStandardDeviation(data, mean) {
    /*
        Renvoie l'écart-type expérimental de la liste de données
        passée en argument.
        Arguments :
            - data : liste de données ;
            - mean : valeur moyenne des données.
    */
    if (data.length < 2) {
        return 0;
    }
    let sum = data.reduce((sum, current) => sum + (current-mean)**2);
    return Math.sqrt(1./(data.length-1) * sum);
}

const numBins = 100;
const min = 23.5;
const max = 26.5;
const binSize = (max-min)/numBins;

const histogramWidth = 0.25*window.screen.width;





//==============================
//            Bécher
//==============================

// création des bins
const beakerBins = Array(numBins).fill(0);
let beakerData = [];

// nombre de mesures
let nBeaker = 0;
const nBeakerSpan = document.getElementById("nBeaker");
nBeakerSpan.innerText = 0;



// ===== Valeurs mesurées =====

// moyenne
let beakerMean = 25;
const beakerMeanInput = document.getElementById("beakerMean");
beakerMeanInput.value = beakerMean;

// écart-type expérimental
let beakerStd = 0.4;
const beakerStdInput = document.getElementById("beakerStd");
beakerStdInput.value = beakerStd.toLocaleString('fr-FR');



// ===== Boutons =====

function updateBeaker() {
    dataToBins(beakerData, beakerBins);
    nBeakerSpan.innerText = nBeaker;
    drawHistogram(beakerHist, beakerBins);
    drawBeakerLegend();
    beakerStage.update();
}

function beakerMeasurements(n) {
    beakerMean = parseFloat((beakerMeanInput.value).replace(",", "."));
    beakerStd = parseFloat((beakerStdInput.value).replace(",", "."));
    beakerMeanInput.disabled = true;
    beakerStdInput.disabled = true;
    nBeaker += n;
    for (let i = 0; i < n; i++) {
        beakerData.push(generateGaussianRandom(beakerMean, beakerStd));
    }
    updateBeaker();
}

// 1 mesure
const buttonBeaker1 = document.getElementById("1drawBeaker");
buttonBeaker1.addEventListener("mousedown", beakerMeasurements.bind(null, 1));

// 10 mesures
const buttonBeaker10 = document.getElementById("10drawBeaker");
buttonBeaker10.addEventListener("mousedown", beakerMeasurements.bind(null, 10));

// 100 mesures
const buttonBeaker100 = document.getElementById("100drawBeaker");
buttonBeaker100.addEventListener("mousedown", beakerMeasurements.bind(null, 100));

// réinitialisation
const resetButtonBeaker = document.getElementById("resetBeaker");
resetButtonBeaker.addEventListener("mousedown", function() {
    beakerData = [];
    nBeaker = 0;
    nBeakerSpan.innerText = 0;
    
    beakerMeanInput.disabled = false;
    beakerStdInput.disabled = false;
    
    beakerHist.graphics.clear();
    beakerLegend.graphics.clear();
    beakerStage.update();
});



// ===== Histogramme =====

// canvas graphique
const beakerCanvas = document.getElementById("beakerCanvas");
beakerCanvas.width = 0.3 * window.screen.width;

// stage
const beakerStage = new createjs.Stage(beakerCanvas);
beakerStage.enableMouseOver();
createjs.Touch.enable(beakerStage);
beakerStage.mouseMoveOutside = true;

// conteneur
const beakerContainer = new createjs.Container();
beakerStage.addChild(beakerContainer);
beakerContainer.x = 20;
beakerContainer.y = 230;

// histogramme
const beakerHist = new createjs.Shape();
beakerContainer.addChild(beakerHist);

drawHistogram(beakerHist, beakerBins);

// axes
const beakerAxes = new createjs.Shape();
beakerContainer.addChild(beakerAxes);
drawBeakerAxes();

const beakerXLegend = new createjs.Text("V (mL)", "16px Quicksand", 'black');
beakerContainer.addChild(beakerXLegend);
beakerXLegend.textAlign = 'center';
beakerXLegend.textBaseline = 'middle';
beakerXLegend.x = histogramWidth;
beakerXLegend.y = 20;

const beakerYLegend = new createjs.Text("fréquence", "16px Quicksand", 'black');
beakerContainer.addChild(beakerYLegend);
beakerYLegend.textAlign = 'left';
beakerYLegend.textBaseline = 'middle';
beakerYLegend.x = 10;
beakerYLegend.y = -200;

function drawBeakerAxes() {
    beakerAxes.graphics.clear();
    
    beakerAxes.graphics.ss(2, 1, 1).s('black');
    beakerAxes.graphics.mt(0, 0).lt(histogramWidth, 0);
    beakerAxes.graphics.mt(histogramWidth-5, 5).lt(histogramWidth, 0).lt(histogramWidth-5, -5);
    beakerAxes.graphics.mt(0, 0).lt(0, -200);
    beakerAxes.graphics.mt(-5, -195).lt(0, -200).lt(5, -195);

    for (i = 0; i < 4; i++) {
        beakerAxes.graphics.mt(i*0.25*histogramWidth, 0).lt(i*0.25*histogramWidth, 5);
        let beakerLabelX = new createjs.Text((min + i*(max-min)/4).toLocaleString('fr-FR'), "16px Quicksand", 'black');
        beakerContainer.addChild(beakerLabelX);
        beakerLabelX.x = i * 0.25 * histogramWidth;
        beakerLabelX.y = 18;
        beakerLabelX.textAlign = 'center';
        beakerLabelX.textBaseline = 'middle';
    }

    beakerAxes.graphics.ss(2, 1, 1).s('red');
    beakerAxes.graphics.mt(0.5*histogramWidth, 0).lt(0.5*histogramWidth, -200);
    beakerStage.update();
}

// moyenne et écart-type
const beakerLegend = new createjs.Shape();
beakerContainer.addChild(beakerLegend);

function drawBeakerLegend() {
    beakerLegend.graphics.clear();
    
    // moyenne
    let mean = computeMean(beakerData);
    let xMean = (mean-min)/(max-min) * histogramWidth;
    beakerLegend.graphics.setStrokeDash([10, 6]).s('red');    
    beakerLegend.graphics.mt(xMean, 0).lt(xMean, -200);
    
    // écart-type
    let stdDeviation = computeExpStandardDeviation(beakerData, mean);
    let xStd = stdDeviation/(max-min) * histogramWidth;
    beakerLegend.graphics.s('orange');
    beakerLegend.graphics.mt(xMean+xStd, 0).lt(xMean+xStd, -180);
    beakerLegend.graphics.mt(xMean-xStd, 0).lt(xMean-xStd, -180);
}

beakerStage.update();





//==============================
//          Éprouvette
//==============================

// création des bins
const testTubeBins = Array(numBins).fill(0);
let testTubeData = [];

// nombre de mesures
let nTestTube = 0;
const nTestTubeSpan = document.getElementById("nTestTube");
nTestTubeSpan.innerText = 0;



// ===== Valeurs mesurées =====

// moyenne
let testTubeMean = 25;
const testTubeMeanInput = document.getElementById("testTubeMean");
testTubeMeanInput.value = testTubeMean;

// écart-type expérimental
let testTubeStd = 0.1;
const testTubeStdInput = document.getElementById("testTubeStd");
testTubeStdInput.value = testTubeStd.toLocaleString('fr-FR');



// ===== Boutons =====

function updateTestTube() {
    dataToBins(testTubeData, testTubeBins);
    nTestTubeSpan.innerText = nTestTube;
    drawHistogram(testTubeHist, testTubeBins);
    drawTestTubeLegend();
    testTubeStage.update();
}

function testTubeMeasurements(n) {
    testTubeMean = parseFloat((testTubeMeanInput.value).replace(",", "."));
    testTubeStd = parseFloat((testTubeStdInput.value).replace(",", "."));
    testTubeMeanInput.disabled = true;
    testTubeStdInput.disabled = true;
    nTestTube += n;
    for (let i = 0; i < n; i++) {
        testTubeData.push(generateGaussianRandom(testTubeMean, testTubeStd));
    }
    updateTestTube();
}

// 1 mesure
const buttonTestTube1 = document.getElementById("1drawTestTube");
buttonTestTube1.addEventListener("mousedown", testTubeMeasurements.bind(null, 1));

// 10 mesures
const buttonTestTube10 = document.getElementById("10drawTestTube");
buttonTestTube10.addEventListener("mousedown", testTubeMeasurements.bind(null, 10));

// 100 mesures
const buttonTestTube100 = document.getElementById("100drawTestTube");
buttonTestTube100.addEventListener("mousedown", testTubeMeasurements.bind(null, 100));

// réinitialisation
const resetButtonTestTube = document.getElementById("resetTestTube");
resetButtonTestTube.addEventListener("mousedown", function() {
    testTubeData = [];
    nTestTube = 0;
    nTestTubeSpan.innerText = 0;
    
    testTubeMeanInput.disabled = false;
    testTubeStdInput.disabled = false;
    
    testTubeHist.graphics.clear();
    testTubeLegend.graphics.clear();
    testTubeStage.update();
});



// ===== Histogramme =====

// canvas graphique
const testTubeCanvas = document.getElementById("testTubeCanvas");
testTubeCanvas.width = 0.3 * window.screen.width;

// stage
const testTubeStage = new createjs.Stage(testTubeCanvas);
testTubeStage.enableMouseOver();
createjs.Touch.enable(testTubeStage);
testTubeStage.mouseMoveOutside = true;

// conteneur
const testTubeContainer = new createjs.Container();
testTubeStage.addChild(testTubeContainer);
testTubeContainer.x = 20;
testTubeContainer.y = 230;

// histogramme
const testTubeHist = new createjs.Shape();
testTubeContainer.addChild(testTubeHist);

drawHistogram(testTubeHist, testTubeBins);

// axes
const testTubeAxes = new createjs.Shape();
testTubeContainer.addChild(testTubeAxes);
drawTestTubeAxes();

const testTubeXLegend = new createjs.Text("V (mL)", "16px Quicksand", 'black');
testTubeContainer.addChild(testTubeXLegend);
testTubeXLegend.textAlign = 'center';
testTubeXLegend.textBaseline = 'middle';
testTubeXLegend.x = histogramWidth;
testTubeXLegend.y = 20;

const testTubeYLegend = new createjs.Text("fréquence", "16px Quicksand", 'black');
testTubeContainer.addChild(testTubeYLegend);
testTubeYLegend.textAlign = 'left';
testTubeYLegend.textBaseline = 'middle';
testTubeYLegend.x = 10;
testTubeYLegend.y = -200;

function drawTestTubeAxes() {
    testTubeAxes.graphics.clear();
    
    testTubeAxes.graphics.ss(2, 1, 1).s('black');
    testTubeAxes.graphics.mt(0, 0).lt(histogramWidth, 0);
    testTubeAxes.graphics.mt(histogramWidth-5, 5).lt(histogramWidth, 0).lt(histogramWidth-5, -5);
    testTubeAxes.graphics.mt(0, 0).lt(0, -200);
    testTubeAxes.graphics.mt(-5, -195).lt(0, -200).lt(5, -195);

    for (i = 0; i < 4; i++) {
        testTubeAxes.graphics.mt(i*0.25*histogramWidth, 0).lt(i*0.25*histogramWidth, 5);
        let testTubeLabelX = new createjs.Text((min + i*(max-min)/4).toLocaleString('fr-FR'), "16px Quicksand", 'black');
        testTubeContainer.addChild(testTubeLabelX);
        testTubeLabelX.x = i * 0.25 * histogramWidth;
        testTubeLabelX.y = 18;
        testTubeLabelX.textAlign = 'center';
        testTubeLabelX.textBaseline = 'middle';
    }

    testTubeAxes.graphics.ss(2, 1, 1).s('red');
    testTubeAxes.graphics.mt(0.5*histogramWidth, 0).lt(0.5*histogramWidth, -200);
    testTubeStage.update();
}

// moyenne et écart-type
const testTubeLegend = new createjs.Shape();
testTubeContainer.addChild(testTubeLegend);

function drawTestTubeLegend() {
    testTubeLegend.graphics.clear();
    
    // moyenne
    let mean = computeMean(testTubeData);
    let xMean = (mean-min)/(max-min) * histogramWidth;
    testTubeLegend.graphics.setStrokeDash([10, 6]).s('red');    
    testTubeLegend.graphics.mt(xMean, 0).lt(xMean, -200);
    
    // écart-type
    let stdDeviation = computeExpStandardDeviation(testTubeData, mean);
    let xStd = stdDeviation/(max-min) * histogramWidth;
    testTubeLegend.graphics.s('orange');
    testTubeLegend.graphics.mt(xMean+xStd, 0).lt(xMean+xStd, -180);
    testTubeLegend.graphics.mt(xMean-xStd, 0).lt(xMean-xStd, -180);
}

testTubeStage.update();





//==============================
//            Fiole
//==============================

// création des bins
const flaskBins = Array(numBins).fill(0);
let flaskData = [];

// nombre de mesures
let nFlask = 0;
const nFlaskSpan = document.getElementById("nFlask");
nFlaskSpan.innerText = 0;



// ===== Valeurs mesurées =====

// moyenne
let flaskMean = 25;
const flaskMeanInput = document.getElementById("flaskMean");
flaskMeanInput.value = flaskMean;

// écart-type expérimental
let flaskStd = 0.08;
const flaskStdInput = document.getElementById("flaskStd");
flaskStdInput.value = flaskStd.toLocaleString('fr-FR');



// ===== Boutons =====

function updateFlask() {
    dataToBins(flaskData, flaskBins);
    nFlaskSpan.innerText = nFlask;
    drawHistogram(flaskHist, flaskBins);
    drawFlaskLegend();
    flaskStage.update();
}

function flaskMeasurements(n) {
    flaskMean = parseFloat((flaskMeanInput.value).replace(",", "."));
    flaskStd = parseFloat((flaskStdInput.value).replace(",", "."));
    flaskMeanInput.disabled = true;
    flaskStdInput.disabled = true;
    nFlask += n;
    for (let i = 0; i < n; i++) {
        flaskData.push(generateGaussianRandom(flaskMean, flaskStd));
    }
    updateFlask();
}

// 1 mesure
const buttonFlask1 = document.getElementById("1drawFlask");
buttonFlask1.addEventListener("mousedown", flaskMeasurements.bind(null, 1));

// 10 mesures
const buttonFlask10 = document.getElementById("10drawFlask");
buttonFlask10.addEventListener("mousedown", flaskMeasurements.bind(null, 10));

// 100 mesures
const buttonFlask100 = document.getElementById("100drawFlask");
buttonFlask100.addEventListener("mousedown", flaskMeasurements.bind(null, 100));

// réinitialisation
const resetButtonFlask = document.getElementById("resetFlask");
resetButtonFlask.addEventListener("mousedown", function() {
    flaskData = [];
    nFlask = 0;
    nFlaskSpan.innerText = 0;
    
    flaskMeanInput.disabled = false;
    flaskStdInput.disabled = false;
    
    flaskHist.graphics.clear();
    flaskLegend.graphics.clear();
    flaskStage.update();
});



// ===== Histogramme =====

// canvas graphique
const flaskCanvas = document.getElementById("flaskCanvas");
flaskCanvas.width = 0.3 * window.screen.width;

// stage
const flaskStage = new createjs.Stage(flaskCanvas);
flaskStage.enableMouseOver();
createjs.Touch.enable(flaskStage);
flaskStage.mouseMoveOutside = true;

// conteneur
const flaskContainer = new createjs.Container();
flaskStage.addChild(flaskContainer);
flaskContainer.x = 20;
flaskContainer.y = 230;

// histogramme
const flaskHist = new createjs.Shape();
flaskContainer.addChild(flaskHist);

drawHistogram(flaskHist, flaskBins);

// axes
const flaskAxes = new createjs.Shape();
flaskContainer.addChild(flaskAxes);
drawFlaskAxes();

const flaskXLegend = new createjs.Text("V (mL)", "16px Quicksand", 'black');
flaskContainer.addChild(flaskXLegend);
flaskXLegend.textAlign = 'center';
flaskXLegend.textBaseline = 'middle';
flaskXLegend.x = histogramWidth;
flaskXLegend.y = 20;

const flaskYLegend = new createjs.Text("fréquence", "16px Quicksand", 'black');
flaskContainer.addChild(flaskYLegend);
flaskYLegend.textAlign = 'left';
flaskYLegend.textBaseline = 'middle';
flaskYLegend.x = 10;
flaskYLegend.y = -200;

function drawFlaskAxes() {
    flaskAxes.graphics.clear();
    
    flaskAxes.graphics.ss(2, 1, 1).s('black');
    flaskAxes.graphics.mt(0, 0).lt(histogramWidth, 0);
    flaskAxes.graphics.mt(histogramWidth-5, 5).lt(histogramWidth, 0).lt(histogramWidth-5, -5);
    flaskAxes.graphics.mt(0, 0).lt(0, -200);
    flaskAxes.graphics.mt(-5, -195).lt(0, -200).lt(5, -195);

    for (i = 0; i < 4; i++) {
        flaskAxes.graphics.mt(i*0.25*histogramWidth, 0).lt(i*0.25*histogramWidth, 5);
        let flaskLabelX = new createjs.Text((min + i*(max-min)/4).toLocaleString('fr-FR'), "16px Quicksand", 'black');
        flaskContainer.addChild(flaskLabelX);
        flaskLabelX.x = i * 0.25 * histogramWidth;
        flaskLabelX.y = 18;
        flaskLabelX.textAlign = 'center';
        flaskLabelX.textBaseline = 'middle';
    }

    flaskAxes.graphics.ss(2, 1, 1).s('red');
    flaskAxes.graphics.mt(0.5*histogramWidth, 0).lt(0.5*histogramWidth, -200);
    flaskStage.update();
}

// moyenne et écart-type
const flaskLegend = new createjs.Shape();
flaskContainer.addChild(flaskLegend);

function drawFlaskLegend() {
    flaskLegend.graphics.clear();
    
    // moyenne
    let mean = computeMean(flaskData);
    let xMean = (mean-min)/(max-min) * histogramWidth;
    flaskLegend.graphics.setStrokeDash([10, 6]).s('red');    
    flaskLegend.graphics.mt(xMean, 0).lt(xMean, -200);
    
    // écart-type
    let stdDeviation = computeExpStandardDeviation(flaskData, mean);
    let xStd = stdDeviation/(max-min) * histogramWidth;
    flaskLegend.graphics.s('orange');
    flaskLegend.graphics.mt(xMean+xStd, 0).lt(xMean+xStd, -180);
    flaskLegend.graphics.mt(xMean-xStd, 0).lt(xMean-xStd, -180);
}

flaskStage.update();