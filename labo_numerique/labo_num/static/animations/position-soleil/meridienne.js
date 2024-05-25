/*
    ---------------------------------
    |      Méridienne de Paris      |
    ---------------------------------


*/

// mode
// let mode = 'spectrum';

// let day = 0;
// let time = 0;
// let meanAnomaly = 0;
// let trueAnomaly = 0;
// let altitude = 0;
//
// const rad = Math.PI/180;
// const obliquity = 23.436170;
// // anomalie vraie à l'équinoxe
// const equinoxTrueAnomaly = 77.02230;
// const equinoxEarthRotation = 224.38;
//
// let theta = trueAnomaly - equinoxTrueAnomaly;
// let earthRotation = 0;

latitude = 48;





const canvas = document.getElementById("canvas");
canvas.width = 0.95 * window.screen.width;
canvas.height = 0.6 * window.screen.height;

const stage = new createjs.Stage(canvas);
stage.enableMouseOver();
createjs.Touch.enable(stage);
stage.mouseMoveOutside = true;

const container = new createjs.Container();
stage.addChild(container);
container.x = 100;
container.y = 30;





//==============================
//           Curseurs
//==============================

lineLength = 365;
cursorFont = "18px Quicksand";

const xminCursor = 60;    // position de l'extrémité gauche des curseurs
const xmaxCursor = xminCursor + lineLength;



// ===== Curseur pour le jour de l'année =====

const minDay = 0;
const maxDay = 365;

const yDay = 250;      // position verticale

cursorLine(xminCursor, yDay, stage);
// cursorText("Jour de l'année", xminCursor-190, yDay, stage);
const dayButton = cursorButton(
    'orange',
    xminCursor,
    yDay,
    stage
);
const dayText = cursorText("", xminCursor+0.5*lineLength, yDay+30, stage);
dayText.textAlign = 'center';
getDay();

function getDay() {
    /*
        Calcule le jour de l'année en fonction de la position du curseur
        et met à jour l'affichage de la valeur à côté du curseur.
    */
    day = ((dayButton.x - xminCursor) / lineLength * (maxDay - minDay) + minDay);
    date = new Date(1.704063600e12+day*86400e3+time*1e3);
    if (date.getDate() == 1) {
        dayText.text = date.getDate() + 'er ' + month(date);
    } else {
        dayText.text = date.getDate() + ' ' + month(date);
    }
    stage.update();
}



// ===== Fonctions de mise à jour =====

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
        Action lors du déplacement d'un curseur : la fréquence
        est mise à jour et le graphe est tracé. Si le son est
        activé, sa fréquence est adaptée.
    */
    button = event.currentTarget;
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xmaxCursor);
    
    getDay();
    
    computeMeanAnomaly();
    computeTrueAnomaly();
    computeTheta();
    computeEarthRotation();
    computeAltitude();
    
    drawSunRay();
    drawPointer();
    moveSun();
}

dayButton.addEventListener("mousedown", onMouseDown);
dayButton.addEventListener("pressmove", onPressMove);





//==============================
//            Courbe
//==============================

const plotContainer = new createjs.Container();
stage.addChild(plotContainer);
plotContainer.x = 60;
plotContainer.y = 215;



// ===== Axes =====

const axes = new createjs.Shape();
axes.graphics.ss(2, 1, 1).s('black');

// axes des abscisses
axes.graphics.mt(0, 0).lt(380, 0);
axes.graphics.mt(375,-5).lt(380,0).lt(375,5);

// axe des ordonnées
axes.graphics.mt(0, 0).lt(0, -205);
axes.graphics.mt(-5,-200).lt(0,-205).lt(5,-200);

// échelle axe des abscisses
for (i = 0; i <= 360; i+=30) {
    axes.graphics.mt(i, 5).lt(i, -5);
    tick = new createjs.Text(i, "12px Quicksand", 'black');
    tick.x = i;
    tick.y = 10;
    tick.textAlign = 'center';
    plotContainer.addChild(tick);
}

// échelle axe des ordonnées
for (i = 0; i < 8; i++) {
    axes.graphics.mt(-5, -i*25).lt(5, -i*25);
    tick = new createjs.Text(i*10 + '°', "12px Quicksand", 'black');
    tick.x = -10;
    tick.y = -i*25;
    tick.textAlign = 'right';
    tick.textBaseline = 'middle';
    plotContainer.addChild(tick);
}
axes.graphics.ss(1, 1, 1).s('rgb(180, 180, 180)');

// grille ordonnées
for (i = 0; i < 8; i++) {
    axes.graphics.mt(5, -i*25).lt(380, -i*25);
}

plotContainer.addChild(axes);

// légende abscisses
const xLegend = new createjs.Text("jour de l'année", "16px Quicksand", 'black');
plotContainer.addChild(xLegend);
xLegend.x = 390;
xLegend.y = 0;
xLegend.textAlign = 'left';
xLegend.textBaseline = 'middle';

// légende ordonnées
const yLegend = new createjs.Text("altitude du Soleil", "16px Quicksand", 'black');
plotContainer.addChild(yLegend);
yLegend.x = 10;
yLegend.y = -205;
yLegend.textAlign = 'left';
yLegend.textBaseline = 'middle';



// ===== Graphe =====

const plot = new createjs.Shape();
plotContainer.addChild(plot);

let days = [];
let altitudes = [];

