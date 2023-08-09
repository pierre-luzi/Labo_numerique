/*
    -------------------
    |   Chute libre   |
    -------------------

    Ce script simule la chute libre d'une balle.
    La chute est animée est et le vecteur vitesse représenté. Les
    graphes de x, y, vx et vy en fonction du temps sont également
    représentés.

    Paramètres :
        - y0 : hauteur initiale de la balle ;
        - v0 : vitesse initiale de la balle ;
        - alpha : angle initial du vecteur vitesse avec l'horizontale.

    Option : les composantes du vecteur vitesse peuvent être affichés.
*/





//==============================
//         Curseurs
//==============================

let cursorsCanvas = document.querySelector("#canvas_cursors");
let cursorsStage = new createjs.Stage(cursorsCanvas);
cursorsStage.enableMouseOver();
createjs.Touch.enable(cursorsStage);
cursorsStage.mouseMoveOutside = true;

const xminCursor = 90;    // position de l'extrémité gauche des curseurs
const xmaxCursor = xminCursor + lineLength;



// ===== Initialisation ====

// position
const x0 = 20;
let y0 = 125;
let x = x0;
let y = y0;

// vitesse
let vx0 = 20;
let vy0 = 4;
let vy = vy0;

const positionScale = 10;



// ===== Curseur pour la hauteur initiale =====

const yY0 = 20;     // position verticale du curseur

// création du curseur
cursorLine(xminCursor, yY0, cursorsStage);
cursorText("y₀", xminCursor-40, yY0, cursorsStage);
cursorText("m", xmaxCursor+60, yY0, cursorsStage);
const y0Button = cursorButton('red', xminCursor+0.5*lineLength, yY0, cursorsStage);
const y0Text = cursorText("", xmaxCursor+55, yY0, cursorsStage);
y0Text.textAlign = 'right';

// valeurs limites
const minY0 = 0;
const maxY0 = 200;
y0 = getY0();

function getY0() {
    /*
        Récupère la valeur de y0 à partir de la position du curseur
        et met à jour l'affichage de la valeur.
    */
    y0 = (y0Button.x - xminCursor) / lineLength * (maxY0 - minY0) + minY0;
    y0Text.text = (y0/positionScale).toLocaleString('fr-FR', {maximumFractionDigits: 1});
}



// ===== Curseur pour la vitesse initiale =====

const yV0 = 50;     // position verticale du curseur

// création du curseur
cursorLine(xminCursor, yV0, cursorsStage);
cursorText("v₀", xminCursor-40, yV0, cursorsStage);
cursorText("m/s", xmaxCursor+60, yV0, cursorsStage);
const v0Button = cursorButton('blue', xminCursor+0.75*lineLength, yV0, cursorsStage);
const v0Text = cursorText("", xmaxCursor+55, yV0, cursorsStage);
v0Text.textAlign = 'right';

// valeurs limites
const minV0 = 0;
const maxV0 = 15;
let v0 = 10;

function getV0() {
    /*
        Récupère la valeur de v0 à partir de la position du curseur
        et met à jour l'affichage de la valeur.
    */
    v0 = (v0Button.x - xminCursor) / lineLength * (maxV0 - minV0) + minV0;
    v0Text.text = v0.toLocaleString('fr-FR', {maximumFractionDigits: 1});
}



// ===== Curseur pour l'angle initial =====

const yAlpha = 80;      // position verticale du curseur

// création du curseur
cursorLine(xminCursor, yAlpha, cursorsStage);
cursorText("α", xminCursor-40, yAlpha, cursorsStage);
cursorText("°", xmaxCursor+60, yAlpha, cursorsStage);
const alphaButton = cursorButton('purple', xminCursor+0.5*lineLength, yAlpha, cursorsStage);
const alphaText = cursorText("", xmaxCursor+55, yAlpha, cursorsStage);
alphaText.textAlign = 'right';

// valeurs limites
const minAlpha = -Math.PI/6;
const maxAlpha = Math.PI/3;
let alpha = Math.PI/12;

