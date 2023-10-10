/*
    --------------------------------
    |       Sons périodiques       |
    --------------------------------

    Cette simulation permet de visualiser un signal sinusoïdal.
    Paramètres :
        - fréquence du signal ;
        - amplitude du signal.
    Deux motifs élémentaires sont mis en évidence, ainsi que la
    période du signal. L'intensité sonore et le niveau d'intensité
    sonore sont affichés.
    Il est possible d'émettre le signal représenté.
*/




//==============================
// Initialisation des paramètres
//==============================

let frequency = 440;
let amplitude = 80;
const xScale = 1/40000;
let showPeriods = true;
let periodText = "T = " + (1000/frequency).toLocaleString('fr-FR', {maximumFractionDigits: 1}) + " ms";
let xFirstTop = 1/(4*frequency*xScale);
let play = false;





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

const xminCursor = 0.5*(window.screen.width-lineLength)-50;    // position de l'extrémité gauche des curseurs
const xmaxCursor = xminCursor + lineLength;



// ===== Curseur pour la fréquence ====

const minFrequency = 220;
const maxFrequency = 1000;

const yFrequency = 50;      // position verticale

cursorLine(xminCursor, yFrequency, settingsStage);
cursorText("Fréquence du signal", xminCursor-210, yFrequency, settingsStage);
cursorText("Hz", xmaxCursor+110, yFrequency, settingsStage);
const frequencyButton = cursorButton(
    'red',
    xminCursor+(frequency-minFrequency)/(maxFrequency-minFrequency)*lineLength,
    yFrequency,
    settingsStage
);
const frequencyText = cursorText("", xmaxCursor+20, yFrequency, settingsStage);

function getFrequency() {
    /*
        Calcule la fréquence en fonction de la position du curseur
        et met à jour l'affichage de la valeur à côté du curseur
        et celui de la période.
    */
    frequency = (frequencyButton.x - xminCursor) / lineLength * (maxFrequency - minFrequency) + minFrequency;
    frequencyText.text = frequency.toLocaleString('fr-FR', {maximumFractionDigits: 0});
    periodText = "T = " + (1000/frequency).toLocaleString('fr-FR', {maximumFractionDigits: 1}) + " ms";
    xFirstTop = 1/(4*frequency*xScale);
}



// ==== Curseur pour l'amplitude ====

const minAmplitude = 10;
const maxAmplitude = 160;

const yAmplitude = 100;     // position verticale

cursorLine(xminCursor, yAmplitude, settingsStage);
cursorText("Intensité sonore", xminCursor-210, yAmplitude, settingsStage);
cursorText("W/m²", xmaxCursor+110, yAmplitude, settingsStage);
const amplitudeButton = cursorButton(
    'red',
    xminCursor+(amplitude-minAmplitude)/(maxAmplitude-minAmplitude)*lineLength,
    yAmplitude,
    settingsStage
);
const amplitudeText = cursorText("", xmaxCursor+20, yAmplitude, settingsStage);

function getAmplitude() {
    /*
        Calcule l'amplitude en fonction de la position du curseur
        et met à jour l'affichage de la valeur à côté du curseur.
    */
    amplitude = (amplitudeButton.x - xminCursor) / lineLength * (maxAmplitude - minAmplitude) + minAmplitude;
    amplitudeText.text = amplitude.toLocaleString('fr-FR', {maximumFractionDigits: 0}) + " × 10⁻⁶";
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
        Action lors du déplacement d'un curseur : la fréquence
        est mise à jour et le graphe est tracé. Si le son est
        activé, sa fréquence est adaptée.
    */
    button = event.currentTarget;
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xmaxCursor);
    
    update();
}

frequencyButton.addEventListener('mousedown', onMouseDown);
frequencyButton.addEventListener('pressmove', onPressMove);

amplitudeButton.addEventListener('mousedown', onMouseDown);
amplitudeButton.addEventListener('pressmove', onPressMove);





//==============================
//       Contexte audio
//==============================

// ==== Création du contexte audio ====

