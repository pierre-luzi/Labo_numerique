function wavelengthToRGB(wavelength, gamma=0.8) {
    /*
        Cette fonction convertit une longueur d'onde 
        en une couleur au format RGB. La longueur d'onde
        doit être exprimée en nanomètres et comprise entre
        380 et 750 (789 THz - 400 THz).

        Based on code by Dan Bruton
        http://www.physics.sfasu.edu/astro/color/spectra.html
    */
    
    let R = 0.0;
    let G = 0.0;
    let B = 0.0;
    
    if (wavelength >= 380 && wavelength <= 440) {
        let attenuation = 0.3 + 0.7 * (wavelength - 380) / (440 - 380);
        R = ((-(wavelength - 440) / (440 - 380)) * attenuation) ** gamma;
        G = 0.0;
        B = (1.0 * attenuation) ** gamma;
    } else if (wavelength >= 440 && wavelength <= 490) {
        R = 0.0;
        G = ((wavelength - 440) / (490 - 440)) ** gamma;
        B = 1.0;
    } else if (wavelength >= 490 && wavelength <= 510) {
        R = 0.0;
        G = 1.0;
        B = (-(wavelength - 510) / (510 - 490)) ** gamma;
    } else if (wavelength >= 510 && wavelength <= 580) {
        R = ((wavelength - 510) / (580 - 510)) ** gamma;
        G = 1.0;
        B = 0.0;
    } else if (wavelength >= 580 && wavelength <= 645) {
        R = 1.0;
        G = (-(wavelength - 645) / (645 - 580)) ** gamma;
        B = 0.0;
    } else if (wavelength >= 645 && wavelength <= 750) {
        let attenuation = 0.3 + 0.7 * (750 - wavelength) / (750 - 645);
        R = (1.0 * attenuation) ** gamma;
        G = 0.0;
        B = 0.0;
    }
    
    return [R*255, G*255, B*255];
}

//==============================
//       Canvas curseurs
//==============================

canvasCurseurs = document.getElementById("canvasCurseurs");
stageCurseurs = new createjs.Stage(canvasCurseurs);
stageCurseurs.enableMouseOver();
createjs.Touch.enable(stageCurseurs);
stageCurseurs.mouseMoveOutside = true;


// ===== Fonctions de création des curseurs =====

const lineLength = 300;

function drawCursorLine(x, y) {
    /*
        Cette fonction trace une barre horizontale de longueur lineLength.
        La barre est tracée à la position (x, y).
    */
    line = new createjs.Shape();
    stageCurseurs.addChild(line);
    line.graphics.ss(4, 1, 1).s('#333').mt(0, 0).lt(lineLength, 0);
    line.x = x;
    line.y = y;
}

function createCursorButton(color, x, y) {
    /*
        Cette fonction trace un bouton à la position (x ,y).
    */
    button = new createjs.Shape();
    stageCurseurs.addChild(button)
    button.cursor = 'pointer';
    button.graphics.f(color).dc(0, 0, 10).ef().es();
    button.name = name;
    button.shadow = new createjs.Shadow("#000", 4, 4, 5);
    button.x = x;
    button.y = y;
    return button
}

function writeCursorText(valeur, x, y) {
    /*
        Cette fonction crée un texte à la position (x, y).
    */
    text = new createjs.Text(valeur, "20px Asul", "#333");
    text.x = x;
    text.y = y;
    text.name = name;
    text.textBaseline = "middle"
    stageCurseurs.addChild(text);
    return text;
}

const xminCursor = 130;    // position de l'extrémité gauche des curseurs



// ===== Curseur pour l'épaisseur de la lame d'air =====

const yWidth = 30;      // position verticale

drawCursorLine(xminCursor, yWidth);
writeCursorText("e", xminCursor-30, yWidth);
writeCursorText("µm", xminCursor+360, yWidth);

const buttonWidth = createCursorButton('gray', xminCursor+0.5*lineLength, yWidth);
const widthText = writeCursorText("", xminCursor+320, yWidth);
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

drawCursorLine(xminCursor, yWavelength);
writeCursorText("λ", xminCursor-30, yWavelength);
writeCursorText("nm", xminCursor+360, yWavelength);

const buttonWavelength = createCursorButton('red', xminCursor+0.7*lineLength, yWavelength);
const wavelengthText = writeCursorText("", xminCursor+320, yWavelength);
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
    console.log(button);
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xminCursor+lineLength);
    getWidth();
    getWavelength();
    stageCurseurs.update();
    drawInterferenceFigure();
    stageGraphes.update();
}

buttonWidth.addEventListener('mousedown', onMouseDown);
buttonWidth.addEventListener('pressmove', onPressMove);
buttonWavelength.addEventListener('mousedown', onMouseDown);
buttonWavelength.addEventListener('pressmove', onPressMove);





//==============================
//       Canvas graphique
//==============================

canvasGraphes = document.getElementById("canvasGraphes");
stageGraphes = new createjs.Stage(canvasGraphes);

graphicContainer = new createjs.Container();
stageGraphes.addChild(graphicContainer);
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
stageCurseurs.addChild(schemaContainer);
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
    stageCurseurs.update();
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
    stageCurseurs.update();
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
    stageCurseurs.update();
}




// ===== Initialisation =====

getWidth();
getWavelength();
drawInterferenceFigure();
drawMovingMirror();
drawMovingRay();
drawFixedRay();
stageCurseurs.update();
stageGraphes.update();