function getAlpha() {
    /*
        Récupère la valeur de alpha à partir de la position du curseur
        et met à jour l'affichage de la valeur.
    */
    alpha = (alphaButton.x - xminCursor) / lineLength * (maxAlpha - minAlpha) + minAlpha;
    alphaText.text = (alpha * 180 / Math.PI).toLocaleString('fr-FR', {maximumFractionDigits: 1});
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
        Action lors du déplacement d'un curseur.
    */
    button = event.currentTarget;
    button.x = Math.min(Math.max(xminCursor, event.stageX + button.offsetX), xminCursor+lineLength);
    cursorsStage.update();
    
    initialize();
    drawTrajectory();
    drawPlots();
}

// écouteurs
y0Button.addEventListener("mousedown", onMouseDown);
y0Button.addEventListener("pressmove", onPressMove);

v0Button.addEventListener("mousedown", onMouseDown);
v0Button.addEventListener("pressmove", onPressMove);

alphaButton.addEventListener("mousedown", onMouseDown);
alphaButton.addEventListener("pressmove", onPressMove);





//==============================
//       Canvas graphes
//==============================

let plotsCanvas = document.querySelector("#canvas_plots");
let plotsStage = new createjs.Stage(plotsCanvas);
plotsStage.enableMouseOver();
createjs.Touch.enable(plotsStage);
plotsStage.mouseMoveOutside = true;



// ===== Création des graphes ====

let plotsAxes = new createjs.Shape();
plotsStage.addChild(plotsAxes);

plotsAxes.graphics.ss(2, 1, 1).s('black');

plotsAxes.x = 40;
plotsAxes.y = 320;



// ===== Position x ====

plotsAxes.graphics.mt(0, -160).lt(0, -280);
plotsAxes.graphics.mt(0, -160).lt(180, -160);
plotsAxes.graphics.mt(-5, -275).lt(0, -280).lt(5, -275);
plotsAxes.graphics.mt(175, -155).lt(180, -160).lt(175, -165);

let xPosition = new createjs.Shape();
plotsStage.addChild(xPosition);
xPosition.x = 40;
xPosition.y = 160;

let xPositionAbs = new createjs.Text("t", "16px Quicksand", 'black');
plotsStage.addChild(xPositionAbs);
xPositionAbs.x = 230;
xPositionAbs.y = 160;
xPositionAbs.textAlign = 'left';
xPositionAbs.textBaseline = 'middle';

let xPositionOrd = new createjs.Text("x", "16px Quicksand", 'black');
plotsStage.addChild(xPositionOrd);
xPositionOrd.x = 40;
xPositionOrd.y = 25;
xPositionOrd.textAlign = 'center';
xPositionOrd.textBaseline = 'middle';

function initializeXPosition() {
    /*
        Initialise le graphe de l'abscisse.
    */
    xPosition.graphics.clear();
    xPosition.graphics.ss(2, 1, 1).s('red');
    xPosition.graphics.mt(0, 0);
}



// ===== Position y ====

plotsAxes.graphics.mt(250, -160).lt(250, -280);
plotsAxes.graphics.mt(250, -160).lt(430, -160);
plotsAxes.graphics.mt(245, -275).lt(250, -280).lt(255,-275);
plotsAxes.graphics.mt(425, -155).lt(430, -160).lt(425, -165);

let yPosition = new createjs.Shape();
plotsStage.addChild(yPosition);
yPosition.x = 290;
yPosition.y = 160;

let yPositionAbs = new createjs.Text("t", "16px Quicksand", 'black');
plotsStage.addChild(yPositionAbs);
yPositionAbs.x = 480;
yPositionAbs.y = 160;
yPositionAbs.textAlign = 'left';
yPositionAbs.textBaseline = 'middle';

let yPositionOrd = new createjs.Text("y", "16px Quicksand", 'black');
plotsStage.addChild(yPositionOrd);
yPositionOrd.x = 290;
yPositionOrd.y = 25;
yPositionOrd.textAlign = 'center';
yPositionOrd.textBaseline = 'middle';

