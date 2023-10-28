/*
    --------------------------------
    |    Rétrogradation de Mars    |
    --------------------------------

    Cette simulation permet de visualiser les trajectoires du Soleil,
    de la Terre et de Mars, dans les référentiels héliocentriques et
    géocentriques.
    Options :
        - affichage des astres ;
        - affichages de trajectoires ;
        - affichages des vecteurs liant deux astres ;
        - mise en pause de l'animation.
*/




const canvasSize = 0.5 * window.screen.height;
let paused = false;





//==============================
//        Référentiels
//==============================

class Frame {
    /*
        Définit une classe pour un référentiel.
        Attributs :
            - stage : l'élément Stage dans lequel s'effectuent les tracés ;
            - container : l'élément Container contenant l'animation ;
            - sun : un élément Shape pour le Soleil ;
            - earth : un élément Shape pour la Terre ;
            - mars : un élémnets Shape pour Mars ;
            - sunEarthVector : un élément Shape pour tracer le vecteur
            Soleil-Terre ;
            - sunMarsVector : un élément Shape pour tracer le vecteur
            Soleil-Mars ;
            - earthMarsVector : un élément Shape pour tracer le vecteur
            Terre-Mars ;
            - sunTrajectory : un élément Shape pour tracer la trajectoire
            du Soleil ;
            - earthTrajectory : un élément Shape pour tracer la trajectoire
            de la Terre ;
            - marsTrajectory : un élément Shape pour tracer la trajectoire
            de Mars.
    */
    constructor (stage) {
        this.stage = stage;
        
        // conteneur
        this.container = new createjs.Container();
        this.stage.addChild(this.container);
        this.container.x = 0.5 * canvasSize;
        this.container.y = 0.5 * canvasSize;
        
        // astres
        this.sun = new createjs.Shape();
        this.sun.graphics.f('orange');
        this.sun.graphics.dc(0, 0, 20);
        this.container.addChild(this.sun);
        
        this.earth = new createjs.Shape();
        this.earth.graphics.f('blue');
        this.earth.graphics.dc(0, 0, 10);
        this.container.addChild(this.earth);
        
        this.mars = new createjs.Shape();
        this.mars.graphics.f('red');
        this.mars.graphics.dc(0, 0, 5);
        this.container.addChild(this.mars);
        
        // vecteurs        
        this.sunEarthVector = new createjs.Shape();
        this.container.addChild(this.sunEarthVector);
        
        this.sunMarsVector = new createjs.Shape();
        this.container.addChild(this.sunMarsVector);
        
        this.earthMarsVector = new createjs.Shape();
        this.container.addChild(this.earthMarsVector);
        
        // trajectoires
        this.earthTrajectory = new createjs.Shape();
        this.container.addChild(this.earthTrajectory);
        
        this.marsTrajectory = new createjs.Shape();
        this.container.addChild(this.marsTrajectory);
        
        this.sunTrajectory = new createjs.Shape();
        this.container.addChild(this.sunTrajectory);
    }
    
    moveSun(x, y) {
        /*
            Place le Soleil à la position (x, y).
        */
        this.sun.x = x;
        this.sun.y = y;
        this.stage.update();
    }
    
    moveEarth(x, y) {
        /*
            Place la Terre à la position (x, y).
        */
        this.earth.x = x;
        this.earth.y = y;
        this.stage.update();
    }
    
    moveMars(x, y) {
        /*
            Place Mars à la position (x, y).
        */
        this.mars.x = x;
        this.mars.y = y;
        this.stage.update();
    }
    
    drawSunEarthVector() {
        /*
            Trace le vecteur Soleil-Terre.
        */
        this.sunEarthVector.graphics.clear();
        this.sunEarthVector.graphics.ss(2, 1, 1);
        drawVector(
            this.sunEarthVector,
            this.sun.x,
            this.sun.y,
            this.earth.x,
            this.earth.y,
            'red',
            true
        );
    }
    
    drawSunMarsVector() {
        /*
            Trace le vecteur Soleil-Mars.
        */
        this.sunMarsVector.graphics.clear();
        this.sunMarsVector.graphics.ss(2, 1, 1);
        drawVector(
            this.sunMarsVector,
            this.sun.x,
            this.sun.y,
            this.mars.x,
            this.mars.y,
            'blue',
            true
        );
    }
    
