/*
    --------------------------------
    |       Champ électrique       |
    --------------------------------

    Ce script représente les lignes de différents champs et l'effet
    de ceux-ci :
        - champ magnétique d'un dipôle et son effet sur une boussole ;
        - champ de vitesse d'un fluide dans un coin et son effet sur une
        manche à air ;
        - champ de vitesse d'un fluide autour d'un cylindre et son effet
        sur une manche à air ;
        - champ électrique d'une charge ponctuel et son effet sur une
        charge test.
*/



//==============================
//       Canvas graphique
//==============================

let canvas = document.querySelector("#canvas");
let stage = new createjs.Stage(canvas);
stage.enableMouseOver();
createjs.Touch.enable(stage);
stage.mouseMoveOutside = true;

let canvasRect = canvas.getBoundingClientRect();
const xMax = canvasRect.width;
const yMax = canvasRect.height;





//==============================
//      Calcul des champs
//==============================

function computeDipoleField(x, y) {
    /*
        Renvoie les coordonnées du champ d'un dipôle.
    */
    let angle = computeAngle(x, y);
    let rCube = Math.sqrt(x**2 + y**2)**3;
    let Ux = 1e8 * (3 * (Math.cos(angle))**2 - 1)/rCube;
    let Uy = 1e8 * (3 * Math.cos(angle) * Math.sin(angle))/rCube;
    return [Ux, Uy];
}

function computeCornerField(x, y) {
    /*
        Renvoie les coordonnées du champ de vitesse d'un fluide
        dans un coin.
    */
    let Ux = -0.5 * x;
    let Uy = 0.5 * y;
    return [Ux, Uy];
}

const cylinderRadius = 70;
function computeCylinderField(x, y) {
    /*
        Renvoie les coordonnées du champ de vitesse d'un fluide
        autour d'un cylindre.
    */
    let angle = computeAngle(x, y);
    let r = Math.sqrt(x**2 + y**2);
    let Ux = (1 - (cylinderRadius/r)**2) * Math.cos(angle)**2 + (1 + (cylinderRadius/r)**2) * Math.sin(angle)**2;
    let Uy = -2 * Math.cos(angle) * Math.sin(angle) * (cylinderRadius/r)**2;
    return [1e2 * Ux, 1e2 * Uy];
}

function computeChargeField(x, y) {
    /*
        Renvoie les coordonnées du champ électrique produit par une
        charge ponctuelle.
    */
    let angle = computeAngle(x, y);
    let rSquared = (x**2 + y**2);
    let Ux = 1 / rSquared * Math.cos(angle);
    let Uy = 1 / rSquared * Math.sin(angle);
    return [1e6 * Ux, 1e6 * Uy];
}

function drawField(x, y) {
    /*
        Trace le vecteur du champ au point (x, y).
    */
    fieldVector.graphics.clear();
    fieldVector.graphics.ss(3, 1, 1).s('red');
    let [Ux, Uy] = computeField(x, y);
    drawVector(
        fieldVector,
        x, y,
        x+Ux, y+Uy,
        'purple'
    );
}





//==============================
//       Lignes de champ
//==============================

// ===== Dipôle =====

let dipoleContainer = new createjs.Container();
dipoleContainer.x = xMax/2;
dipoleContainer.y = yMax/2;

let dipoleContainerBkg = new createjs.Shape();
dipoleContainer.addChild(dipoleContainerBkg);
dipoleContainerBkg.graphics.ss(1, 1, 1).f('white');
dipoleContainerBkg.graphics.drawRect(0, 0, 790, 500);

drawDipoleFieldLines();

function drawDipoleFieldLines() {
    /*
        Trace les lignes de champ d'un dipôle.
    */
    function drawFieldLine(constante) {
        let fieldLine = new createjs.Shape();
        dipoleContainer.addChild(fieldLine);
        fieldLine.graphics.ss(1, 1, 1).s('blue');
    
        fieldLine.graphics.mt(constante, 0);
    
        for (let angle = 0; angle <= Math.PI; angle+=Math.PI/180) {
            let r = constante * (Math.sin(angle))**2;
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            fieldLine.graphics.lt(x, y);
        }
    }
    
    for (let xEdge = 0; xEdge < xMax/2; xEdge+=50) {
        rEdge = Math.sqrt(xEdge**2 + (yMax/2)**2);
        angleEdge = Math.atan(yMax/2/xEdge);
        let constante = rEdge/(Math.sin(angleEdge))**2;
        drawFieldLine(constante);
        drawFieldLine(-constante);
    }

    for (let yEdge = 0; yEdge < yMax/2; yEdge+=50) {
        rEdge = Math.sqrt(yEdge**2 + (xMax/2)**2);
        angleEdge = Math.atan(yEdge*2/xMax);
        let constante = rEdge/(Math.sin(angleEdge))**2;
        drawFieldLine(constante);
        drawFieldLine(-constante);
    }

    for (let constante = 0; constante < 500; constante+=50) {
        drawFieldLine(constante);
        drawFieldLine(-constante);
    }
}



