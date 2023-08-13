/*
    -----------------------------------
    |   Franges d'égale inclinaison   |
    -----------------------------------

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

cursorsCanvas = document.getElementById("cursors_canvas");
cursorsStage = new createjs.Stage(cursorsCanvas);
cursorsStage.enableMouseOver();
createjs.Touch.enable(cursorsStage);
cursorsStage.mouseMoveOutside = true;


// ===== Fonctions de création des curseurs =====

const xminCursor = 130;    // position de l'extrémité gauche des curseurs



// ===== Curseur pour l'épaisseur de la lame d'air =====

const yWidth = 30;      // position verticale

cursorLine(xminCursor, yWidth, cursorsStage);
cursorText("e", xminCursor-30, yWidth, cursorsStage);
cursorText("µm", xminCursor+360, yWidth, cursorsStage);

const buttonWidth = cursorButton('gray', xminCursor+0.5*lineLength, yWidth, cursorsStage);
const widthText = cursorText("", xminCursor+320, yWidth, cursorsStage);
const minWidth = -500;
const maxWidth = 500;
let width = 0;

function getWidth() {
    /*
        Calcule l'épaisseur de la lame d'air en fonction
        de la position du curseur et met à jour l'affichage
        de la valeur à côté du curseur.
    */
    width = (buttonWidth.x - xminCursor) / lineLength * (maxWidth - minWidth) + minWidth;
    widthText.text = width.toLocaleString('fr-FR', {maximumFractionDigits: 0});
    
    drawMovingMirror();
    drawMovingRay();
}



// ===== Curseur pour la longueur d'onde =====

const yWavelength = 70;    // position verticale

cursorLine(xminCursor, yWavelength, cursorsStage);
cursorText("λ", xminCursor-30, yWavelength, cursorsStage);
cursorText("nm", xminCursor+360, yWavelength, cursorsStage);

const buttonWavelength = cursorButton('red', xminCursor+0.7*lineLength, yWavelength, cursorsStage);
const wavelengthText = cursorText("", xminCursor+320, yWavelength, cursorsStage);
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
    wavelengthText.text = wavelength.toLocaleString('fr-FR', {maximumFractionDigits: 0});
    
    // mise à jour de la couleur du curseur
    buttonWavelength.graphics.clear();
    wavelengthRGB = wavelengthToRGB(wavelength);
    color = "rgba(" + wavelengthRGB + ")";
    buttonWavelength.graphics.f(color).dc(0, 0, 10).ef().es();
    
    drawMovingRay();
    drawFixedRay();
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
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xminCursor+lineLength);
    getWidth();
    getWavelength();
    cursorsStage.update();
    drawInterferenceFigure();
    graphicStage.update();
}

buttonWidth.addEventListener('mousedown', onMouseDown);
buttonWidth.addEventListener('pressmove', onPressMove);
buttonWavelength.addEventListener('mousedown', onMouseDown);
buttonWavelength.addEventListener('pressmove', onPressMove);





//==============================
//       Canvas graphique
//==============================

graphicCanvas = document.getElementById("graphic_canvas");
graphicStage = new createjs.Stage(graphicCanvas);

graphicContainer = new createjs.Container();
graphicStage.addChild(graphicContainer);
graphicContainer.x = 300;
graphicContainer.y = 240;

interferenceFigure = new createjs.Shape();
graphicContainer.addChild(interferenceFigure);
interferenceFigure.graphics.ss(1, 1, 1);

function drawInterferenceFigure() {
    /*
        Trace la figure d'interférence.
    */
    interferenceFigure.graphics.clear();
    interferenceFigure.graphics.f('black').dr(-229, -229, 230*2, 230*2).ef();
    for (x = 0; x < 230; x+=2) {
        for (y = 0; y < x+1; y+=2) {
            let opacity = (1 + Math.cos(2 * Math.PI / (wavelength * 10**-9) * 2 * width * 10**-6 * (1 - (x**2 + y**2)/(2 * 10**7))))/2;
            let fringeColor = "rgba(" + wavelengthRGB + "," + opacity + ")";
            interferenceFigure.graphics.s(fringeColor);
            interferenceFigure.graphics.drawRect(x, y, 2, 2);
            if (x == 0 && y == 0) {
                continue;
            } else if (y == 0) {
                interferenceFigure.graphics.drawRect(y, x, 2, 2);
                interferenceFigure.graphics.drawRect(y, -x, 2, 2);                
            } else if (y == x) {
                interferenceFigure.graphics.drawRect(x, -y, 2, 2);
                interferenceFigure.graphics.drawRect(-y, -x, 2, 2);
            } else {
                interferenceFigure.graphics.drawRect(y, x, 2, 2);
                interferenceFigure.graphics.drawRect(x, -y, 2, 2);
                interferenceFigure.graphics.drawRect(-x, -y, 2, 2);
                interferenceFigure.graphics.drawRect(-y, x, 2, 2);
                interferenceFigure.graphics.drawRect(y, -x, 2, 2);
                interferenceFigure.graphics.drawRect(-y, -x, 2, 2);
            }
            interferenceFigure.graphics.drawRect(-x, y, 2, 2);
        }
    }
}





