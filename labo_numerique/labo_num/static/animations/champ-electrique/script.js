/*
    --------------------------------
    |       Champ électrique       |
    --------------------------------

    Ce script simule le champ électrique produit par des charges
    ponctuelles, positives ou négatives. Il est possible d'ajouter
    jusqu'à dix charges ponctuelles.
    L'utilisateur peut placer une charge test pour voir l'effet du
    champ sur celle-ci.
*/





//==============================
//            Menu
//==============================


// ==== Affichage du champ électrique ====

const displayFieldCheckbox = document.querySelector("#display_field");
displayFieldCheckbox.checked = false;
displayFieldCheckbox.addEventListener(
    "change", function() {
        if (this.checked) {
            drawElectricFieldGrid();
        } else {
            for (vector of vectors) {
                vector.graphics.clear();
            }
            stage.update();
        }
    }
);



// ==== Création/suppression des charges positives ====

let positiveCanvas = document.querySelector("#positive_charge");
let positiveStage = new createjs.Stage(positiveCanvas);
positiveStage.enableMouseOver();

let positiveCharge = new createjs.Shape();
positiveCharge.graphics.ss(3, 1, 1).f('red');
positiveCharge.graphics.dc(10, 10, 10);
positiveCharge.graphics.s('white');
positiveCharge.graphics.mt(5, 10).lt(15, 10);
positiveCharge.graphics.mt(10, 5).lt(10, 15);
positiveStage.addChild(positiveCharge);
positiveStage.update();



// ==== Création/suppression des charges négatives ====

let negativeCanvas = document.querySelector("#negative_charge");
let negativeStage = new createjs.Stage(negativeCanvas);
negativeStage.enableMouseOver();

let negativeCharge = new createjs.Shape();
negativeCharge.graphics.ss(3, 1, 1).f('blue');
negativeCharge.graphics.dc(10, 10, 10);
negativeCharge.graphics.s('white');
negativeCharge.graphics.mt(5, 10).lt(15, 10);
negativeStage.addChild(negativeCharge);
negativeStage.update();





//==============================
//       Canvas graphique
//==============================

let canvas = document.querySelector("#canvas");
let stage = new createjs.Stage(canvas);
stage.enableMouseOver();
createjs.Touch.enable(stage);
stage.mouseMoveOutside = true;
stage.cursor = 'pointer';

let canvasRect = canvas.getBoundingClientRect();
const xMax = canvasRect.width;
const yMax = canvasRect.height;

let stageBkg = new createjs.Shape();
stage.addChild(stageBkg);
stageBkg.graphics.f('#ddd');
stageBkg.graphics.drawRect(0, 0, xMax, yMax);





//==============================
//       Charges sources
//==============================

// liste contenant les charges sources
let sources = [];

class PointCharge {
    /*
        Classe définissant une charge ponctuelle source.
        Attributs :
            - shape : l'élément Shape représentant la charge ;
            - charge : 1 ou -1.
    */
    constructor(positive=true) {
        /*
            Constructeur de la charge ponctuelle.
            Argument :
                - positive : booléean indiquant si la charge est positive
                (true) ou négative (false).
        */
        this.shape = new createjs.Shape();
        stage.addChild(this.shape);
        this.shape.x = xMax/2;
        this.shape.y = yMax/2;
        
        this.shape.graphics.ss(3, 1, 1);
        if (positive) {
            this.shape.graphics.f('red');
        } else {
            this.shape.graphics.f('blue');
        }
        this.shape.graphics.dc(0, 0, 10);
        this.shape.graphics.s('white');
        this.shape.graphics.mt(-5, 0).lt(5, 0);
        if (positive) {
            this.shape.graphics.mt(0, -5).lt(0, 5);
        }
        
        this.shape.cursor = 'grab';
        
        this.shape.addEventListener("mousedown", this.onMouseDown);
        this.shape.addEventListener("pressmove", this.onPressMove);
        
        this.charge = positive?1:-1;
        
        sources.push(this);
    }
    
    computeField(x, y) {
        /*
            Retourne les coordonnées du champ électrique produit en un
            point (x, y) par la charge ponctuelle.
        */
        let angle = computeAngle(x-this.shape.x, y-this.shape.y);
        let rSquare = (x-this.shape.x)**2 + (y-this.shape.y)**2;
        let Ex = this.charge/rSquare * Math.cos(angle);
        let Ey = this.charge/rSquare * Math.sin(angle);
        return [1e5 * Ex, 1e5 * Ey];
    }
    
    onMouseDown(event) {
        /*
            Lors d'un clic sur un bouton, enregistre l'offset entre
            la position du clic et du bouton.
        */
        let object = event.currentTarget;
        object.offsetX = object.x - event.stageX;
        object.offsetY = object.y - event.stageY;
    }

    onPressMove(event) {
        /*
            Action lors du déplacement d'un curseur.
        */
        let object = event.currentTarget;
        let container = object.parent;
        object.x = Math.min(Math.max(10, event.stageX + object.offsetX), xMax-10);
        object.y = Math.min(Math.max(10, event.stageY + object.offsetY), yMax-10);
    
        update();
    }
}



// ==== Création/suppression des charges ====