// ===== Fluide dans un coin =====

let cornerContainer = new createjs.Container();
cornerContainer.x = xMax;
cornerContainer.y = 0;

let cornerContainerBkg = new createjs.Shape();
cornerContainer.addChild(cornerContainerBkg);
cornerContainerBkg.graphics.ss(1, 1, 1).f('white');
cornerContainerBkg.graphics.drawRect(0, 0, 790, 500);

drawCornerFieldLines();



function drawCornerFieldLines() {
    /*
        Trace les lignes de champ électrique d'une charge ponctuelle
    */
    function drawFieldLine(constante) {
        let fieldLine = new createjs.Shape();
        cornerContainer.addChild(fieldLine);
        fieldLine.graphics.ss(1, 1, 1).s('blue');
    
        fieldLine.graphics.mt(-xMax, constante/(-xMax));
        for (x = -xMax + 1; x <= xMax; x++) {
            fieldLine.graphics.lt(x, constante/x);
        }
    }

    for (let xEdge = -xMax; xEdge < 30; xEdge+=20) {
        let constante = yMax * xEdge;
        drawFieldLine(constante);
    }
}



// ===== Fluide autour d'un cylindre =====

let cylinderContainer = new createjs.Container();
cylinderContainer.x = xMax/2;
cylinderContainer.y = yMax/2;

let cylinderContainerBkg = new createjs.Shape();
cylinderContainer.addChild(cylinderContainerBkg);
cylinderContainerBkg.graphics.ss(1, 1, 1).f('white');
cylinderContainerBkg.graphics.drawRect(0, 0, 790, 500);

drawCylinderFieldLines();


function drawCylinderFieldLines() {
    /*
        Trace les lignes de champ de vitesse d'un fluide dans un coin.
    */    
    function drawFieldLine(constante, positive) {
        let fieldLine = new createjs.Shape();
        cylinderContainer.addChild(fieldLine);
        fieldLine.graphics.ss(1, 1, 1).s('blue');
        
        let angle = Math.PI/180;
        let r = (constante/Math.sin(angle) + Math.sqrt((constante/Math.sin(angle))**2 + 4 * cylinderRadius**2))/2;
        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);
        fieldLine.graphics.mt(x, y);
        
        for (angle = 2 * Math.PI/180; angle < Math.PI; angle += Math.PI/180) {
            let r = (constante/Math.sin(angle) + Math.sqrt((constante/Math.sin(angle))**2 + 4 * cylinderRadius**2))/2;
            let x = r * Math.cos(angle);
            let y = r * Math.sin(angle);
            if (positive == false) {
                y = -y;
            }
            fieldLine.graphics.lt(x, y);
        }
    }

    for (let r = cylinderRadius+10; r < yMax/2+25; r += 10) {
        let constante = r - cylinderRadius**2/r;
        drawFieldLine(constante);
        drawFieldLine(constante, false);
    }
}



// ==== Charge ponctuelle ====

let chargeContainer = new createjs.Container();
chargeContainer.x = xMax/2;
chargeContainer.y = yMax/2;

let chargeContainerBkg = new createjs.Shape();
chargeContainer.addChild(chargeContainerBkg);
chargeContainerBkg.graphics.ss(1, 1, 1).f('white');
chargeContainerBkg.graphics.drawRect(0, 0, xMax, yMax);

drawChargeFieldLines();

function drawChargeFieldLines() {
    /*
        Trace les lignes de champ de vitesse d'un fluide dans un coin.
    */
    const angleLim = computeAngle(xMax/2, yMax/2);
        
    function drawFieldLine(angle) {
        let fieldLine = new createjs.Shape();
        chargeContainer.addChild(fieldLine);
        fieldLine.graphics.ss(1, 1, 1).s('blue');
        
        fieldLine.graphics.mt(0, 0);
        
        let x = 0;
        let y = 0;
        if (Math.abs(angle) <= angleLim) {
            x = xMax/2;
            y = xMax/2 * Math.tan(angle);
        } else if (Math.abs(angle) > angleLim && Math.abs(angle) < Math.PI - angleLim) {
            y = Math.sign(angle) * yMax/2;
            x = yMax/(2 * Math.tan(angle));
        } else if (Math.abs(angle) > Math.PI - angleLim && Math.abs(angle) <= Math.PI) {
            x = -xMax/2;
            y = -xMax/2 * Math.tan(angle);
        }
        fieldLine.graphics.lt(x, y);
    }

    for (let angle = -Math.PI; angle < Math.PI; angle += 5 * Math.PI/180) {
        drawFieldLine(angle);
    }
}





//==============================
//           Sonde
//==============================

// ===== Boussole =====

let compass = new createjs.Shape();
compass.cursor = 'pointer';
compass.graphics.ss(4, 1, 1).s('black').f('white');
compass.graphics.dc(0, 0, 25);
compass.graphics.ss(1, 1, 1).f('black');
compass.graphics.mt(0, -7).lt(0, 7).lt(-17, 0);
compass.graphics.s('red').f('red');
compass.graphics.mt(0, -7).lt(0, 7).lt(17, 0);
compass.graphics.ss(1, 1, 1).s('white').f('white');
compass.graphics.dc(0, 0, 3);