let ac = new (window.AudioContext || window.webkitAudioContext)();
let source = ac.createBufferSource();
let gainNode = ac.createGain();
let analyser = ac.createAnalyser();
gainNode.gain.value = 1;
source.connect(gainNode).connect(analyser).connect(ac.destination);



// ==== Bouton "Play" ====

let playButton = new createjs.Shape();
settingsStage.addChild(playButton);
playButton.x = xmaxCursor+230;
playButton.y = (yFrequency+yAmplitude)/2;
playButton.cursor = 'pointer';

playButton.graphics.ss(3, 1, 1).s('black').f('black');
playButton.graphics.mt(0, 0).lt(-40, 20).lt(-40, -20).lt(0, 0);

playButton.addEventListener("click", function() {
    play = true;
    playSound();
});



// ==== Bouton "Pause" ====

let pauseButton = new createjs.Shape();
settingsStage.addChild(pauseButton);
pauseButton.x = xmaxCursor+250;
pauseButton.y = (yFrequency+yAmplitude)/2;
pauseButton.cursor = 'pointer';

pauseButton.graphics.ss(3, 1, 1).s('white').f('white');
pauseButton.graphics.drawRect(0, -20,40, 40);
pauseButton.graphics.ss(3, 1, 1).s('black').f('black');
pauseButton.graphics.drawRect(0, -20, 15, 40);
pauseButton.graphics.drawRect(25, -20, 15, 40);

pauseButton.addEventListener("click", function (){
    play = false;
    source.stop(ac.currentTime);
});



function playSound() {
    /*
        Joue un son sinusoïdal à la fréquence choisie.
    */
	source.disconnect(gainNode);
	source = ac.createOscillator();
	source.type = 'sine';
	source.frequency.value = frequency;
	gainNode.gain.setValueAtTime(amplitude/maxAmplitude, ac.currentTime);
	source.connect(gainNode);
	source.start(ac.currentTime);
}





//==============================
//       Canvas graphique
//==============================

let graphicCanvas = document.getElementById("graphic_canvas");
graphicCanvas.width = window.screen.width;
graphicCanvas.height = 390;

let graphicStage = new createjs.Stage(graphicCanvas);



// ===== Conteneur du graphe =====

let plotContainer = new createjs.Container();
graphicStage.addChild(plotContainer);
plotContainer.x = window.screen.width/2-320;
plotContainer.y = 190;



// ===== Axes =====

let axes = new createjs.Shape();
plotContainer.addChild(axes);

axes.graphics.ss(2, 1, 1).s('black');
axes.graphics.mt(0, 170).lt(0, -170).lt(800, -170).lt(800, 170).lt(0, 170)
axes.graphics.mt(0, 0).lt(800, 0);

// flèches
axes.graphics.mt(795, 5).lt(800, 0).lt(795, -5);
axes.graphics.mt(-5, -165).lt(0, -170).lt(5, -165);

// échelle
for (x = 0; x < 801; x += 80) {
    axes.graphics.mt(x, 170).lt(x, 175);
    let axesLegend = new createjs.Text(
        (x*xScale * 1000).toLocaleString('fr-FR', {maximumFractionDigits: 3}),
        "16px Quicksand",
        'black'
    );
    plotContainer.addChild(axesLegend);
    axesLegend.x = x;
    axesLegend.y = 188;
    axesLegend.textBaseline = 'middle';
    axesLegend.textAlign = 'center';
}

// légende
let timeLegend = new createjs.Text("temps (ms)", "16px Quicksand", 'black');
plotContainer.addChild(timeLegend);
timeLegend.x = 810;
timeLegend.y = 0;
timeLegend.textBaseline = 'middle';

let amplitudeLegend = new createjs.Text("amplitude", "16px Quicksand", 'black');
plotContainer.addChild(amplitudeLegend);
amplitudeLegend.x = 0;
amplitudeLegend.y = -190;
amplitudeLegend.textBaseLine = 'middle';
amplitudeLegend.textAlign = 'left';



// ==== Graphe ====

let plot = new createjs.Shape();
plotContainer.addChild(plot);

let periodArrows = new createjs.Shape();
plotContainer.addChild(periodArrows);

