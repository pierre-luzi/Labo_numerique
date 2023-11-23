/*
    ---------------------------------
    | Longueur d'onde des ultrasons |
    ---------------------------------


*/

const amplitude = 30;
const wavelength = 50;
const period = 1000; // 500 ms



const waveCanvas = document.getElementById("wave_canvas");
waveCanvas.width = 0.8 * window.screen.width;
waveCanvas.height = 160;

const waveStage = new createjs.Stage(waveCanvas);
waveStage.enableMouseOver();
createjs.Touch.enable(waveStage);
waveStage.mouseMoveOutside = true;

const container = new createjs.Container();
waveStage.addChild(container);
container.x = 120;
container.y = 80;



// ==== Émetteur ====

const transmitter = new createjs.Shape();
container.addChild(transmitter);
transmitter.graphics.ss(3, 1, 1).f('black');
transmitter.graphics.drawRect(-120, -20, 120, 40);

const transmitterLegend = new createjs.Text("Émetteur", "20px Quicksand", 'white');
container.addChild(transmitterLegend);
transmitterLegend.x = -60;
transmitterLegend.y = 0;
transmitterLegend.textAlign = 'center';
transmitterLegend.textBaseline = 'middle';



// ==== Récepteur fixe ====

const fixedContainer = new createjs.Container();
container.addChild(fixedContainer);
fixedContainer.x = 300;
fixedContainer.y = -60; 

const fixedReceiver = new createjs.Shape();
fixedContainer.addChild(fixedReceiver);
fixedReceiver.graphics.ss(3, 1, 1).f('black');
fixedReceiver.graphics.drawRect(0, -20, 120, 40);

const fixedReceiverLegend = new createjs.Text("Récepteur", "20px Quicksand", '#99f');
fixedContainer.addChild(fixedReceiverLegend);
fixedReceiverLegend.x = 60;
fixedReceiverLegend.y = 0;
fixedReceiverLegend.textAlign = 'center';
fixedReceiverLegend.textBaseline = 'middle';



// ==== Récepteur mobile ====

const mobileContainer = new createjs.Container();
container.addChild(mobileContainer);
mobileContainer.x = 300;
mobileContainer.y = 60;
mobileContainer.cursor = 'grab';

const mobileReceiver = new createjs.Shape();
mobileContainer.addChild(mobileReceiver);
mobileReceiver.graphics.ss(3, 1, 1).f('black');
mobileReceiver.graphics.drawRect(0, -20, 120, 40);

const mobileReceiverLegend = new createjs.Text("Récepteur", "20px Quicksand", 'orange');
mobileContainer.addChild(mobileReceiverLegend);
mobileReceiverLegend.x = 60;
mobileReceiverLegend.y = 0;
mobileReceiverLegend.textAlign = 'center';
mobileReceiverLegend.textBaseline = 'middle';

const arrows = new createjs.Shape();
arrows.graphics.ss(3, 1, 1).s('orange');
arrows.graphics.mt(130, 0).lt(180, 0);
arrows.graphics.mt(175, -5).lt(180, 0).lt(175, 5);
arrows.graphics.mt(-10, 0).lt(-60, 0);
arrows.graphics.mt(-55, -5).lt(-60, 0).lt(-55, 5);

function onMouseDown(event) {
    /*
        Cette fonction calcule le décalage entre l'objet
        et la position de l'évènement lors d'un clic.
    */
    object = event.currentTarget;
    object.offsetX = object.x - event.stageX;
}

function onPressMove(event) {
    /*
        Cette fonction met à jour le curseur et
        les graphes lors du déplacement d'un bouton.
    */
    object = event.currentTarget;
    object.x = Math.min(
        Math.max(
            10,
            event.stageX + object.offsetX
        ),
        650
    );
    mobilePointer.x = object.x;
    waveStage.update();
}

mobileContainer.addEventListener("mouseover", function() {
    mobileContainer.addChild(arrows);
});
mobileContainer.addEventListener("mouseout", function() {
    mobileContainer.removeChild(arrows);
});
mobileContainer.addEventListener("mousedown", onMouseDown);
mobileContainer.addEventListener("pressmove", onPressMove);