function initializeYPosition() {
    /*
        Initialise le graphie de l'ordonnée.
    */
    yPosition.graphics.clear();
    yPosition.graphics.ss(2, 1, 1).s('red');
    yPosition.graphics.mt(0, -y0/2.5);
}



// ===== Vitesse x ====

plotsAxes.graphics.mt(0, 0).lt(0, -120);
plotsAxes.graphics.mt(0, 0).lt(180, 0);
plotsAxes.graphics.mt(-5, -115).lt(0, -120).lt(5, -115);
plotsAxes.graphics.mt(175, -5).lt(180, 0).lt(175, 5);

let xVelocity = new createjs.Shape();
plotsStage.addChild(xVelocity);
xVelocity.x = 40;
xVelocity.y = 320;

let xVelocityAbs = new createjs.Text("t", "16px Quicksand", 'black');
plotsStage.addChild(xVelocityAbs);
xVelocityAbs.x = 230;
xVelocityAbs.y = 320;
xVelocityAbs.textAlign = 'left';
xVelocityAbs.textBaseline = 'middle';

let xVelocityOrd = new createjs.Text("v", "16px Quicksand", 'black');
plotsStage.addChild(xVelocityOrd);
xVelocityOrd.x = 36;
xVelocityOrd.y = 185;
xVelocityOrd.textAlign = 'center';
xVelocityOrd.textBaseline = 'middle';

let xVelocityIndex = new createjs.Text("x", "12px Quicksand", 'black');
plotsStage.addChild(xVelocityIndex);
xVelocityIndex.x = 44;
xVelocityIndex.y = 188;
xVelocityIndex.textAlign = 'center';
xVelocityIndex.textBaseline = 'middle';

function initializeXVelocity() {
    /*
        Initialise le graphe de la composante horizontale de la vitesse.
    */
    xVelocity.graphics.clear();
    xVelocity.graphics.ss(2, 1, 1).s('purple');
    xVelocity.graphics.mt(0, -vx0*100/15);
}



// ===== Vitesse y ====

plotsAxes.graphics.mt(250, 0).lt(250, -120);
plotsAxes.graphics.mt(250, -80).lt(430, -80);
plotsAxes.graphics.mt(245, -115).lt(250, -120).lt(255, -115);
plotsAxes.graphics.mt(425, -75).lt(430, -80).lt(425, -85);

let yVelocity = new createjs.Shape();
plotsStage.addChild(yVelocity);
yVelocity.x = 290;
yVelocity.y = 240;

let yVelocityAbs = new createjs.Text("t", "16px Quicksand", 'black');
plotsStage.addChild(yVelocityAbs);
yVelocityAbs.x = 480;
yVelocityAbs.y = 240;
yVelocityAbs.textAlign = 'left';
yVelocityAbs.textBaseline = 'middle';

let yVelocityOrd = new createjs.Text("v", "16px Quicksand", 'black');
plotsStage.addChild(yVelocityOrd);
yVelocityOrd.x = 286;
yVelocityOrd.y = 185;
yVelocityOrd.textAlign = 'center';
yVelocityOrd.textBaseline = 'middle';

let yVelocityIndex = new createjs.Text("y", "12px Quicksand", 'black');
plotsStage.addChild(yVelocityIndex);
yVelocityIndex.x = 294;
yVelocityIndex.y = 188;
yVelocityIndex.textAlign = 'center';
yVelocityIndex.textBaseline = 'middle';

function initializeYVelocity() {
    /*
        Initialise le graphe de la composante verticale de la vitesse.
    */
    yVelocity.graphics.clear();
    yVelocity.graphics.ss(2, 1, 1).s('purple');
    yVelocity.graphics.mt(0, -vy0*100/40);
}



// ===== Calculs des positions et vitesse ====

const g = 9.81;             // accélération de la pesanteur

