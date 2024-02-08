/*
    --------------------------------
    |    Mouvement des planètes    |
    --------------------------------

    Cette simulation permet de visualiser les trajectoires des
    différentes planètes du système solaire dans le référentiel
    héliocentrique.
    Options :
        - affichage des astres ;
        - affichages de trajectoires ;
        - affichage du vecteur vitesse ;
        - affichage du vecteur force ;
        - affichage des coordonnées du vecteur vitesse à trois
        dates successives ;
        - mise en pause de l'animation.
*/




//==============================
//      Canevas graphique
//==============================

const movementCanvas = document.querySelector("#movement");
movementCanvas.width = 0.8 * window.screen.height;
movementCanvas.height = 500;

const movementStage = new createjs.Stage(movementCanvas);
movementStage.enableMouseOver();
createjs.Touch.enable(movementStage);
movementStage.mouseMoveOutside = true;

const container = new createjs.Container();
movementStage.addChild(container);



// ==== Shapes ====

// Soleil
const sun = new createjs.Shape();
sun.graphics.f('orange');
sun.graphics.dc(0, 0, 10);
container.addChild(sun);
container.x = movementCanvas.width * 0.5;
container.y = movementCanvas.height * 0.5;

// trajectoire de la planète
const trajectory = new createjs.Shape();
container.addChild(trajectory);

// planète
const planet = new createjs.Shape();
planet.graphics.f('red');
planet.graphics.dc(0, 0, 5);
planet.x = 100;
planet.y = 100;
container.addChild(planet);

// curseur de position
const cursor = new createjs.Shape();
container.addChild(cursor);

// vecteur vitesse
const velocityVector = new createjs.Shape();
container.addChild(velocityVector);

// vecteur force
const forceVector = new createjs.Shape();
container.addChild(forceVector);

// légende abscisse
const xText = new createjs.Text("", "14px Quicksand", 'black');
container.addChild(xText);
xText.textBaseline = 'middle';
xText.textAlign = 'center';

// légende ordonnée
const yText = new createjs.Text("", "14px Quicksand", 'black');
container.addChild(yText);
yText.textBaseline = 'middle';
yText.textAlign = 'center';



//==== Axes ====

const axes = new createjs.Shape();
axes.graphics.ss(2, 1, 1).s('black');
container.addChild(axes);

// axe des abscisses
axes.graphics.mt(-0.5*movementCanvas.width, 0);
axes.graphics.lt(0.5*movementCanvas.width, 0);

axes.graphics.mt(0.5*movementCanvas.width-10, -10);
axes.graphics.lt(0.5*movementCanvas.width, 0);
axes.graphics.lt(0.5*movementCanvas.width-10, 10);

// axe des ordonnées
axes.graphics.mt(0, 0.5*movementCanvas.height);
axes.graphics.lt(0, -0.5*movementCanvas.height);

axes.graphics.mt(-10, -0.5*movementCanvas.height+10);
axes.graphics.lt(0, -0.5*movementCanvas.height);
axes.graphics.lt(10, -0.5*movementCanvas.height+10);

// légende de l'axe des abscisses
const xLegend = new createjs.Text("x", "16px Quicksand", 'black');
container.addChild(xLegend);
xLegend.x = 0.5*movementCanvas.width-10;
xLegend.y = 15;

// légende de l'axe des ordonnées
const yLegend = new createjs.Text("y", "16px Quicksand", 'black');
container.addChild(yLegend);
yLegend.x = -25;
yLegend.y = -0.5*movementCanvas.height+5;





//==============================
//             Menu
//==============================

// ==== Sélecteur ====

const selector = document.querySelector("#planets");
for (p in planets) {
    opt = document.createElement("option");
    opt.setAttribute("value", p);
    opt.innerText = planets[p]['name'];
    selector.appendChild(opt);
}

// écouteur pour le choix de la planète
selector.addEventListener(
    "change",
    function() {
        choice = this.value;
        initializePlanet();
    }
);



// ==== Affichage des informations ====

const previousVx = document.querySelector("#previous_vx");
const previousVy = document.querySelector("#previous_vy");
const currentVx = document.querySelector("#vx");
const currentVy = document.querySelector("#vy");
const nextVx = document.querySelector("#next_vx");
const nextVy = document.querySelector("#next_vy");