const wave = new createjs.Shape();
container.addChild(wave);

const fixedPointer = new createjs.Shape();
container.addChild(fixedPointer);
fixedPointer.graphics.ss(3, 1, 1).f('#99f');
fixedPointer.graphics.dc(0, 0, 5);
fixedPointer.x = fixedContainer.x;

const mobilePointer = new createjs.Shape();
container.addChild(mobilePointer);
mobilePointer.graphics.ss(3, 1, 1).f('orange');
mobilePointer.graphics.dc(0, 0, 5);
mobilePointer.x = mobileContainer.x;

function signal(time, x) {
    /*
        Renvoie la valeur de l'amplitude de l'onde.
        Arguments :
            - time : date ;
            - x : position longitudinale.
    */
    let phase = time - x / wavelength * period;
    return amplitude * Math.sin(2 * Math.PI / period * phase);
}

function drawWave(time) {
    /*
        Dessine l'onde.
    */
    wave.graphics.clear();
    wave.graphics.ss(3, 1, 1).s('red');
    
    wave.graphics.mt(0, signal(time, 0));
    for (let x = 0; x < waveCanvas.width-120; x++) {
        wave.graphics.lt(x, signal(time, x));
    }
    
    fixedPointer.y = signal(time, fixedContainer.x);
    mobilePointer.y = signal(time, mobileContainer.x);
    
    waveStage.update();
}

function propagateWave() {
    /*
        Anime la propagation de l'onde.
    */
    let time = 0;
    const deltaTime = 20;
    
    clearInterval(interval);
    interval = setInterval(animate, deltaTime);
    
    function animate() {
        time += deltaTime;
        drawWave(time);
        drawPlots(time);
    }
}





//======================================
//             Oscilloscope
//======================================

const plotCanvas = document.getElementById("plot_canvas");
plotCanvas.width = 400;
plotCanvas.height = 310;

const plotStage = new createjs.Stage(plotCanvas);
plotStage.enableMouseOver();
createjs.Touch.enable(plotStage);
plotStage.mouseMoveOutside = true;

const plotContainer = new createjs.Container();
plotStage.addChild(plotContainer);
plotContainer.x = 5;
plotContainer.y = 155;

const axes = new createjs.Shape();
plotContainer.addChild(axes);

axes.graphics.ss(1, 1, 1).f('#cfc');
axes.graphics.drawRect(0, -150, 300, 300);

axes.graphics.ss(2, 1, 1).s('black');
axes.graphics.mt(0, 0).lt(300, 0);
axes.graphics.mt(150, -150).lt(150, 150);
axes.graphics.mt(290, -10).lt(300, 0).lt(290, 10);
axes.graphics.mt(140, -140).lt(150, -150).lt(160, -140);

const timeLegend = new createjs.Text("temps", "20px Quicksand", 'black');
plotContainer.addChild(timeLegend);
timeLegend.x = 310;
timeLegend.y = 0;
timeLegend.textAlign = 'left';
timeLegend.textBaseline = 'middle';

const fixedPlot = new createjs.Shape();
plotContainer.addChild(fixedPlot);

const mobilePlot = new createjs.Shape();
plotContainer.addChild(mobilePlot);

function drawPlots(time) {
    fixedPlot.graphics.clear();
    fixedPlot.graphics.ss(3, 1, 1).s('#99f');
    
    fixedPlot.graphics.mt(300, signal(fixedContainer.x, 0));
    for (let x = 1; x < 301; x++) {
        fixedPlot.graphics.lt(300-x, 3 * signal(- 3.5 * period * x / 300, fixedContainer.x));
    }
    
    mobilePlot.graphics.clear();
    mobilePlot.graphics.ss(3, 1, 1).s('orange');
    
    mobilePlot.graphics.mt(300, signal(mobileContainer.x, 0));
    for (let x = 1; x < 301; x++) {
        mobilePlot.graphics.lt(300-x, 3 * signal(- 3.5 * period * x / 300, mobileContainer.x-fixedContainer.x));
    }
    
    plotStage.update();
}







waveStage.update();
plotStage.update();

let interval = null;
propagateWave();