    drawEarthMarsVector() {
        /*
            Trace le vecteur Terre-Mars.
        */
        this.earthMarsVector.graphics.clear();
        this.earthMarsVector.graphics.ss(2, 1, 1);
        drawVector(
            this.earthMarsVector,
            this.earth.x,
            this.earth.y,
            this.mars.x,
            this.mars.y,
            'orange',
            true
        );
    }
    
    drawEarthTrajectory(xList, yList) {
        /*
            Trace la trajectoire de la Terre.
        */
        this.earthTrajectory.graphics.clear();
        this.earthTrajectory.graphics.ss(1, 1, 1).s('blue');
        this.earthTrajectory.graphics.mt(xList[0], yList[0]);
        for (let i = 1; i < xList.length; i++) {
            this.earthTrajectory.graphics.lt(xList[i], yList[i]);
        }
        this.stage.update();
    }
    
    drawMarsTrajectory(xList, yList) {
        /*
            Trace la trajectoire de Mars.
        */
        this.marsTrajectory.graphics.clear();
        this.marsTrajectory.graphics.ss(1, 1, 1).s('red');
        this.marsTrajectory.graphics.mt(xList[0], yList[0]);
        for (let i = 1; i < xList.length; i++) {
            this.marsTrajectory.graphics.lt(xList[i], yList[i]);
        }
        this.stage.update();
    }
    
    drawSunTrajectory(xList, yList) {
        /*
            Trace la trajectoire du Soleil.
        */
        this.sunTrajectory.graphics.clear();
        this.sunTrajectory.graphics.ss(1, 1, 1).s('orange');
        this.sunTrajectory.graphics.mt(xList[0], yList[0]);
        for (let i = 1; i < xList.length; i++) {
            this.sunTrajectory.graphics.lt(xList[i], yList[i]);
        }
        this.stage.update();
    }
}



// ==== Référentiel héliocentrique ====
const heliocentricCanvas = document.querySelector("#heliocentric");
heliocentricCanvas.width = canvasSize;
heliocentricCanvas.height = canvasSize;

const heliocentricStage = new createjs.Stage(heliocentricCanvas);
heliocentricStage.enableMouseOver();
createjs.Touch.enable(heliocentricStage);
heliocentricStage.mouseMoveOutside = true;

let heliocentricFrame = new Frame(heliocentricStage);

let heliocentricTitle = new createjs.Text("Référentiel héliocentrique", "20px Quicksand", 'black');
heliocentricStage.addChild(heliocentricTitle);
heliocentricTitle.x = 0.5 * heliocentricCanvas.width;
heliocentricTitle.y = 15;
heliocentricTitle.textAlign = 'center';
heliocentricTitle.textBaseline = 'middle';



// ==== Référentiel géocentrique ====

const geocentricCanvas = document.querySelector("#geocentric");
geocentricCanvas.width = canvasSize;
geocentricCanvas.height = canvasSize;

const geocentricStage = new createjs.Stage(geocentricCanvas);
geocentricStage.enableMouseOver();
createjs.Touch.enable(geocentricStage);
geocentricStage.mouseMoveOutside = true;

let geocentricFrame = new Frame(geocentricStage);

let geocentricTitle = new createjs.Text("Référentiel géocentrique", "20px Quicksand", 'black');
geocentricStage.addChild(geocentricTitle);
geocentricTitle.x = 0.5 * geocentricCanvas.width;
geocentricTitle.y = 15;
geocentricTitle.textAlign = 'center';
geocentricTitle.textBaseline = 'middle';





//==============================
//            Menu
//==============================

// ==== Affichage des vecteurs ====

let showSunEarthVector = true;
let showSunMarsVector = true;
let showEarthMarsVector = true;

const checkSunEarthVector = document.querySelector("#sun_earth");
const checkSunMarsVector = document.querySelector("#sun_mars");
const checkEarthMarsVector = document.querySelector("#earth_mars");

checkSunEarthVector.checked = true;
checkSunMarsVector.checked = true;
checkEarthMarsVector.checked = true;

