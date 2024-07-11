/*
    ---------------------------------
    |    Appareil photographique    |
    ---------------------------------

    Ce script simule le fonctionnement d'un appareil photographique.
    Un objet lumineux est représenté et peut être déplacé. Les rayons
    marginaux passant par le diaphragme sont représentés jusqu'à leur
    incidence sur le capteur.
    L'objectif peut être déplacé pour faire la mise au point. Une mise
    au point automatique est également possible.
    L'ouverture du diaphragme peut être modifiée.
    La profondeur de champ peut être représentée.
*/


// ===== Initialisation des paramètres =====

let interval = null;

// paramètres de l'objectif
const f = 100;          // distance focale de l'objectif
const d = 20;           // distance lentille-diaphragme
let aperture = 1.8;     // ouverture
let R = f/(2*aperture); // ouverture du diaphgrame
const e = 4;            // rayon max de netteté

// position des éléments (origine des abscisses : capteur)
let xObj = -410;    // position de l'objet
let xImg = 0;       // position de l'image
let xLens = (xObj + Math.sqrt(xObj**2 + 4*f*xObj))/2;   // position de la lentille

// éléments indiquant les distances
const objDistance = document.getElementById("obj");
const imgDistance = document.getElementById("img");
const distance = document.getElementById("dist");
objDistance.innerText = xObj.toLocaleString('fr-FR', {maximumFractionDigits: 0});
imgDistance.innerText = (xImg - xLens).toLocaleString('fr-FR', {maximumFractionDigits: 0});
distance.innerText = -xLens.toLocaleString('fr-FR', {maximumFractionDigits: 0});

// affichage d'un logo indiquant si la mise au point est réalisée
const correctImg = document.getElementById("correct");
const wrongImg = document.getElementById("wrong");
const imgRect = document.getElementById("imgP").getBoundingClientRect();
const distRect = document.getElementById("distP").getBoundingClientRect();
const formulaRect = document.getElementById("formula").getBoundingClientRect();
correctImg.style.top = distRect.top-25 + "px";
correctImg.style.right = formulaRect.right-50 + "px";
wrongImg.style.top = distRect.top-25 + "px";
wrongImg.style.right = formulaRect.right-50 + "px";

// paramètres d'affichage
let construction = false;   // afficher les rayons de construction
let showField = false;      // affichage du champ
let autofocus = false;      // mise au point en direct

// canvas graphique
const canvas = document.getElementById("canvas");
canvas.width = 0.95 * window.screen.width;
canvas.height = 0.5 * window.screen.height;

// stage
const stage = new createjs.Stage(canvas);
stage.enableMouseOver();
createjs.Touch.enable(stage);
stage.mouseMoveOutside = true;

// conteneur graphique
const container = new createjs.Container();
stage.addChild(container);
container.x = 1100;
container.y = 200;





//==============================
//           Boîtier
//==============================

// ===== Axe optique =====

const opticalAxis = new createjs.Shape();
container.addChild(opticalAxis);

opticalAxis.graphics.ss(1, 1, 1).s('black');
opticalAxis.graphics.mt(-1100, 0).lt(0, 0);



// ===== Capteur =====

const sensor = new createjs.Shape();
container.addChild(sensor);

sensor.graphics.ss(1, 1, 1).s('black');
sensor.graphics.mt(0, -120).lt(0, 120);

const sensorText = new createjs.Text("C", "16px Quicksand", 'black');
container.addChild(sensorText);
sensorText.x = 10;
sensorText.y = 0;
sensorText.textAlign = 'center';
sensorText.textBaseline = 'middle';



// ===== Boîtier =====

const camera = new createjs.Shape();
container.addChild(camera);

camera.graphics.ss(2, 1, 1).s('black');
camera.graphics.mt(-120, 130).lt(-120, 150).lt(100, 150);
camera.graphics.mt(-120, -130).lt(-120, -150).lt(-40, -150);
camera.graphics.lt(-40, -200).lt(100, -200).lt(100, 150);



// ===== Objectif =====

const objective = new createjs.Shape();
container.addChild(objective);
objective.x = xLens;
objective.cursor = 'pointer';