//==============================
//      Schéma Michelson
//==============================

const schemaContainer = new createjs.Container();
cursorsStage.addChild(schemaContainer);
schemaContainer.x = 300;
schemaContainer.y = 220;

const distSourceSep = 200;
const distMirrorSep = 100;
const distLensSep = 100;
const distLensScreen = 150;
const ySource = 50;
const angle = 12;
const tangente = Math.tan(angle * Math.PI / 180);

const fixedElements = new createjs.Shape();
schemaContainer.addChild(fixedElements);

fixedElements.graphics.ss(1, 1, 1).s('black');
// séparatrice
fixedElements.graphics.mt(-70, 70).lt(70, -70);
// miroir fixe
fixedElements.graphics.mt(-60, -distMirrorSep).lt(60, -distMirrorSep);
// lentille
fixedElements.graphics.mt(-90, distLensSep).lt(90, distLensSep);
fixedElements.graphics.mt(-85, distLensSep+5).lt(-90, distLensSep).lt(-85, distLensSep-5);
fixedElements.graphics.mt(85, distLensSep+5).lt(90, distLensSep).lt(85, distLensSep-5);
// écran
fixedElements.graphics.mt(-90, distLensSep + distLensScreen);
fixedElements.graphics.lt(90, distLensSep + distLensScreen);

const movingMirror = new createjs.Shape();
schemaContainer.addChild(movingMirror);

function drawMovingMirror() {
    movingMirror.graphics.clear();
    movingMirror.graphics.ss(1, 1, 1).s('black');
    
    movingMirror.graphics.mt(distMirrorSep + width*0.05, -60);
    movingMirror.graphics.lt(distMirrorSep + width*0.05, 60);
    cursorsStage.update();
}

const movingRay = new createjs.Shape();
schemaContainer.addChild(movingRay);

function drawMovingRay() {
    movingRay.graphics.clear();
    movingRay.graphics.ss(3, 1, 1).s('rgba(' + wavelengthRGB + ', 0.5)');

    movingRay.graphics.mt(-distSourceSep, ySource);
    movingRay.graphics.lt(
        (distSourceSep * tangente - ySource) / (1 - tangente),
        -(distSourceSep * tangente - ySource) / (1 - tangente)
    );
    movingRay.graphics.lt(
        distMirrorSep + width*0.05,
        -(distSourceSep + distMirrorSep + width*0.05) * tangente + ySource
    );
    let xseparator = ((distSourceSep + 2*(distMirrorSep + width*0.05)) * tangente - ySource) / (1 + tangente);
    movingRay.graphics.lt(
        xseparator,
        -xseparator
    );
    movingRay.graphics.lt(
        (distLensSep + distSourceSep + 2*(distMirrorSep + width*0.05)) * tangente - ySource,
        distLensSep
    );
    movingRay.graphics.lt(
        distLensScreen * tangente,
        distLensSep + distLensScreen
    );
    schemaContainer.setChildIndex(fixedElements, schemaContainer.getNumChildren()-1);
    cursorsStage.update();
}

const fixedRay = new createjs.Shape();
schemaContainer.addChild(fixedRay);

function drawFixedRay() {
    fixedRay.graphics.clear();
    fixedRay.graphics.ss(3, 1, 1).s('rgba(' + wavelengthRGB + ', 0.5)');

    fixedRay.graphics.mt(-distSourceSep, ySource);
    fixedRay.graphics.lt(
        (distSourceSep * tangente - ySource) / (1 - tangente),
        -(distSourceSep * tangente - ySource) / (1 - tangente)
    );
    fixedRay.graphics.lt(
        (distSourceSep + distMirrorSep) * tangente - ySource,
        -distMirrorSep,
    );
    fixedRay.graphics.lt(
        (distSourceSep + 2*distMirrorSep + distLensSep) * tangente - ySource,
        distLensSep
    );
    fixedRay.graphics.lt(
        distLensScreen * tangente,
        distLensSep + distLensScreen
    );
    schemaContainer.setChildIndex(fixedElements, schemaContainer.getNumChildren()-1);
    cursorsStage.update();
}




// ===== Initialisation =====

getWidth();
getWavelength();
drawInterferenceFigure();
drawMovingMirror();
drawMovingRay();
drawFixedRay();
cursorsStage.update();
graphicStage.update();