function computePosition(time) {
    /*
        Calcule la position de la balle au temps indiqué.
    */
    x = x0 + vx0 * time * positionScale;
    y = y0 + (vy0 * time - 0.5 * g * time**2) * positionScale;
}

function computeVelocity(time) {
    /*
        Calcule la vitesse de la balle au temps indiqué.
    */
    vy = vy0 - g * time;
}

function updatePlots(time) {
    /*
        Met à jour les graphes.
    */
    xPosition.graphics.lt(time*40, -(x-x0)/4);
    yPosition.graphics.lt(time*40, -y/2.5);
    xVelocity.graphics.lt(time*40, -vx0*100/15);
    yVelocity.graphics.lt(time*40, -vy*100/40);
    plotsStage.update();    
}

function drawPlots() {
    /*
        Trace entièrement les graphes de x, y, vx et vy.
    */
    const deltaTime = 0.05;
    let time = deltaTime;
    computePosition(time);
    computeVelocity(time);
    while (y > 0) {
        updatePlots(time);
        time += deltaTime;
        computePosition(time);
        computeVelocity(time);
    }
    plotsStage.update();
}





//==============================
//      Canvas trajectoire
//==============================

let canvas = document.querySelector("#canvas_trajectory");
let trajectoryStage = new createjs.Stage(canvas);
trajectoryStage.enableMouseOver();
createjs.Touch.enable(trajectoryStage);
trajectoryStage.mouseMoveOutside = true;

container = new createjs.Container();
trajectoryStage.addChild(container);
container.x = 50;

const yOffset = 330;



// ===== Création des axes ====

let axes = new createjs.Shape();
container.addChild(axes);
axes.y = yOffset;

axes.graphics.ss(3, 1, 1).s('black');

// axe des abscisses
axes.graphics.mt(x0, 0).lt(520, 0);
axes.graphics.mt(510, -10).lt(520, 0).lt(510, 10);

let xLegend = new createjs.Text("x", "20px Quicksand", 'black');
container.addChild(xLegend);
xLegend.x = 530;
xLegend.y = yOffset;
xLegend.textBaseline = 'middle';

// axe des ordonnées
axes.graphics.mt(x0, 0).lt(x0, -290);
axes.graphics.mt(10, -280).lt(20, -290).lt(30, -280);

let yLegend = new createjs.Text("y", "20px Quicksand", 'black');
container.addChild(yLegend);
yLegend.x = x0;
yLegend.y = yOffset - 320;
yLegend.textAlign = 'center';

// flèche y0
let y0Arrow = new createjs.Shape();
container.addChild(y0Arrow);
y0Arrow.x = 0;

let y0Legend = new createjs.Text("y₀", "20px Quicksand", 'red');
container.addChild(y0Legend);
y0Legend.x = -20;
y0Legend.textBaseline = 'middle';
y0Legend.textAlign = 'center';



// ===== Tracé de la trajectoire ====

function initializeTrajectory() {
    /*
        Initialise le graphe de la trajectoire.
    */
    trajectory.graphics.clear();
    trajectory.graphics.ss(2, 1, 1).s('red');
    trajectory.graphics.mt(x0, -y0);
}

function updateTrajectory() {
    /*
        Met à jour le graphe de la trajectoire.
    */
    trajectory.graphics.lt(x, -y);
}

function drawTrajectory() {
    /*
        Trace entièrement la trajectoire de la balle.
    */
    const deltaTime = 0.01;
    let time = deltaTime;
    computePosition(time);
    while (y > 0) {
        updateTrajectory();
        time += deltaTime;
        computePosition(time);
    }
    trajectoryStage.update();
}

function drawY0Legend() {
    /*
        Représente la légende pour indiquer la hauteur initiale y0.
    */
    y0Arrow.graphics.clear();
    y0Arrow.graphics.ss(2, 1, 1).s('red');
    y0Arrow.graphics.mt(0, yOffset).lt(0, yOffset-y0);
    y0Arrow.graphics.mt(-5, yOffset-5).lt(0, yOffset).lt(5, yOffset-5);
    y0Arrow.graphics.mt(-5, yOffset-y0+5).lt(0, yOffset-y0).lt(5, yOffset-y0+5);
    
    y0Legend.y = yOffset - 0.5*y0;
    
    trajectoryStage.update();
}