const opticalCenter = new createjs.Text("O", "16px Quicksand", 'black');
container.addChild(opticalCenter);
opticalCenter.x = xLens - 10;
opticalCenter.y = -10;
opticalCenter.textAlign = 'center';
opticalCenter.textBaseline = 'middle';

function drawObjective() {
    // lentille
    objective.graphics.clear();
    objective.graphics.ss(2, 1, 1).s('black');
    objective.graphics.mt(0, -130);
    objective.graphics.lt(0, 130);
    objective.graphics.mt(-10, -120).lt(0, -130).lt(10, -120);
    objective.graphics.mt(-10, 120).lt(0, 130).lt(10, 120);
    
    // foyer image
    objective.graphics.mt(f, 5).lt(f,-5);
    
    // foyer objet
    objective.graphics.mt(-f, 5).lt(-f, -5);
    
    // diaphragme
    objective.graphics.mt(d, -R).lt(d, -130);
    objective.graphics.mt(d, R).lt(d, 130);
    
    // support
    objective.graphics.mt(-20, -130).lt(80, -130);
    objective.graphics.mt(-20, 130).lt(80, 130);
    
    stage.update();
}



// ===== Ouverture du diaphragme =====

// liste des ouvertures
const apertures = [1., 1.4, 1.8, 2, 2.8, 4, 5.6, 8];
apertureIndex = 2;

// valeur de l'ouverture sélectionnée
const apertureText = new createjs.Text("f/" + apertures[apertureIndex], "16px Quicksand", 'black');
container.addChild(apertureText);
apertureText.x = 30;
apertureText.y = -175;
apertureText.textBaseline = 'middle';
apertureText.textAlign = 'center';

// flèche pour augmente l'ouverture
const increaseApertureArrow = new createjs.Shape();
container.addChild(increaseApertureArrow);
increaseApertureArrow.cursor = 'pointer';
increaseApertureArrow.x = 0;
increaseApertureArrow.y = -175;

increaseApertureArrow.graphics.ss(2, 1, 1).f('black');
increaseApertureArrow.graphics.mt(0, 7).lt(-10, 0).lt(0, -7).lt(0, 7);

increaseApertureArrow.addEventListener("mousedown", increaseAperture);

function increaseAperture() {
    /*
        Réduit l'ouverture du diaphragme.
    */
    if (apertureIndex > 0) {
        apertureIndex--;
        updateAperture();
    }
}

// flèche pour diminuer l'ouverture
const decreaseApertureArrow = new createjs.Shape();
container.addChild(decreaseApertureArrow);
decreaseApertureArrow.cursor = 'pointer';
decreaseApertureArrow.x = 60;
decreaseApertureArrow.y = -175;

decreaseApertureArrow.graphics.ss(2, 1, 1).f('black');
decreaseApertureArrow.graphics.mt(0, 7).lt(10, 0).lt(0, -7).lt(0, 7);

decreaseApertureArrow.addEventListener("mousedown", decreaseAperture);

function decreaseAperture() {
    if (apertureIndex < apertures.length-1) {
        apertureIndex++;
        updateAperture();
    }
}

function updateAperture() {
    /*
        Met à jour l'ouverture du diaphragme.
    */
    aperture = apertures[apertureIndex]
    apertureText.text = "f/" + aperture;
    R = f/(2*aperture);
    
    drawObjective();
    drawRays();
    drawDepthOfField();
    // drawIntensity();
    
    stage.update();
}




//==============================
//            Objet
//==============================

// ===== Objet lumineux =====

// objet lumineux
const object = new createjs.Shape();
container.addChild(object);
object.cursor = 'pointer';
object.x = xObj;

// légende "A" de l'objet lumineux
const A = new createjs.Text("A", "16px Quicksand", 'red');
container.addChild(A);
A.x = xObj - 10;
A.y = -10;
A.textAlign = 'center';
A.textBaseline = 'middle';

function drawObject() {
    /*
        Trace l'object lumineux.
    */
    object.graphics.clear();
    object.graphics.ss(2, 1, 1).s('red');
    object.graphics.mt(0, -30).lt(0, 30);
}