function drawPlot() {
    /*
        Trace le graphe représentant l'altitude du Soleil en fonction
        du jour de l'année.
    */
    plot.graphics.ss(2, 1, 1).s('red');
    
    for (day = 0; day < 366; day++) {
        time = 43200 + equationOfTime() * 60;
        computeMeanAnomaly();
        computeTrueAnomaly();
        computeTheta();
        computeEarthRotation();
        computeAltitude();
        
        if (day == 0) {
            plot.graphics.mt(day, -2.5*altitude/rad);
        } else {
            plot.graphics.lt(day, -2.5*altitude/rad);
        }
    }

    stage.update();
}



// ===== Pointeur =====

const pointer = new createjs.Shape();
plotContainer.addChild(pointer);

function drawPointer() {
    /*
        Trace le pointeur indiquant le jour et l'altitude du Soleil
        sur le graphe.
    */
    pointer.graphics.clear();
    pointer.graphics.ss(2, 1, 1).s('orange');
    pointer.graphics.setStrokeDash([5,8]);
    
    time = 43200 + equationOfTime() * 60;
    
    pointer.graphics.mt(day, 0);
    pointer.graphics.lt(day, -2.5*altitude/rad);
    pointer.graphics.lt(0, -2.5*altitude/rad);
    stage.update();
}





//==============================
//          Méridienne
//==============================

// ===== Méridienne =====

const noonMark = new createjs.Shape();
container.addChild(noonMark);
noonMark.x = 1000;
noonMark.y = 380;

noonMark.graphics.ss(1, 1, 1).s('rgb(180, 180, 180)');
noonMark.graphics.mt(0, 0).lt(-1000, 0);

noonMark.graphics.ss(2, 1, 1).s('black');
noonMark.graphics.mt(0, 20).lt(-1000, 20);
noonMark.graphics.mt(0, -20).lt(-1000, -20);
noonMark.graphics.mt(0, 60).lt(0, -315);
noonMark.graphics.mt(0,-325).lt(0,-380);

// repères angulaires
for (let h = 20; h < 80; h += 10) {
    let d = -320/Math.tan(h*rad);
    noonMark.graphics.mt(d,20);
    noonMark.graphics.lt(d,-20);
    tick = new createjs.Text(h + '°', "16px Quicksand", 'black');
    tick.x = 1000+d;
    tick.y = 390;
    tick.textAlign = 'center';
    tick.setTransform(1005+d, 380, 1, 1,-90);
    container.addChild(tick);
}



// ===== Zodiaque =====

const zodiac = [
    ["aries", 42.6, true],
    ["taurus", 54.2, true],
    ["gemini", 62.4, true],
    ["cancer", 65.4, false],
    ["leo", 61.9, false],
    ["virgo", 53.1, false],
    ["libra", 41.6, false],
    ["scorpio", 30.3, false],
    ["sagittarius", 21.5, false],
    ["capricorn", 18.5, true],
    ["aquarius", 22.1, true],
    ["pisces", 31.1, true],
]


for (let i = 0; i < zodiac.length; i++) {
    let d1 = -320/Math.tan(zodiac[i][1]*rad);
    let d2 = -320/Math.tan(zodiac[(i+1)%zodiac.length][1]*rad);
    let d = (d1+d2)/2;

    let logoSrc = src + zodiac[i][0] + ".png";
    let logo = new createjs.Bitmap(logoSrc);
    container.addChild(logo);
    logo.image.onload = function() {
        stage.update();
    }
    
    logo.setTransform(0,0,0.6,0.6);

    logo.x = 1000+d-13;
    if (zodiac[i][2]) {
        logo.y = 410;
        noonMark.graphics.mt(d1,20).lt(d1,60);
        noonMark.graphics.mt(d2,20).lt(d2,60);
    } else {
        logo.y = 330;
        noonMark.graphics.mt(d1,-20).lt(d1,-60);
        noonMark.graphics.mt(d2,-20).lt(d2,-60);
    }
}

noonMark.graphics.mt(0,-60).lt(-1000,-60);
noonMark.graphics.mt(0,60).lt(-1000,60);



// ===== Légende œilleton =====

const eyepiece = new createjs.Text("Œilleton", "20px Quicksand", 'black');
container.addChild(eyepiece);
eyepiece.x = 990;
eyepiece.y = 50;
eyepiece.textAlign = 'right';
eyepiece.textBaseline = 'middle';





// ===== Rayon solaire =====

const sunRay = new createjs.Shape();
container.addChild(sunRay);
sunRay.x = 1000;
sunRay.y = 380;

function drawSunRay() {
    sunRay.graphics.clear();
    sunRay.graphics.ss(2, 1, 1).s('orange');
    sunRay.graphics.mt(20, -320 - 20 * Math.tan(altitude));
    sunRay.graphics.lt(-320/Math.tan(altitude),0);
    
    stage.update();
}



// ===== Soleil =====

const sun = new createjs.Shape();
container.addChild(sun);
sun.x = 1000;

sun.graphics.ss(3, 1, 1).s('orange').f('orange');
sun.graphics.dc(0, 0, 5);
for (angle = 0; angle < 360; angle += 45) {
    let x = computeX(10, angle*rad);
    let y = computeY(10, angle*rad);
    sun.graphics.mt(x, y).lt(1.5*x, 1.5*y);
}

function moveSun() {
    sun.x = 1020 + 28 * Math.cos(altitude);
    sun.y = 60 - 20 * Math.tan(altitude) - 28 * Math.sin(altitude);
    
    stage.update();
}



drawPlot();
getDay();
drawSunRay();
drawPointer();
moveSun();
stage.update();