//==============================
//      Tracé de la balle
//==============================

const velocityFactor = 6;   // échelle de vitesse
let moving = false;



// ===== Création des éléments Shape ====

let ball = new createjs.Shape();
ball.y = yOffset;
ball.graphics.f('red');
ball.graphics.dc(0, 0, 8);
container.addChild(ball);

let velocity = new createjs.Shape();
velocity.y = yOffset;
container.addChild(velocity);

let trajectory = new createjs.Shape();
trajectory.y = yOffset;
container.addChild(trajectory);



// ===== Affichage des composantes ====

let componentsContainer = new createjs.Container();
trajectoryStage.addChild(componentsContainer);
componentsContainer.x = 335;
componentsContainer.y = 80;

let componentsCheckbox = new createjs.Shape();
componentsContainer.addChild(componentsCheckbox);
componentsCheckbox.cursor = 'pointer';

componentsCheckbox.addEventListener("click", changeShowComponents);

let componentsText = new createjs.Text("Montrer les composantes\ndu vecteur vitesse", "20px Quicksand", 'black');
componentsContainer.addChild(componentsText);
componentsText.x = 25;
componentsText.y = 9;
componentsText.textBaseline = 'middle';
componentsText.textAlign = 'left';

let showComponents = true;
changeShowComponents();
changeShowComponents();

function changeShowComponents() {
    if (showComponents) {
        componentsCheckbox.graphics.clear();
        componentsCheckbox.graphics.ss(1, 1, 1).s('black').f('white');
        componentsCheckbox.graphics.drawRect(0, 0, 18, 18);
    } else {
        componentsCheckbox.graphics.ss(1, 1, 1).s('purple').f('purple');
        componentsCheckbox.graphics.drawRect(4, 4, 10, 10);
    }
    showComponents = !showComponents;
    if (!moving) {
        initializeBall();
    }
    drawVelocity();
}



// ===== Fonctions de tracé ====

function drawBall() {
    /*
        Trace la balle à la position (x, y).
    */
    ball.x = x;
    ball.y = yOffset - y;
    trajectoryStage.update();
}

function drawVelocity() {
    /*
        Trace le vecteur vitesse et ses deux composantes.
    */
    velocity.graphics.clear();    
    velocity.graphics.ss(1, 1, 1);
    
    if (showComponents) {
        // composante horizontale
        drawVector(
            velocity,
            x, -y,
            x + vx0 * velocityFactor, -y,
            'purple', dashed=true
        );
    
        // composante verticale
        drawVector(
            velocity,
            x + vx0 * velocityFactor, -y,
            x + vx0 * velocityFactor, -y - vy * velocityFactor,
            'purple', dashed=true
        );
    }
    
    // vecteur
    velocity.graphics.ss(2, 1, 1);
    drawVector(
        velocity,
        x, -y,
        x + vx0 * velocityFactor, -y - vy * velocityFactor,
        'blue'
    )
    
    trajectoryStage.update();
}





//==============================
//         Animation
//==============================

// ===== Bouton de lancer ====

let buttonContainer = new createjs.Container();
trajectoryStage.addChild(buttonContainer);
buttonContainer.x = 335;
buttonContainer.y = 20;
buttonContainer.cursor = 'pointer';

let throwButton = new createjs.Shape();
buttonContainer.addChild(throwButton);

let throwText = new createjs.Text("Lancer la balle", "20px Quicksand", '#666666');
buttonContainer.addChild(throwText);
throwText.x = 10;
throwText.y = throwText.getMeasuredHeight()/2 + 10;
throwText.textBaseline = 'middle';

drawThrowButton();