// ===== Manche à air =====

let windsock = new createjs.Shape();
windsock.cursor = 'pointer';
windsock.graphics.ss(1, 1, 1).s('black').f('white');
windsock.graphics.mt(-20, -11).lt(-20, 11).lt(20, 3).lt(20, -3).lt(-20, -11);
windsock.graphics.s('red').f('red');
windsock.graphics.mt(-20, -11).lt(-20, 11).lt(-10, 9).lt(-10, -9).lt(-20, -11);
windsock.graphics.mt(0, -7).lt(0, 7).lt(10, 5).lt(10, -5).lt(0, -7);



// ==== Charge ====

let charge = new createjs.Shape();
charge.cursor = 'pointer';
charge.graphics.ss(1, 1, 1).f('red');
charge.graphics.dc(0, 0, 5);



// ===== Champ =====

let fieldVector = new createjs.Shape();
fieldVector.graphics.ss(3, 1, 1).s('purple');



// ==== Fonctions de mise à jour ====

function onMouseDown(event) {
    /*
        Lors d'un clic sur un bouton, enregistre l'offset entre
        la position du clic et du bouton.
    */
    let object = event.currentTarget;
    object.offsetX = object.x - event.stageX;
    object.offsetY = object.y - event.stageY;
}

function onPressMove(event) {
    /*
        Action lors du déplacement d'un curseur.
    */
    let object = event.currentTarget;
    let container = object.parent;
    object.x = Math.min(Math.max(-container.x+25, event.stageX + object.offsetX), xMax-container.x-25);
    object.y = Math.min(Math.max(-container.y+25, event.stageY + object.offsetY), yMax-container.y-25);

    rotateProbe(object);
    drawField(object.x, object.y);
    stage.update();
}

function rotateProbe(object) {
    /*
        Effectue une rotation de l'objet pour l'aligner avec le champ.
        Argument :
            - object : l'élément Shape à faire tourner.
    */
    let [Ux, Uy] = computeField(object.x, object.y);
    let angle = Math.atan(Uy/Ux);
    if (Ux <= 0) {
        angle += Math.PI;
    }
    object.rotation = angle * 180 / Math.PI;
}

compass.addEventListener("mousedown", onMouseDown);
compass.addEventListener("pressmove", onPressMove);
windsock.addEventListener("mousedown", onMouseDown);
windsock.addEventListener("pressmove", onPressMove);
charge.addEventListener("mousedown", onMouseDown);
charge.addEventListener("pressmove", onPressMove);



const choiceDivs = document.querySelectorAll(".choice");
for (div of choiceDivs) {
    div.addEventListener("click", function() {
        choice = this.id;
        updateCanvas();
    });
}



function updateCanvas() {
    /*
        Met à jour le canevas.
    */
    if (choice == "dipole") {
        computeField = computeDipoleField;
        
        stage.removeChild(cornerContainer);
        stage.removeChild(cylinderContainer);
        stage.removeChild(chargeContainer);
        stage.addChild(dipoleContainer);
        
        dipoleContainer.addChild(compass);
        compass.x = 100;
        compass.y = 0;
        compass.rotation = 0;
        
        dipoleContainer.addChild(fieldVector);
        drawField(100, 0);
    } else if (choice == "corner") {
        computeField = computeCornerField;
        
        stage.removeChild(dipoleContainer);
        stage.removeChild(cylinderContainer);
        stage.removeChild(chargeContainer);
        stage.addChild(cornerContainer);
        
        cornerContainer.addChild(windsock);
        windsock.x = -xMax/2;
        windsock.y = yMax/2;
        
        rotateProbe(windsock);
        
        cornerContainer.addChild(fieldVector);
        drawField(-xMax/2, yMax/2);
    } else if (choice == "cylinder") {
        computeField = computeCylinderField;
        
        stage.removeChild(dipoleContainer);
        stage.removeChild(cornerContainer);
        stage.removeChild(chargeContainer);
        stage.addChild(cylinderContainer);
        
        cylinderContainer.addChild(windsock);
        windsock.x = 100;
        windsock.y = 100;
        
        rotateProbe(windsock);
        
        cylinderContainer.addChild(fieldVector);
        drawField(windsock.x, windsock.y);
    } else if (choice == "charge") {
        computeField = computeChargeField;
        
        stage.removeChild(dipoleContainer);
        stage.removeChild(cornerContainer);
        stage.removeChild(cylinderContainer);
        stage.addChild(chargeContainer);
        
        chargeContainer.addChild(charge);
        charge.x = 100;
        charge.y = -100;
        
        chargeContainer.addChild(fieldVector);
        drawField(charge.x, charge.y);
    }
    stage.update();
}



let choice = 'dipole';
let computeField = computeDipoleField;
updateCanvas();