// ===== Rayons lumineux =====

const rays = new createjs.Shape();
container.addChild(rays);

function drawRays() {
    /*
        Trace les rayons marginaux issus de l'objet.
    */
    rays.graphics.clear();
    rays.graphics.ss(2, 1, 1).s('red');
    
    let H = Math.abs(xImg - xLens)/(Math.abs(xImg-xLens)-d) * R;
    rays.graphics.mt(xObj, 0).lt(xLens, H);
    rays.graphics.mt(xObj, 0).lt(xLens, -H);
    
    let h = Math.abs(xImg) / Math.abs(xImg - xLens) * H;
    if (xImg > 0) {
        rays.graphics.mt(xLens, H).lt(0, h);
        rays.graphics.mt(xLens, -H).lt(0, -h);
    } else {
        rays.graphics.mt(xLens, H).lt(0, -h);
        rays.graphics.mt(xLens, -H).lt(0, h);
    }
}



// ===== Rayons de construction =====

const constructionRays = new createjs.Shape();

function drawConstructionRays() {
    constructionRays.graphics.clear();
    constructionRays.graphics.setStrokeDash([7, 6]).s('purple');

    constructionRays.graphics.mt(xObj, -30).lt(xLens, -30).lt(0, -30 * (xLens + f)/f);
    constructionRays.graphics.mt(xObj, -30).lt(0, 30 * xLens / (xObj-xLens));
    constructionRays.graphics.mt(xObj, -30).lt(xLens, 30 * f / (xLens-xObj-f)).lt(0, 30 * f / (xLens-xObj-f));
    
    if (xImg < 0) {
        constructionRays.graphics.s('gray');
        constructionRays.graphics.mt(xImg, -50).lt(xImg, 50);
    }
}





//==============================
//     Profondeur de champ
//==============================

/*
    On calcule les positions des images telles que le rayon du
    faisceau lumineux arrivant sur le capteur vaille e. Ce sont
    les abscisses xImg1 et xImg2.
    On calcule les abscisses xObj1 et xObj2 des objets correspondant.
    Les ordonnées h1 et h2 sont les rayons des faisceaux sur la lentille.
*/

// ===== Limite 1 =====

let xImg1 = - (xLens + d) * e / (R - e);
let xObj1 = xLens + f * (xImg1 - xLens) / (f + xLens - xImg1);
let h1 = (xLens - xImg1) / xImg1 * e;

const A1 = new createjs.Shape();

function computeXImg1() {
    /*
        Calcule la position de l'image située après la lentille.
    */
    xImg1 = - (xLens + d) * e / (R - e);
}

function computeXObj1() {
    /*
        Calcule la position de l'objet associé à l'image 1.
    */
    xObj1 = xLens + f * (xImg1 - xLens) / (f + xLens - xImg1);
}

function drawA1() {
    /*
        Trace les rayons marginaux produisant l'image 1.
    */
    A1.graphics.clear();
    A1.graphics.ss(1, 1, 1).s('blue');

    // rayons
    let h = (xLens - xImg1) / xImg1 * e;
    A1.graphics.mt(xObj1, 0).lt(xLens, h).lt(0, -e);
    A1.graphics.mt(xObj1, 0).lt(xLens, -h).lt(0, e);
}



// ===== Limite 2 =====

let xImg2 = (xLens + d) * e / (R + e);
let xObj2 = xLens + f * (xImg2 - xLens) / (f + xLens - xImg2);

const A2 = new createjs.Shape();

function computeXImg2() {
    /*
        Calcule la position de l'image située avant la lentille.
    */
    xImg2 = (xLens + d) * e / (R + e);
    if (xImg2 <= xLens + f) {
        /*
            L'image ne peut se trouver entre la lentille et son foyer image :
            au plus, si l'objet est à l'infini, elle se trouve au foyer
            image.
        */
        xImg2 = xLens + f;
    }
}