const menu = document.querySelector("#menu");
const menuRect = menu.getBoundingClientRect();
const buttonContainer = document.querySelectorAll(".button_container")[0];
const button = document.querySelector("#button");
button.style.width = (menuRect.right-menuRect.left-60) + "px";

// écouteur pour la mise en pause de l'animation
button.addEventListener(
    "click", function() {
        if (!paused) {
            this.innerHTML = "Relancer";
        } else {
            this.innerHTML = "Mettre en pause";
        }
        paused = !paused;
    }
);

function displayCoordinates() {
    /*
        Affiche les coordonnées des vecteurs position, vitesse
        et accélération.
    */
    previousVx.innerText = vxList[vxList.length-3].toLocaleString('fr-FR', {maximumFractionDigits: 0});
    previousVy.innerText = (-vyList[vyList.length-3]).toLocaleString('fr-FR', {maximumFractionDigits: 0});
    currentVx.innerText = vxList[vxList.length-2].toLocaleString('fr-FR', {maximumFractionDigits: 0});
    currentVy.innerText = (-vyList[vyList.length-2]).toLocaleString('fr-FR', {maximumFractionDigits: 0});
    nextVx.innerText = vxList[vxList.length-1].toLocaleString('fr-FR', {maximumFractionDigits: 0});
    nextVy.innerText = (-vyList[vyList.length-1]).toLocaleString('fr-FR', {maximumFractionDigits: 0});
}





//==============================
//     Tracé de la planète
//==============================

// ==== Création des variables ====

// constantes utilisées dans les calculs
const G = 6.67e-11;
const SUN_MASS = 2.0e30;

// création des variables
let choice = 'mercury';
let perihelion = 0;
let aphelion = 0;
let timeInterval = 0;
let perihelionVelocity = 0;

// échelles
let distanceScale = 1;
let velocityScale = 1;
let forceScale = 1;

// coordonnées des vecteurs
let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
let ax = 0;
let ay = 0;

// liste des coordonnées des vecteurs
let xList = [];
let yList = [];
let vxList = [];
let vyList = [];
let axList = [];
let ayList = [];

// position actuelle
let currentX = 0;
let currentY = 0;



// ==== Initialisation ====

/*
    Le mouvement commence au périhélie.
    Au début de l'animation ou lorsqu'une nouvelle planète est
    sélectionnée, il faut :
        - calculer la vitesse au périhélie ;
        - calculer les échelles pour adapter l'orbite et les vecteurs
        à la fenêtre graphique.
*/

function computePerihelionVelocity() {
    /*
        Calcule la vitesse au périhélie.
    */
    perihelionVelocity = Math.sqrt(2 * G * SUN_MASS * aphelion / (perihelion * (perihelion+aphelion)));
}

function computeDistanceScale() {
    /*
        Calcule l'échelle de distance.
    */
    distanceScale = Math.min(
        0.7*movementCanvas.width/(perihelion + aphelion),
        0.7*movementCanvas.height/((perihelion + aphelion)*Math.sqrt(1-chosenPlanet['excentricity']**2))
    );
}

function computeVelocityScale() {
    /*
        Calcule l'échelle de vitesse.
    */
    velocityScale = 75./perihelionVelocity;
}

function computeForceScale() {
    /*
        Calcule l'échelle pour représenter la force.
    */
    forceScale = 0.67 * perihelion * distanceScale / (G * SUN_MASS/perihelion**2);
}

function initializePlanet() {
    /*
        Initialise les grandeurs pour la planète sélectionnée.
    */
    paused = true;
    
    // paramètres de la planète
    chosenPlanet = planets[choice];
    perihelion = chosenPlanet['perihelion'];
    aphelion = chosenPlanet['aphelion'];
    timeInterval = chosenPlanet['timeInterval'];
    
    computePerihelionVelocity();
    computeDistanceScale();
    computeVelocityScale();
    computeForceScale();
    
    // initialisation des coordonnées
    x = perihelion;
    y = 0;
    vx = 0;
    vy = perihelionVelocity;
    ax = - G * SUN_MASS / perihelion**2;
    ay = 0;
    
    // initialisation des listes
    xList = [x * distanceScale];
    yList = [y * distanceScale];
    vxList = [vx];
    vyList = [vy];
    axList = [ax];
    ayList = [ay];
    
    // increasePosition();
    
    paused = false;
}