checkSunEarthVector.addEventListener(
    "change", function(event) {
        showSunEarthVector = this.checked;
        if (!showSunEarthVector) {
            heliocentricFrame.sunEarthVector.graphics.clear();
            geocentricFrame.sunEarthVector.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);

checkSunMarsVector.addEventListener(
    "change", function(event) {
        showSunMarsVector = this.checked;
        if (!showSunMarsVector) {
            heliocentricFrame.sunMarsVector.graphics.clear();
            geocentricFrame.sunMarsVector.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);

checkEarthMarsVector.addEventListener(
    "change", function(event) {
        showEarthMarsVector = this.checked;
        if (!showEarthMarsVector) {
            heliocentricFrame.earthMarsVector.graphics.clear();
            geocentricFrame.earthMarsVector.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);



// ==== Affichage des trajectoires ====

let showSunTrajectory = true;
let showEarthTrajectory = true;
let showMarsTrajectory = true;

const checkSunTrajectory = document.querySelector("#sun_trajectory");
const checkEarthTrajectory = document.querySelector("#earth_trajectory");
const checkMarsTrajectory = document.querySelector("#mars_trajectory");

checkSunTrajectory.checked = true;
checkEarthTrajectory.checked = true;
checkMarsTrajectory.checked = true;

checkSunTrajectory.addEventListener(
    "change", function(event) {
        showSunTrajectory = this.checked;
        if (!showSunTrajectory) {
            heliocentricFrame.sunTrajectory.graphics.clear();
            geocentricFrame.sunTrajectory.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);

checkEarthTrajectory.addEventListener(
    "change", function(event) {
        showEarthTrajectory = this.checked;
        if (!showEarthTrajectory) {
            heliocentricFrame.earthTrajectory.graphics.clear();
            geocentricFrame.earthTrajectory.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);

checkMarsTrajectory.addEventListener(
    "change", function(event) {
        showMarsTrajectory = this.checked;
        if (!showMarsTrajectory) {
            heliocentricFrame.marsTrajectory.graphics.clear();
            geocentricFrame.marsTrajectory.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);



// ==== Affichage des astres ====

let showSun = true;
let showEarth = true;
let showMars = true;

const checkSun = document.querySelector("#sun");
const checkEarth = document.querySelector("#earth");
const checkMars = document.querySelector("#mars");

checkSun.checked = true;
checkEarth.checked = true;
checkMars.checked = true;

checkSun.addEventListener(
    "change", function(event) {
        showSun = this.checked;
        if (showSun) {
            showSunTrajectory = true;
            checkSunTrajectory.checked = true;
            
            heliocentricFrame.sun.graphics.f('orange');
            heliocentricFrame.sun.graphics.dc(0, 0, 20);
            
            geocentricFrame.sun.graphics.f('orange');
            geocentricFrame.sun.graphics.dc(0, 0, 20);
        } else {
            heliocentricFrame.sun.graphics.clear();
            geocentricFrame.sun.graphics.clear();
            
            heliocentricFrame.sunEarthVector.graphics.clear();
            geocentricFrame.sunEarthVector.graphics.clear();
            showSunEarthVector = false;
            checkSunEarthVector.checked = false;
            
            heliocentricFrame.sunMarsVector.graphics.clear();
            geocentricFrame.sunMarsVector.graphics.clear();
            showSunMarsVector = false;
            checkSunMarsVector.checked = false;
            
            showSunTrajectory = false;
            checkSunTrajectory.checked = false;            
            geocentricFrame.sunTrajectory.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);

checkEarth.addEventListener(
    "change", function(event) {
        showEarth = this.checked;
        if (showEarth) {
            showEarthTrajectory = true;
            checkEarthTrajectory.checked = true;
            
            heliocentricFrame.earth.graphics.f('blue');
            heliocentricFrame.earth.graphics.dc(0, 0, 10);
            
            geocentricFrame.earth.graphics.f('blue');
            geocentricFrame.earth.graphics.dc(0, 0, 10);
        } else {
            heliocentricFrame.earth.graphics.clear();
            geocentricFrame.earth.graphics.clear();
            
            heliocentricFrame.sunEarthVector.graphics.clear();
            geocentricFrame.sunEarthVector.graphics.clear();
            showSunEarthVector = false;
            checkSunEarthVector.checked = false;
            
            heliocentricFrame.earthMarsVector.graphics.clear();
            geocentricFrame.earthMarsVector.graphics.clear();
            showEarthMarsVector = false;
            checkEarthMarsVector.checked = false;
            
            showEarthTrajectory = false;
            checkEarthTrajectory.checked = false;
            heliocentricFrame.earthTrajectory.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);

checkMars.addEventListener(
    "change", function(event) {
        showMars = this.checked;
        if (showMars) {
            showMarsTrajectory = true;
            checkMarsTrajectory.checked = true;
            
            heliocentricFrame.mars.graphics.f('red');
            heliocentricFrame.mars.graphics.dc(0, 0, 5);
            
            geocentricFrame.mars.graphics.f('red');
            geocentricFrame.mars.graphics.dc(0, 0, 5);
        } else {
            heliocentricFrame.mars.graphics.clear();
            geocentricFrame.mars.graphics.clear();
            
            heliocentricFrame.sunMarsVector.graphics.clear();
            geocentricFrame.sunMarsVector.graphics.clear();
            showSunMarsVector = false;
            checkSunMarsVector.checked = false;
            
            heliocentricFrame.earthMarsVector.graphics.clear();
            geocentricFrame.earthMarsVector.graphics.clear();
            showEarthMarsVector = false;
            checkEarthMarsVector.checked = false;
            
            showMarsTrajectory = false;
            checkMarsTrajectory.checked = false;
            heliocentricFrame.marsTrajectory.graphics.clear();
            geocentricFrame.marsTrajectory.graphics.clear();
        }
        if (paused) {
            update();
        }
    }
);








const scale = 0.45e-6;
const sunEarthDistance = 150e6 * scale;
const sunMarsDistance = 228e6 * scale;

let xEarth = sunEarthDistance;
let yEarth = 0;
let xEarthList = [];
let yEarthList = [];

let xMars = sunMarsDistance;
let yMars = 0;
let xMarsList = [];
let yMarsList = [];




function update() {
    /*
        Met à jour le canevas graphique.
    */
    
    // place les astres à leur position
    geocentricFrame.moveSun(-xEarth, -yEarth);
    heliocentricFrame.moveEarth(xEarth, yEarth);
    heliocentricFrame.moveMars(xMars, yMars);
    geocentricFrame.moveMars(xMars-xEarth, yMars-yEarth);

    // trace les vecteurs
    if (showSunEarthVector) {
        heliocentricFrame.drawSunEarthVector();
        geocentricFrame.drawSunEarthVector();
    }    
    if (showSunMarsVector) {
        heliocentricFrame.drawSunMarsVector();
        geocentricFrame.drawSunMarsVector();
    }    
    if (showEarthMarsVector) {
        heliocentricFrame.drawEarthMarsVector();
        geocentricFrame.drawEarthMarsVector();
    }
    
    // trace les trajectoires
    if (showSunTrajectory) {
        geocentricFrame.drawSunTrajectory(
            xEarthList.map((x) => -x),
            yEarthList.map((y) => -y)
        );
    }
    if (showEarthTrajectory) {
        heliocentricFrame.drawEarthTrajectory(xEarthList, yEarthList);
    }
    if (showMarsTrajectory) {
        heliocentricFrame.drawMarsTrajectory(xMarsList, yMarsList);
        geocentricFrame.drawMarsTrajectory(
            xMarsList.map((x, index) => x - xEarthList[index]),
            yMarsList.map((y, index) => y - yEarthList[index])
        );
    }
}

function computePositions(time) {
    /*
        Calcule les positions des astres.
    */
    let earthAngle = 2 * Math.PI / 365 * time;
    xEarth = sunEarthDistance * Math.cos(earthAngle);
    yEarth = sunEarthDistance * Math.sin(earthAngle);
    
    let marsAngle = 2 * Math.PI / 687 * time;
    xMars = sunMarsDistance * Math.cos(marsAngle);
    yMars = sunMarsDistance * Math.sin(marsAngle);
    
    // pas plus de 1000 positions enregistrées
    if (time > 1000) {
        xEarthList.shift();
        yEarthList.shift();
        xMarsList.shift();
        yMarsList.shift();
    }
    xEarthList.push(xEarth);
    yEarthList.push(yEarth);
    xMarsList.push(xMars);
    yMarsList.push(yMars);
}


const menu = document.querySelector("#menu");
const menuRect = menu.getBoundingClientRect();
const button = document.querySelector("#button");
button.style.width = (menuRect.right-menuRect.left-60) + "px";
button.style.left = (menuRect.left+20) + "px";


document.querySelector("#button").addEventListener(
    "click", function() {
        if (!paused) {
            this.innerHTML = "Relancer";
        } else {
            this.innerHTML = "Mettre en pause";
        }
        paused = !paused;
    }
);

function movePlanets() {
    /*
        Anime le mouvement des planètes.
    */
    let time = 0;
    const deltaTime = 10;

    clearInterval(interval);
    interval = setInterval(animate, deltaTime);

    function animate() {
        if (!paused) {
            time += deltaTime / 10;
            computePositions(time);
            update();
        }
    }
}

update();
let interval = null;
movePlanets();