function computeXObj2() {
    /*
        Calcule la position de l'objet associé à l'image 2.
    */
    if (xImg2 <= xLens + f) {
        xObj2 = -2000;
    } else {
        xObj2 = xLens + f * (xImg2 - xLens) / (f + xLens - xImg2);
    }
}

function drawA2() {
    /*
        Trace les rayons marginaux produisant l'image 2.
    */
    A2.graphics.clear();
    A2.graphics.ss(1, 1, 1).s('green');

    // rayons
    if (xImg2 == xLens + f) {
        /*
            Si l'image se trouve au foyer image de la lentille,
            l'objet est à l'infini.
        */
        let H = f / (f-d) * R;
        let h = Math.abs(xImg2)/f * H;
        A2.graphics.mt(-1200, H).lt(xLens, H).lt(0, -h);
        A2.graphics.mt(-1200, -H).lt(xLens, -H).lt(0, h);
    } else {
        let H = (xLens - xImg2) / xImg2 * e;
        A2.graphics.mt(xObj2, 0).lt(xLens, H).lt(0, -e);
        A2.graphics.mt(xObj2, 0).lt(xLens, -H).lt(0, e);
    }
}



// ===== Profondeur de champ =====

const field = new createjs.Shape();

const fieldText = new createjs.Text("champ", "16px Quicksand", 'rgba(0, 100, 255, 0.5)');
// container.addChild(fieldText);
fieldText.y = -160;
fieldText.textAlign = 'center';
fieldText.textBaseline = 'middle';

function drawDepthOfField() {
    /*
        Représente le champ de l'appareil photo.
    */
    computeXImg1();
    computeXObj1();
    drawA1();
    
    computeXImg2();
    computeXObj2();
    drawA2();
    
    field.graphics.clear();
    field.graphics.f('rgba(0, 100, 255, 0.08)');
    field.graphics.drawRect(xObj1, -130, xObj2-xObj1, 260);
    field.graphics.ef().ss(2, 1, 1).s('rgba(0, 100, 255, 0.5)');
    field.graphics.mt(xObj1, -145).lt(xObj2, -145);
    field.graphics.mt(xObj1-5, -140).lt(xObj1, -145).lt(xObj1-5, -150);
    field.graphics.mt(xObj2+5, -140).lt(xObj2, -145).lt(xObj2+5, -150);
    
    fieldText.x = (xObj1 + xObj2)/2;
    
    stage.update();
}





//==============================
//   Déplacement des éléments
//==============================

function computeXImg() {
    /*
        Calcule la position de l'image par rapport au capteur.
    */
    xImg = xLens + 1/(1/(xObj - xLens) + 1/f);
    if (Math.abs(xImg) < 1) {
        correctImg.style.visibility = 'visible';
        wrongImg.style.visibility = 'hidden';
    } else {
        correctImg.style.visibility = 'hidden';
        wrongImg.style.visibility = 'visible';
    }
}

function computeXLens() {
    /*
        Calcule la position de la lentille pour faire la mise au point.
    */
    xLens = (xObj + Math.sqrt(xObj**2 + 4*f*xObj))/2;    
}

function computeXObj() {
    /*
        Calcule la position de l'objet sur lequel est faite la mise au point.
    */
    xObj = xLens + 1/(1/(xImg - xLens) - 1/f);
}

function updateRays() {
    /*
        Trace les rayons pour les positions de l'objet et de l'objectif
        choisies.
        Affiche les distances.
    */
    computeXImg();
    drawRays();
    drawConstructionRays();
    objDistance.innerText = xObj.toLocaleString('fr-FR', {maximumFractionDigits: 0});
    imgDistance.innerText = (xImg - xLens).toLocaleString('fr-FR', {maximumFractionDigits: 0});
    distance.innerText = -xLens.toLocaleString('fr-FR', {maximumFractionDigits: 0});
}



// ===== Déplacement manuel =====

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
            -730,
            event.stageX + target.offsetX
        ),
        -400
    );
    
    object.x = xObj;
    A.x = xObj - 10;
    
    if (autofocus) {
        computeXLens();
        objective.x = xLens;
        opticalCenter.x = xLens - 10;
        drawDepthOfField();
    }
    
    updateRays();
    // drawIntensity();
    stage.update();
}