// ==== Tracé de la planète ====

function drawTrajectory() {
    /*
        Trace la trajectoire.
    */
    trajectory.graphics.clear();
    trajectory.graphics.ss(2, 1, 1).s('red');
    trajectory.graphics.mt(xList[0], yList[0]);
    for (i = 5; i < xList.length; i+=5) {
        trajectory.graphics.lt(xList[i], yList[i]);
    }
}

function drawPlanet() {
    /*
        Place la planète à la position actuelle.
    */
    planet.x = currentX;
    planet.y = currentY;
}

function drawCursor() {
    /*
        Trace le curseur.
    */
    cursor.graphics.clear();
    cursor.graphics.setStrokeDash([5,6]).s('black');
    cursor.graphics.mt(currentX, 0);
    cursor.graphics.lt(currentX, currentY);
    cursor.graphics.lt(0, currentY);
}

function drawXLegend() {
    /*
        Écris l'abscisse de la planète.
    */
    xText.text = (currentX/distanceScale).toExponential(2).replace(".", ",") + " m";
    xText.x = currentX;
    xText.y = currentY > 0 ? -15 : 15;
}

function drawYLegend() {
    /*
        Écris l'ordonnée de la planète.
    */
    yText.text = (-currentY/distanceScale).toExponential(2).replace(".", ",") + " m";
    if (currentX > 0) {
        yText.textAlign = "right";
        yText.x = -10;
    } else {
        yText.textAlign = "left";
        yText.x = 10;
    }
    yText.y = currentY;
}

function drawVelocity () {
    /*
        Trace le vecteur vitesse à la position actuelle.
    */
    velocityVector.graphics.clear();
    drawVector(
        velocityVector,
        planet.x,
        planet.y,
        planet.x + vxList[vxList.length-2]*velocityScale,
        planet.y + vyList[vyList.length-2]*velocityScale,
        'purple'
    );
}

function drawForce () {
    /*
        Trace le vecteur force à la position actuelle.
    */
    forceVector.graphics.clear();
    drawVector(
        forceVector,
        planet.x,
        planet.y,
        planet.x + axList[axList.length-2]*forceScale,
        planet.y + ayList[ayList.length-2]*forceScale,
        'orange'
    );
}




// ==== Animation ====

// initialisation
let interval = null;
let paused = false;
initializePlanet();

clearInterval(interval);
const animationInterval = 10;
interval = setInterval(animate, animationInterval);

function nextPosition() {
    /*
        Passe à la position suivante.
    */
    increasePosition();
    increaseVelocity();
    increaseAcceleration();
    
    currentX = xList[xList.length-2];
    currentY = yList[yList.length-2];
}

function increasePosition() {
    /*
        Incrémente la position.
    */
    x += vx * timeInterval;
    y += vy * timeInterval;
    
    if (xList.length > 10000) {
        xList.shift();
        yList.shift();
    }
    xList.push(x * distanceScale);
    yList.push(y * distanceScale);
}

function increaseVelocity() {
    /*
        Incrémente la vitesse.
    */
    vx += ax * timeInterval;
    vy += ay * timeInterval;
    
    if (vxList.length > 3) {
        vxList.shift();
        vyList.shift();
    }
    vxList.push(vx);
    vyList.push(vy);
}

function increaseAcceleration() {
    /*
        Incrémente l'accélération.
    */
    let theta = computeAngle(x, y);
    let distance = computeDistance(x, y);
    ax = -G * SUN_MASS * Math.cos(theta) / distance**2;
    ay = -G * SUN_MASS * Math.sin(theta) / distance**2;
    
    if (axList.length > 3) {
        axList.shift();
        ayList.shift();
    }
    axList.push(ax);
    ayList.push(ay);
}

function update() {
    /*
        Mise à jour.
    */
    drawTrajectory();
    drawPlanet();
    drawCursor();
    drawXLegend();
    drawYLegend();
    drawVelocity();
    drawForce();
    displayCoordinates();    
    movementStage.update();
}

function animate() {
    /*
        Animation.
    */
    if (!paused) {
        nextPosition();
        nextPosition();
        nextPosition();
        update();
    }
}