let firstPeriodText = new createjs.Text(periodText, "16px Quicksand", 'green');
plotContainer.addChild(firstPeriodText);
firstPeriodText.textAlign = 'center';
firstPeriodText.textBaseline = 'middle';
firstPeriodText.y = -140;

let secondPeriodText = new createjs.Text(periodText, "16px Quicksand", 'blue');
plotContainer.addChild(secondPeriodText);
secondPeriodText.textAlign = 'center';
secondPeriodText.textBaseline = 'middle';
secondPeriodText.y = 140;

function signal(x) {
    /*
        Renvoie l'amplitude du signal à l'abscisse x.
    */
    return -0.65*amplitude * Math.sin(2 * Math.PI * frequency * x*xScale);
}

function updatePlot() {
    /*
        Met à jour le graphe.
    */
    plot.graphics.clear();
        
    plot.graphics.ss(3, 1, 1).s('red');
    plot.graphics.mt(0, 0);    
    for (x = 1; x < 801; x++) {
        plot.graphics.lt(x, signal(x));
    }
    
    // ==== Premier motif ====
    plot.graphics.s('green');
    plot.graphics.mt(xFirstTop, signal(xFirstTop));
    for (x = xFirstTop+1; x <= 5*xFirstTop; x += 4*xFirstTop/100) {
        plot.graphics.lt(x, signal(x));
    }
    
    // ==== Deuxième motif ====
    plot.graphics.s('blue');
    plot.graphics.mt(11*xFirstTop, signal(11*xFirstTop));
    for (x = 11*xFirstTop+1; x <= 15*xFirstTop; x += 4*xFirstTop/100) {
        plot.graphics.lt(x, signal(x));
    }

    graphicStage.update();
}

function updateArrows() {
    /*
        Trace les flèches délimitant les périodes mises en évidence.
    */
    periodArrows.graphics.clear();
    
    // ==== Flèche du haut ====
    periodArrows.graphics.s('green');
    periodArrows.graphics.mt(xFirstTop, -120);
    periodArrows.graphics.lt(5*xFirstTop, -120);
    
    periodArrows.graphics.mt(xFirstTop+5, -125);
    periodArrows.graphics.lt(xFirstTop, -120);
    periodArrows.graphics.lt(xFirstTop+5, -115);

    periodArrows.graphics.mt(5*xFirstTop-5, -125);
    periodArrows.graphics.lt(5*xFirstTop, -120);
    periodArrows.graphics.lt(5*xFirstTop-5, -115);
    
    firstPeriodText.x = 3*xFirstTop;
    firstPeriodText.text = periodText;
    
    // ==== Flèche du bas ====
    periodArrows.graphics.s('blue');
    periodArrows.graphics.mt(11*xFirstTop, 120);
    periodArrows.graphics.lt(15*xFirstTop, 120);
    
    periodArrows.graphics.mt(11*xFirstTop+5, 125);
    periodArrows.graphics.lt(11*xFirstTop, 120);
    periodArrows.graphics.lt(11*xFirstTop+5, 115);

    periodArrows.graphics.mt(15*xFirstTop-5, 125);
    periodArrows.graphics.lt(15*xFirstTop, 120);
    periodArrows.graphics.lt(15*xFirstTop-5, 115);
    
    secondPeriodText.x = 13*xFirstTop;
    secondPeriodText.text = periodText;
}



// ==== Niveau d'intensité sonore ====

let levelContainer = new createjs.Container();
graphicStage.addChild(levelContainer);
levelContainer.x = plotContainer.x-80;
levelContainer.y = plotContainer.y-170;

// cadre niveau d'intensité sonore
let levelAxes = new createjs.Shape();
levelContainer.addChild(levelAxes);
levelAxes.graphics.ss(2, 1, 1).s('black');
levelAxes.graphics.drawRect(0, 0, 30, 340);

// échelle du niveau d'intensité sonore
for (y = 0; y < 341; y += 34) {
    levelAxes.graphics.mt(30, y).lt(35, y);
    let levelBarLegend = new createjs.Text(
        (100-10*y/34).toLocaleString('fr-FR', {maximumFractionDigits: 0}),
        "16px Quicksand",
        'black'
    );
    levelContainer.addChild(levelBarLegend);
    levelBarLegend.x = 40;
    levelBarLegend.y = y;
    levelBarLegend.textBaseline = 'middle';
    levelBarLegend.textAlign = 'left';
}