buttonContainer.addEventListener("mousedown", function(event) {
    throwButton.graphics.clear();
    throwButton.graphics.ss(2, 1, 1).s('#ffcccc').f('#ff5555');
    throwButton.graphics.drawRoundRect(0, 0, throwText.getMeasuredWidth()+20, throwText.getMeasuredHeight()+20, 5);
    throwText.color = 'white';
});
buttonContainer.addEventListener("click", throwBall);
buttonContainer.addEventListener("pressup", drawThrowButton);

function drawThrowButton() {
    /*
        Dessine le bouton de lancement de la balle.
    */
    throwButton.graphics.clear();
    throwButton.graphics.ss(2, 1, 1).s('#ff5555').f('#ffcccc');
    throwButton.graphics.drawRoundRect(0, 0, throwText.getMeasuredWidth()+20, throwText.getMeasuredHeight()+20, 5);
    throwText.color = '#666666';
}



// ===== Animation ====

function freezeCursors() {
    /*
        Gèle les curseurs.
    */
    // boutons grisés
    drawButton(y0Button, '#cccccc');
    drawButton(v0Button, '#cccccc');
    drawButton(alphaButton, '#cccccc');
    
    // curseur par défaut sur les boutons
    y0Button.cursor = 'default';
    v0Button.cursor = 'default';
    alphaButton.cursor = 'default';
    
    // suppression des écouteurs
    y0Button.removeEventListener("mousedown", onMouseDown);
    v0Button.removeEventListener("mousedown", onMouseDown);
    alphaButton.removeEventListener("mousedown", onMouseDown);
    
    y0Button.removeEventListener("pressmove", onPressMove);
    v0Button.removeEventListener("pressmove", onPressMove);
    alphaButton.removeEventListener("pressmove", onPressMove);
}

function unfreezeCursors() {
    /*
        Dégèle les curseurs.
    */
    // boutons colorés
    drawButton(y0Button, 'red');
    drawButton(v0Button, 'blue');
    drawButton(alphaButton, 'purple');
    
    // pointeur sur les boutons
    y0Button.cursor = 'pointer';
    v0Button.cursor = 'pointer';
    alphaButton.cursor = 'pointer';
    
    // ajout des écouteurs
    y0Button.addEventListener("mousedown", onMouseDown);
    v0Button.addEventListener("mousedown", onMouseDown);
    alphaButton.addEventListener("mousedown", onMouseDown);
    
    y0Button.addEventListener("pressmove", onPressMove);
    v0Button.addEventListener("pressmove", onPressMove);
    alphaButton.addEventListener("pressmove", onPressMove);
}

function throwBall() {
    /*
        Anime le lancer de la balle.
    */
    freezeCursors();
    initialize();
    moving = true;

    let time = 0;
    const deltaTime = 10;

    clearInterval(interval);
    interval = setInterval(animate, deltaTime);

    function animate() {
        time += deltaTime/1000.;
        computePosition(time);
        computeVelocity(time);
        
        // arrêt de l'animation        
        if (y < 0) {
            clearInterval(interval);
            unfreezeCursors();
            moving = false;
        }
        
        drawBall();
        drawVelocity();
        updateTrajectory();
        updatePlots(time);
    }
}





//==============================
//      Initialisation
//==============================

function initializeBall() {
    /*
        Initialise la position de la balle et le vecteur vitesse.
    */
    // position initiale
    getY0();
    x = x0;
    y = y0;
    
    // vitesse initiale
    getV0();
    getAlpha();
    vx0 = v0 * Math.cos(alpha);
    vy0 = v0 * Math.sin(alpha);
    vy = vy0;
    
    // dessine la balle à sa position initiale avec le vecteur vitesse
    drawBall();
    drawVelocity();
    drawY0Legend();
}

function initialize() {
    /*
        Initialise les tracés.
    */
    initializeBall();
    
    // initialise les graphes
    initializeTrajectory();
    initializeXPosition();
    initializeYPosition();
    initializeXVelocity();
    initializeYVelocity();
}

let interval = null;
initialize();
drawTrajectory();
drawPlots();
initialize();
cursorsStage.update();