function createCharge(positive=true) {
    /*
        Crée une nouvelle charge du signe indiqué.
        Argument :
            - positive : booléen indiquant si la charge à créer est
            positive (true) ou négative (false).
    */
    if (sources.length >= 10) {
        return;
    }
    let charge = new PointCharge(positive);
    let xList = [];
    let yList = [];
    for (source of sources) {
        xList.push(source.shape.x);
        yList.push(source.shape.y);
    }
    
    let x = 0, y = 0;
    
    function sortXY() {
        /*
            Tire au sort les coordonnées de la charge ponctuelle.
        */
        x = Math.random() * (xMax - 50) + 25;
        y = Math.random() * (yMax - 50) + 25;
        
        for (source of sources) {
            // nouveau tirage au sort si la charge se trouve au même
            // endroit qu'une charge existante.
            if (computeDistance(x, y, source.shape.x, source.shape.y) < 10) {
                sortXY();
                break;
            }
        }
    }
    
    sortXY();        
    charge.shape.x = x;
    charge.shape.y = y;
    update();
}

function deleteCharge(positive) {
    /*
        Supprime la dernière charge créée du signe indiqué
        Argument :
            - positive : booléen indiquant si la charge à supprimer est
            positive (true) ou négative (false).
    */
    for (let i = sources.length-1; i >= 0; i--) {
        let source = sources[i];
        if ((positive && source.charge > 0) || (!positive && source.charge < 0)) {
            stage.removeChild(source.shape);
            sources.splice(i, 1);
            update();
            return;
        }
    }
}


// écouteurs pour les charges positives
document.querySelector("#add_positive").addEventListener(
    "click", createCharge
);
document.querySelector("#delete_positive").addEventListener(
    "click", deleteCharge
);

// écouteurs pour les charges négatives
document.querySelector("#add_negative").addEventListener(
    "click", createCharge.bind(null, false)
);
document.querySelector("#delete_negative").addEventListener(
    "click", deleteCharge.bind(null, false)
);





//==============================
//       Champ électrique
//==============================

// vecteurs représentant le champ
let vectors = [];
for (let x = 25; x < xMax-25; x+=50) {
    for (let y = 25; y <= yMax-25; y+= 30) {
        let vector = new createjs.Shape();
        vector.graphics.clear();
        vector.graphics.ss(2, 1, 1);
        vector.x = x;
        vector.y = y;
        stage.addChild(vector);

        vectors.push(vector);
    }
}

function computeElectricField(x, y) {
    /*
        Retourne les coordonnées du champ électrique total au
        point de coordonnées (x, y).
    */
    let Ex = 0;
    let Ey = 0;
        
    for (source of sources) {
        let coordinates = source.computeField(x, y);
        Ex += coordinates[0];
        Ey += coordinates[1];
    }
    
    return [Ex, Ey];
}

function drawElectricFieldGrid() {
    /*
        Trace le champ électrique.
    */
    for (vector of vectors) {
        vector.graphics.clear();
        vector.graphics.ss(2, 1, 1);
    }
    
    if (sources.length == 0) {
        return;
    }
    
    const size = 10;
    let intensities = [];
    let angles = [];
    for (vector of vectors) {
        let coordinates = computeElectricField(vector.x, vector.y);
        intensities.push(Math.sqrt(coordinates[0]**2 + coordinates[1]**2));
        angles.push(computeAngle(coordinates[0], coordinates[1]));
    }
    
    let maxIntensity = Math.max(...intensities);
    for (let i = 0; i < vectors.length; i++) {
        let vector = vectors[i];
        
        let intensity = intensities[i];
        let angle = angles[i];
        drawVector(
            vector,
            -size * Math.cos(angle), -size * Math.sin(angle),
            size * Math.cos(angle), size * Math.sin(angle),
            'rgba(0, 150, 0, ' + Math.log(intensity)/Math.log(maxIntensity) + ')'
        );
        
    }
    stage.update();
}





//==============================
//         Charge test
//==============================

// Création de la charge test
let probe = new createjs.Shape();
probe.graphics.ss(3, 1, 1).f('red');
probe.graphics.dc(0, 0, 5);

function displayProbe(event) {
    /*
        Affiche la charge test et la met en mouvement.
    */
    for (source of sources) {
        // ne rien faire si le clic a lieu sur une charge source
        if (computeDistance(source.shape.x, source.shape.y, event.stageX, event.stageY) < 10) {
            return;
        }
    }
    stage.removeEventListener("click", displayProbe);
    
    let x = event.stageX;
    let y = event.stageY;
    probe.x = x;
    probe.y = y;
    stage.addChild(probe);
    stage.update();
    
    
    
    // ==== Animation de la charge test ====
    
    let interval = null;
    clearInterval(interval);
    
    let time = 0;
    let velocity = [0, 0];
    const deltaTime = 20;
    interval = setInterval(animate, deltaTime);
    
    function animate() {
        time += deltaTime;
        let field = computeElectricField(x, y);
        velocity[0] += 1e-4 * field[0] * deltaTime;
        velocity[1] += 1e-4 * field[1] * deltaTime;
        x += velocity[0] * deltaTime;
        y += velocity[1] * deltaTime;
        probe.x = x;
        probe.y = y;
        if (probe.x < -5 || probe.x > xMax+5 || probe.y < -5 || probe.y > yMax+5) {
            clearInterval(interval);
            stage.removeChild(probe);
            stage.addEventListener("click", displayProbe);
        }
        for (source of sources) {
            if ((probe.x - source.shape.x)**2 + (probe.y - source.shape.y)**2 < 25) {
                clearInterval(interval);
                stage.removeChild(probe);
                stage.addEventListener("click", displayProbe);
            }
        }
        stage.update();
    }
}

stage.addEventListener("click", displayProbe);





//==============================
//    Mise à jour du canvas
//==============================

function update() {
    /*
        Met à jour l'affichage du canvas.
    */
    if (displayFieldCheckbox.checked) {
        drawElectricFieldGrid();
    }
    stage.update();
}



// initialisation
let charge = new PointCharge();
charge.shape.x = xMax/3;
charge.shape.y = yMax/2;
update();