function pressMoveObjective(event) {
    /*
        Déplace l'objectif.
    */
    target = event.currentTarget;
    xLens = Math.min(
        Math.max(
            -2*f,
            event.stageX + target.offsetX
        ),
        -120
    );
    objective.x = xLens;
    opticalCenter.x = xLens - 10;
    
    if (autofocus) {
        computeXObj();
        object.x = xObj;
        A.x = xObj - 10;
    }
    
    updateRays();
    drawDepthOfField();
    // drawIntensity();
    stage.update();
}

object.addEventListener("mousedown", onMouseDown);
object.addEventListener("pressmove", pressMoveObject);
objective.addEventListener("mousedown", onMouseDown);
objective.addEventListener("pressmove", pressMoveObjective);



// ===== Mise au point automatique =====

const autofocusButton = document.getElementById("autofocus-button");
autofocusButton.addEventListener("mousedown", doAutoFocus);

function doAutoFocus() {
    /*
        Réalise une mise au point automatique.
    */
    const deltaTime = 10;
    
    increaseApertureArrow.cursor = 'default';
    decreaseApertureArrow.cursor = 'default';
    object.cursor = 'default';
    objective.cursor = 'default';
    increaseApertureArrow.removeEventListener("mousedown", increaseAperture);
    decreaseApertureArrow.removeEventListener("mousedown", decreaseAperture);
    object.removeEventListener("mousedown", onMouseDown);
    object.removeEventListener("pressmove", pressMoveObject);
    objective.removeEventListener("mousedown", onMouseDown);
    objective.removeEventListener("pressmove", pressMoveObjective);

    clearInterval(interval);
    interval = setInterval(animate, deltaTime);

    function animate() {
        if (xImg > 0) {
            xLens -= 0.2;
        } else {
            xLens += 0.2;
        }
        
        objective.x = xLens;
        opticalCenter.x = xLens - 10;
        updateRays();
        drawDepthOfField();
        stage.update();
        
        // arrêt de l'animation        
        if (Math.abs(xImg) < 0.1) {
            clearInterval(interval);
            
            increaseApertureArrow.cursor = 'pointer';
            decreaseApertureArrow.cursor = 'pointer';
            object.cursor = 'pointer';
            objective.cursor = 'pointer';
            increaseApertureArrow.addEventListener("mousedown", increaseAperture);
            decreaseApertureArrow.addEventListener("mousedown", decreaseAperture);
            object.addEventListener("mousedown", onMouseDown);
            object.addEventListener("pressmove", pressMoveObject);
            objective.addEventListener("mousedown", onMouseDown);
            objective.addEventListener("pressmove", pressMoveObjective);
        }
    }
}





//==============================
//          Paramètres
//==============================

// ===== Rayons de construction =====

const constructionCheckbox = document.getElementById("construction-cbx");
constructionCheckbox.checked = false;

constructionCheckbox.addEventListener("change", function() {
    construction = !construction;
    
    if (construction) {
        container.addChild(constructionRays);
    } else {
        container.removeChild(constructionRays);
    }
    
    stage.update();
});



// ===== Profondeur de champ =====

const fieldCheckbox = document.getElementById("field-cbx");
fieldCheckbox.checked = false;

fieldCheckbox.addEventListener("change", function() {
    showField = !showField;
    
    if (showField) {
        container.addChild(field);
        container.addChild(fieldText);
        container.addChild(A1);
        container.addChild(A2);
    } else {
        container.removeChild(field);
        container.removeChild(fieldText);
        container.removeChild(A1);
        container.removeChild(A2);
    }
    
    stage.update();
})



// ===== Mise au point automatique =====

const autofocusCheckbox = document.getElementById("autofocus-cbx");
autofocusCheckbox.checked = false;

autofocusCheckbox.addEventListener("change", function() {
    autofocus = !autofocus;
    
    if (autofocus) {
        doAutoFocus();
    }
});





//==============================
//        Initialisation
//==============================

drawObjective();
drawObject();
updateRays();
drawDepthOfField();
stage.update();