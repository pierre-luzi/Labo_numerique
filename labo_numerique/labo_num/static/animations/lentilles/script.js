/*
    ---------------------------------
    |       Lentilles minces        |
    ---------------------------------

    Simulation de la déviation des rayons lumineux par une lentille.
    On peut déplacer l'objet lumineux et la lentille et visualiser
    un nombre variable de rayons issus, au choix, du point A ou du
    point B.
    On peut tracer les rayons de construction passant par F, O et F'.
    Un écran peut être affiché pour visualiser l'incidence des rayons
    sur celui-ci.
*/



document.fonts.ready.then(() => {



// ===== Initialisation des paramètres =====

// paramètres de l'objectif
let f = 100;          // distance focale de l'objectif

// position des éléments (origine des abscisses : capteur)
let xObj = 0;    // position de l'objet
let xLens = 400;   // position de la lentille
let xImg = 0;       // position de l'image
computeXImg();

// paramètres d'affichage
let showPrimaryFocusRay = false;
let showCenterRay = false;
let showSecondaryFocusRay = false;
let showRandomRays = true;
let showScreen = false;
let showARays = false;
let showBRays = true;

// canvas graphique
const canvas = document.getElementById("canvas");
canvas.width = 0.95 * window.screen.width;
canvas.height = 350;

// stage
const stage = new createjs.Stage(canvas);
stage.enableMouseOver();
createjs.Touch.enable(stage);
stage.mouseMoveOutside = true;

// conteneur graphique
const container = new createjs.Container();
stage.addChild(container);
container.x = 80;
container.y = 150;





//==============================
//         Axe optique
//==============================

const opticalAxis = new createjs.Shape();
container.addChild(opticalAxis);

const xmax = 1100;
const ymax = 200;

opticalAxis.graphics.setStrokeDash([7, 6]).s('rgb(50, 50, 50)');
opticalAxis.graphics.mt(-20, 0).lt(xmax, 0);
opticalAxis.graphics.ss(1, 1, 1);
for (let x = 0; x < 1100; x += 50) {
    opticalAxis.graphics.mt(x, 2).lt(x, -2);
}





//==============================
//           Lentille
//==============================

// lentille
const lens = new createjs.Shape();
container.addChild(lens);
lens.x = xLens;
lens.cursor = 'pointer';

// centre optique
const opticalCenter = new createjs.Text("O", "16px Quicksand", 'rgb(50, 50, 50)');
container.addChild(opticalCenter);
opticalCenter.x = xLens - 10;
opticalCenter.y = -10;
opticalCenter.textAlign = 'center';
opticalCenter.textBaseline = 'middle';

// foyer objet
const primaryFocus = new createjs.Text("F", "16px Quicksand", 'rgb(50, 50, 50)');
container.addChild(primaryFocus);
primaryFocus.x = xLens - f - 10;
primaryFocus.y = 10;
primaryFocus.textAlign = 'center';
primaryFocus.textBaseline = 'middle';

// foyer image
const secondaryFocus = new createjs.Text("F'", "16px Quicksand", 'rgb(50, 50, 50)');
container.addChild(secondaryFocus);
secondaryFocus.x = xLens + f + 10;
secondaryFocus.y = -10;
secondaryFocus.textAlign = 'center';
secondaryFocus.textBaseline = 'middle';

function drawLens() {
    /*
        Trace la lentille.
    */
    lens.graphics.clear();
    lens.graphics.ss(2, 1, 1).s('black');
    lens.graphics.mt(0, -130);
    lens.graphics.lt(0, 130);
    lens.graphics.mt(-10, -120).lt(0, -130).lt(10, -120);
    lens.graphics.mt(-10, 120).lt(0, 130).lt(10, 120);
    
    // foyers
    lens.graphics.ss(2, 1, 1).s('rgb(50, 50, 50)');
    lens.graphics.mt(f, 5).lt(f,-5);    // foyer objet
    lens.graphics.mt(-f, 5).lt(-f, -5); // foyer image
    
    primaryFocus.x = xLens - f - 10;
    secondaryFocus.x = xLens + f + 10;
            
    stage.update();
}





//==============================
//            Objet
//==============================

const objectHeight = 55;

// ===== Objet lumineux =====

// objet lumineux
const object = new createjs.Shape();
container.addChild(object);
object.cursor = 'pointer';
object.x = xObj;

// légende "A" de l'objet lumineux
const A = new createjs.Text("A", "16px Quicksand", 'red');
container.addChild(A);
A.x = xObj;
A.y = 10;
A.textAlign = 'center';
A.textBaseline = 'middle';

// légende "B" de l'object lumineux
const B = new createjs.Text("B", "16px Quicksand", 'red');
container.addChild(B);
B.x = xObj;
B.y = -objectHeight - 10;
B.textAlign = 'center';
B.textBaseline = 'middle';

function drawObject() {
    /*
        Trace l'object lumineux.
    */
    object.graphics.clear();
    object.graphics.ss(2, 1, 1).s('red');
    object.graphics.mt(0, -objectHeight).lt(0, 0);
    object.graphics.mt(-5, -objectHeight+5).lt(0, -objectHeight).lt(5, -objectHeight+5);
}



// ===== Distance lentille-image =====

const lensObjectArrow = new createjs.Shape();
container.addChild(lensObjectArrow);

const lensObjectText = new createjs.Text("", "16px Quicksand", 'black');
container.addChild(lensObjectText);
lensObjectText.y = -130;
lensObjectText.textAlign = 'center';
lensObjectText.textBaseline = 'middle';

function drawLensObjectArrow() {
    lensObjectArrow.graphics.clear();
    lensObjectArrow.graphics.ss(1, 1, 1).s('rgb(50, 50, 50)');
    lensObjectArrow.graphics.mt(xObj, -140).lt(xLens, -140);
    lensObjectArrow.graphics.mt(xObj+5, -145).lt(xObj, -140).lt(xObj+5, -135);
    lensObjectArrow.graphics.mt(xLens-5, -145).lt(xLens, -140).lt(xLens-5, -135);
    
    lensObjectText.text = (xLens - xObj).toLocaleString('fr-FR', {maximumFractionDigits: 0}) + " mm";
    lensObjectText.x = (xLens + xObj)/2;
}





//==============================
//            Image
//==============================

// ===== Image =====

// image
const image = new createjs.Shape();
container.addChild(image);
image.x = xImg;

let imageHeight = objectHeight * (xImg - xLens -f)/f;

// légende "A" de l'objet lumineux
const A1 = new createjs.Text("A'", "16px Quicksand", 'red');
container.addChild(A1);
A1.x = xImg;
A1.y = -10;
A1.textAlign = 'center';
A1.textBaseline = 'middle';

// légende "B" de l'image lumineux
const B1 = new createjs.Text("B'", "16px Quicksand", 'red');
container.addChild(B1);
B1.x = xImg;
B1.y = imageHeight + 10;
B1.textAlign = 'center';
B1.textBaseline = 'middle';

function drawImage() {
    /*
        Trace l'image lumineux.
    */
    image.graphics.clear();
    image.graphics.ss(2, 1, 1).s('red');
    image.graphics.mt(0, imageHeight).lt(0, 0);
    image.graphics.mt(-5, imageHeight - 5);
    image.graphics.lt(0, imageHeight);
    image.graphics.lt(5, imageHeight - 5);
}

function computeXImg() {
    /*
        Calcule la position de l'image par rapport au capteur.
    */
    xImg = xLens + 1/(1/(xObj - xLens) + 1/f);
}

function computeImageHeight() {
    /*
        Calcule la hauteur de l'image.
    */
    imageHeight = objectHeight * (xImg - xLens -f)/f;
}



// ===== Distance lentille-image =====

const lensImageArrow = new createjs.Shape();
container.addChild(lensImageArrow);

const lensImageText = new createjs.Text("", "16px Quicksand", 'black');
container.addChild(lensImageText);
lensImageText.y = -130;
lensImageText.textAlign = 'center';
lensImageText.textBaseline = 'middle';

function drawLensImageArrow() {
    lensImageArrow.graphics.clear();
    lensImageArrow.graphics.ss(1, 1, 1).s('rgb(50, 50, 50)');
    lensImageArrow.graphics.mt(xLens, -140).lt(xImg, -140);
    lensImageArrow.graphics.mt(xLens+5, -145).lt(xLens, -140).lt(xLens+5, -135);
    lensImageArrow.graphics.mt(xImg-5, -145).lt(xImg, -140).lt(xImg-5, -135);
    
    lensImageText.text = (xImg - xLens).toLocaleString('fr-FR', {maximumFractionDigits: 0}) + " mm";
    lensImageText.x = (xImg + xLens)/2;
}



// ===== Taille de l'image =====

const imageHeightSpan = document.getElementById("imgHeight");



// ===== Rayons lumineux =====

// foyer objet
const primaryFocusRay = new createjs.Shape();

function drawPrimaryFocusRay() {
    /*
        Trace le rayon passant par le foyer objet.
    */
    primaryFocusRay.graphics.clear();
    primaryFocusRay.graphics.ss(2, 1, 1).s('purple');

    primaryFocusRay.graphics.mt(xObj, -objectHeight).lt(xLens, imageHeight).lt(xImg, imageHeight);
}

// foyer image
const secondaryFocusRay = new createjs.Shape();

function drawSecondaryFocusRay() {
    /*
        Trace le rayon passant par le foyer image.
    */
    secondaryFocusRay.graphics.clear();
    secondaryFocusRay.graphics.ss(2, 1, 1).s('green');

    secondaryFocusRay.graphics.mt(xObj, -objectHeight).lt(xLens, -objectHeight).lt(xImg, imageHeight);
}

// centre optique
const centerRay = new createjs.Shape();

function drawCenterRay() {
    /*
        Trace le rayon passant par le centre optique.
    */
    centerRay.graphics.clear();
    centerRay.graphics.ss(2, 1, 1).s('#0b76ef');

    centerRay.graphics.mt(xObj, -objectHeight).lt(xImg, imageHeight);
}

// rayons quelconques
let numberRays = 7;
const randomRays = new createjs.Shape();
container.addChild(randomRays);

function drawRandomRays() {
    /*
        Trace des rayons quelconques issus du point objet B.
    */
    randomRays.graphics.clear();
    randomRays.graphics.ss(1, 1, 1).s('red');
    
    if (showARays) {
        for (let i = 0; i < numberRays+1; i++) {
            let yi = -130 + i*260/numberRays;
            randomRays.graphics.mt(xObj, 0).lt(xLens, yi);
        
            let yS = yi + (xScreen-xLens)/(xImg-xLens) * (-yi);
        
            if (showScreen && Math.abs(yS) <= 130) {
                randomRays.graphics.lt(xScreen, yS);
            } else {
                if (yi < 0) {
                    let xend = xLens + (ymax-yi)/(-yi) * (xImg-xLens);
                    if (xend <= xmax) {
                        randomRays.graphics.lt(xend, ymax);
                    } else {
                        let yend = yi + (xmax-xLens)/(xImg-xLens) * (-yi);
                        randomRays.graphics.lt(xmax, yend);
                    }
                } else {
                    let xend = xImg + 150/yi * (xImg-xLens);
                    if (xend <= xmax) {
                        randomRays.graphics.lt(xend, -150);
                    } else {
                        let yend = - (xmax-xImg)/(xImg-xLens) * yi;
                        randomRays.graphics.lt(xmax, yend);
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < numberRays+1; i++) {
            let yi = -130 + i*260/numberRays;
            randomRays.graphics.mt(xObj, -objectHeight).lt(xLens, yi);
        
            let yS = yi + (xScreen-xLens)/(xImg-xLens) * (imageHeight-yi);
        
            if (showScreen && Math.abs(yS) <= 130) {
                randomRays.graphics.lt(xScreen, yS);
            } else {
                if (imageHeight > yi) {
                    let xend = xLens + (ymax-yi)/(imageHeight-yi) * (xImg-xLens);
                    if (xend <= xmax) {
                        randomRays.graphics.lt(xend, ymax);
                    } else {
                        let yend = yi + (xmax-xLens)/(xImg-xLens) * (imageHeight-yi);
                        randomRays.graphics.lt(xmax, yend);
                    }
                } else {
                    let xend = xImg + (imageHeight+150)/(yi-imageHeight) * (xImg-xLens);
                    if (xend <= xmax) {
                        randomRays.graphics.lt(xend, -150);
                    } else {
                        let yend = imageHeight - (xmax-xImg)/(xImg-xLens) * (yi-imageHeight);
                        randomRays.graphics.lt(xmax, yend);
                    }
                }
            }
        }
    }
}





//==============================
//            Écran
//==============================

const lightScreen = new createjs.Shape();
lightScreen.cursor = 'pointer';

let xScreen = 600;

lightScreen.graphics.ss(2, 1, 1).s('black');
lightScreen.graphics.mt(0, -130).lt(0, 130);
lightScreen.x = xScreen;

const screenLegend = new createjs.Text("écran", "16px Quicksand", 'black');
screenLegend.x = xScreen + 10;
screenLegend.y = -100;
screenLegend.textBaseline = 'middle';
screenLegend.textAlign = 'left';




//==============================
//   Déplacement des éléments
//==============================

function onMouseDown(event) {
    /*
        Cette fonction calcule le décalage entre l'objet
        et la position de l'évènement lors d'un clic.
    */
    target = event.currentTarget;
    target.offsetX = target.x - event.stageX;
}

function pressMoveObject(event) {
    /*
        Déplace l'objet lumineux.
    */
    target = event.currentTarget;
    xObj = Math.min(
        Math.max(
            0,
            event.stageX + target.offsetX
        ),
        xLens-160
    );
    
    object.x = xObj;
    A.x = xObj;
    B.x = xObj;
    
    updateRays();
}

function pressMoveLens(event) {
    /*
        Déplace la lentille.
    */
    target = event.currentTarget;
    xLens = Math.min(
        Math.max(
            xObj+160,
            event.stageX + target.offsetX
        ),
        650
    );
    lens.x = xLens;
    opticalCenter.x = xLens - 10;
    primaryFocus.x = xLens - f - 10;
    secondaryFocus.x = xLens + f + 10;
    
    if (xScreen < xLens + 20) {
        xScreen = xLens + 20;
        lightScreen.x = xScreen;
        screenLegend.x = xScreen + 10;
    }
        
    updateRays();
}

function pressMoveScreen(event) {
    /*
        Déplace l'écran.
    */
    target = event.currentTarget;
    xScreen = Math.min(
        Math.max(
            xLens+20,
            event.stageX + target.offsetX
        ),
        1100
    );
    lightScreen.x = xScreen;
    screenLegend.x = xScreen + 10;
    
    updateRays();
}

function updateRays() {
    /*
        Trace les rayons pour les positions de l'objet et de l'objectif
        choisies.
        Affiche les distances.
    */
    // déplacement de l'image
    computeXImg();
    computeImageHeight();
    drawImage();
    image.x = xImg;
    A1.x = xImg;
    B1.x = xImg;
    B1.y = imageHeight + 10;
    
    // affichage des distances
    drawLensObjectArrow();
    drawLensImageArrow();
    
    // tracé des rayons
    drawPrimaryFocusRay();
    drawSecondaryFocusRay();
    drawCenterRay();
    drawRandomRays();
    
    imageHeightSpan.innerText = imageHeight.toLocaleString('fr-FR', {maximumFractionDigits: 0});
    
    stage.update();
}

// ajout des écouteurs
object.addEventListener("mousedown", onMouseDown);
object.addEventListener("pressmove", pressMoveObject);
lens.addEventListener("mousedown", onMouseDown);
lens.addEventListener("pressmove", pressMoveLens);
lightScreen.addEventListener("mousedown", onMouseDown);
lightScreen.addEventListener("pressmove", pressMoveScreen);








//==============================
//          Paramètres
//==============================

// ===== Affichage des rayons de construction =====

function hideSpecialRays() {
    if (showPrimaryFocusRay) {
        showPrimaryFocusRay = false;
        primaryFocusRayCbx.checked = false;
        container.removeChild(primaryFocusRay);
    }
    
    if (showCenterRay) {
        showCenterRay = false;
        centerRayCbx.checked = false;
        container.removeChild(centerRay);
    }
    
    if (showSecondaryFocusRay) {
        showSecondaryFocusRay = false;
        secondaryFocusRayCbx.checked = false;
        container.removeChild(secondaryFocusRay);
    }
}

// affichage du rayon passant par le foyer objet
const primaryFocusRayCbx = document.getElementById("primaryFocusRay");
primaryFocusRayCbx.checked = false;

function changePrimaryFocusRayCbx() {
    showPrimaryFocusRay = !showPrimaryFocusRay;

    if (showPrimaryFocusRay) {
        container.addChild(primaryFocusRay);
        hideRandomRays();
        hideScreen();
        disableRadioButtons();
    } else {
        container.removeChild(primaryFocusRay);
    }

    stage.update();
}

primaryFocusRayCbx.addEventListener("change", changePrimaryFocusRayCbx);



// affichage du rayon passant le centre optique
const centerRayCbx = document.getElementById("centerRay");
centerRayCbx.checked = false;

function changeCenterRayCbx() {
    showCenterRay = !showCenterRay;

    if (showCenterRay) {
        container.addChild(centerRay);
        hideRandomRays();
        hideScreen();
        disableRadioButtons();
    } else {
        container.removeChild(centerRay);
    }

    stage.update();
}

centerRayCbx.addEventListener("change", changeCenterRayCbx);



// affichage du rayon passant par le foyer image
const secondaryFocusRayCbx = document.getElementById("secondaryFocusRay");
secondaryFocusRayCbx.checked = false;

function changeSecondaryFocusRayCbx() {
    showSecondaryFocusRay = !showSecondaryFocusRay;

    if (showSecondaryFocusRay) {
        container.addChild(secondaryFocusRay);
        hideRandomRays();
        hideScreen();
        disableRadioButtons();
    } else {
        container.removeChild(secondaryFocusRay);
    }

    stage.update();
}

secondaryFocusRayCbx.addEventListener("change", changeSecondaryFocusRayCbx);



// ===== Affichage des rayons quelconques =====

// affichage des rayons
const randomRaysCbx = document.getElementById("randomRaysCbx");
randomRaysCbx.checked = true;

randomRaysCbx.addEventListener("change", changeRandomRaysCbx);

function changeRandomRaysCbx() {
    showRandomRays = !showRandomRays;
    
    if (showRandomRays) {
        container.addChild(randomRays);
        screenCbx.disabled = false;
        enableRadioButtons();
        hideSpecialRays();
        updateRays();
    } else {
        container.removeChild(randomRays);
        screenCbx.disabled = true;
        disableRadioButtons();
        hideScreen();
    }
    
    stage.update();
}

function hideRandomRays() {
    if (showRandomRays) {
        showRandomRays = false;
        randomRaysCbx.checked = false;
        container.removeChild(randomRays);
    }
}



// choix du nombre de rayons à tracer
const numberRaysInput = document.getElementById("numberRays");
numberRaysInput.value = numberRays+1;

numberRaysInput.addEventListener("change", function() {
    numberRays = numberRaysInput.value-1;
    updateRays();
});



// choix de l'origine des rayons
const inputRadioA = document.getElementById("radioA");
inputRadioA.checked = false;
inputRadioA.disabled = true;

inputRadioA.addEventListener("change", function(event) {
    if (this.checked) {
        showARays = true;
        showBRays = false;
        updateRays();
    }
});

const inputRadioB = document.getElementById("radioB");
inputRadioB.checked = true;
inputRadioB.disabled = true;

inputRadioB.addEventListener("change", function(event) {
    if (this.checked) {
        showARays = false;
        showBRays = true;
        updateRays();
    }    
});

function enableRadioButtons() {
    inputRadioA.disabled = false;
    inputRadioB.disabled = false;
}

function disableRadioButtons() {
    inputRadioA.disabled = true;
    inputRadioB.disabled = true;
}



// ===== Affichage de l'écran =====

const screenCbx = document.getElementById("screenCbx");
screenCbx.checked = false;
screenCbx.disabled = false;

screenCbx.addEventListener("change", changeScreenCbx);

function changeScreenCbx() {
    showScreen = !showScreen;
    
    if (showScreen) {
        container.addChild(lightScreen);
        container.addChild(screenLegend);
    } else {
        container.removeChild(lightScreen);
        container.removeChild(screenLegend);
    }
    updateRays();
}

function hideScreen() {
    showScreen = false;
    screenCbx.checked = false;
    container.removeChild(lightScreen);
    container.removeChild(screenLegend);
}



// ===== Distance focale =====

const focalDistances = [50, 75, 100, 125, 150];
focalDistanceIndex = 2;

const focalDistanceSpan = document.getElementById("focalDistance");
focalDistanceSpan.innerText = f;

const fLeftArrow = document.getElementById("fLeftArrow");
const fRightArrow = document.getElementById("fRightArrow");

fLeftArrow.addEventListener("mousedown", decreaseFocalDistance);
fRightArrow.addEventListener("mousedown", increaseFocalDistance);

function updateFocalDistance() {
    f = focalDistances[focalDistanceIndex];
    focalDistanceSpan.innerText = f;
    drawLens();
    updateRays();
}

function decreaseFocalDistance() {
    if (focalDistanceIndex > 0) {
        focalDistanceIndex--;
        updateFocalDistance();
    }
}

function increaseFocalDistance() {
    if (focalDistanceIndex < focalDistances.length-1) {
        focalDistanceIndex++;
        updateFocalDistance();
    }
}




//==============================
//        Initialisation
//==============================

drawLens();
drawObject();
drawImage();
drawLensObjectArrow();
drawLensImageArrow();
updateRays();
stage.update();

});