// légende
let levelText = new createjs.Text("Niveau d'intensité sonore (dB)", "16px Quicksand", 'black');
levelContainer.addChild(levelText);
levelText.rotation = -90;
levelText.x = -25;
levelText.y = plotContainer.y;
levelText.textAlign = 'center';

// barre du niveau d'intensité sonore
let levelBar = new createjs.Shape();
levelContainer.addChild(levelBar);

let levelValue = new createjs.Text((60 + 10*Math.log10(amplitude)).toLocaleString('fr-FR', {maximumFractionDigits: 0}), "16px Quicksand", 'green');
levelContainer.addChild(levelValue);
levelValue.x = 15;
levelValue.y = -20;
levelValue.textAlign = 'center';

function drawLevel() {
    /*
        Trace la barre représentant le niveau d'intensité sonore.
    */
    levelBar.graphics.clear();
    levelBar.graphics.ss(1, 1, 1).f('green');
    levelBar.graphics.drawRect(1, 340, 28, -(6 + Math.log10(amplitude))*34);
    
    levelValue.text = (60 + 10*Math.log10(amplitude)).toLocaleString('fr-FR', {maximumFractionDigits: 1});
}



// ==== Intensité sonore ====

let intensityContainer = new createjs.Container();
graphicStage.addChild(intensityContainer);
intensityContainer.x = plotContainer.x-190;
intensityContainer.y = plotContainer.y-170;

// cadre intensité sonore
let intensityAxes = new createjs.Shape();
intensityContainer.addChild(intensityAxes);
intensityAxes.graphics.ss(2, 1, 1).s('black');
intensityAxes.graphics.drawRect(0, 0, 30, 340);

// échelle de l'intensité sonore
for (y = 0; y < 341; y += 20) {
    intensityAxes.graphics.mt(30, y).lt(35, y);
    let intensityBarLegend = new createjs.Text(
        (170-y/2).toLocaleString('fr-FR', {maximumFractionDigits: 0}),
        "16px Quicksand",
        'black'
    );
    intensityContainer.addChild(intensityBarLegend);
    intensityBarLegend.x = 40;
    intensityBarLegend.y = y;
    intensityBarLegend.textBaseline = 'middle';
    intensityBarLegend.textAlign = 'left';
}

// légende
let intensityText = new createjs.Text("Intensité sonore (× 10⁻⁶ W/m²)", "16px Quicksand", 'black');
intensityContainer.addChild(intensityText);
intensityText.rotation = -90;
intensityText.x = -25;
intensityText.y = plotContainer.y;
intensityText.textAlign = 'center';

// barre de l'intensité sonore
let intensityBar = new createjs.Shape();
intensityContainer.addChild(intensityBar);

let intensityValue = new createjs.Text(amplitude.toLocaleString('fr-FR', {maximumFractionDigits: 0}), "16px Quicksand", 'red');
intensityContainer.addChild(intensityValue);
intensityValue.x = 15;
intensityValue.y = -20;
intensityValue.textAlign = 'center';

function drawIntensity() {
    /*
        Trace la barre représentant l'intensité sonore.
    */
    intensityBar.graphics.clear();
    intensityBar.graphics.ss(1, 1, 1).f('red');
    intensityBar.graphics.drawRect(1, 340, 28, -amplitude*2);
    
    intensityValue.text = amplitude.toLocaleString('fr-FR', {maximumFractionDigits: 0});
}





//==============================
//       Initialisation
//==============================

function update() {
    /*
        Mise à jour.
    */
    getFrequency();
    getAmplitude();
    updatePlot();
    drawLevel();
    drawIntensity();
    if (showPeriods) {
        updateArrows();
    }
    settingsStage.update();
    graphicStage.update();
    if (play) {
        playSound();
    }
}

getFrequency();
getAmplitude();
drawLevel();
drawIntensity();
updatePlot();
updateArrows();
settingsStage.update();
graphicStage.update();