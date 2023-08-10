//==================
// Initialisation
//==================
const canvas = document.getElementById("canvas");
const stage = new createjs.Stage(canvas);
stage.enableMouseOver();

let electronsNumber = 0;



//======================================
//         Nombre d'électrons
//======================================

const electronsNumberContainer = new createjs.Container();
stage.addChild(electronsNumberContainer);
electronsNumberContainer.x = 80;
electronsNumberContainer.y = 20;



// ===== Affichage du nombre d'électrons =====

// Titre "Nombre d'électrons"
let electronsNumberTitle = new createjs.Text("Nombre d'électrons", "bold 28px Quicksand", "#C00");
electronsNumberContainer.addChild(electronsNumberTitle);
electronsNumberTitle.x = 0;
electronsNumberTitle.y = 30;

// Texte
let electronsNumberText = new createjs.Text(electronsNumber, "bold 50px Quicksand", "#C00");
electronsNumberContainer.addChild(electronsNumberText);
electronsNumberText.textAlign = "right";
electronsNumberText.x = 350;
electronsNumberText.y = 20;

function displayElectronsNumber() {
    /*
        Met à jour l'affichage du nombre d'électrons.
    */
    electronsNumberText.text = electronsNumber;
}



// ===== Augmentation du nombre d'électrons =====

let increaseButton = new createjs.Shape();
electronsNumberContainer.addChild(increaseButton);
increaseButton.x = 400;
increaseButton.y = 20;
increaseButton.graphics.setStrokeStyle(7, 'round').s('#cc0000');
increaseButton.graphics.mt(0, -15).lt(0, 15);
increaseButton.graphics.mt(-15, 0).lt(15, 0);
increaseButton.shadow = new createjs.Shadow("#000000", 2, 2, 8);
increaseButton.cursor = "pointer";

let increaseLegend = new createjs.Text("Augmenter", "bold 14px Quicksand", "#cc0000");
electronsNumberContainer.addChild(increaseLegend);
increaseLegend.x = 440;
increaseLegend.y = 15;

increaseButton.on("mousedown", function (event) {
    this.x = this.x + 1;
    this.y = this.y + 2;
    this.shadow.offsetY -= 2;
    stage.update();
});

increaseButton.on("pressup", function(event) {
    this.x = this.x - 1;
    this.y = this.y - 2;
    this.shadow.offsetY += 2;
    electronsNumber = Math.min(18, electronsNumber + 1);
    update();
});



// ===== Diminution du nombre d'électrons =====

let decreaseButton = new createjs.Shape();
electronsNumberContainer.addChild(decreaseButton);
decreaseButton.x = 400;
decreaseButton.y = 70;
decreaseButton.graphics.setStrokeStyle(7, 'round').s('#cc0000');
decreaseButton.graphics.mt(-15, 0).lt(15, 0);
decreaseButton.shadow = new createjs.Shadow("#000000", 2, 2, 8);
decreaseButton.cursor = "pointer";

let decreaseLegend = new createjs.Text("Diminuer", "bold 14px Quicksand", "#cc0000");
electronsNumberContainer.addChild(decreaseLegend);
decreaseLegend.x = 440;
decreaseLegend.y = 65;

decreaseButton.on("mousedown", function(event) {
    this.y = this.y + 3;
    this.shadow.offsetY -= 2;
    stage.update();
});

decreaseButton.on("pressup", function(event) {
    this.y = this.y - 3;
    this.shadow.offsetY += 2;
    electronsNumber = Math.max(0, electronsNumber - 1);
    update();
});



function update() {
    /*
        Met à jour le nombre d'électrons, le schéma
        et la configuration électronique.
    */
    displayElectronsNumber();
    displayConfiguration();
    displayElectrons();
    displayValenceShell();
    stage.update();
}





//======================================
//      Représentation de l'atome
//======================================
    
const atomContainer = new createjs.Container();
stage.addChild(atomContainer);
atomContainer.x = 880;
atomContainer.y = 260;



// ===== Noyau =====

let nucleus = new createjs.Shape();
atomContainer.addChild(nucleus);
nucleus.graphics.beginRadialGradientFill(['#a0a0a0', '#303030'], [0, 1], 0, 0, 0, 0, 0, 40);
nucleus.graphics.drawCircle(0, 0, 40);

let nucleusText = new createjs.Text("Noyau", "bold 20px Quicksand", 'white');
atomContainer.addChild(nucleusText);
nucleusText.textAlign = "center";
nucleusText.x = 0;
nucleusText.y = -10;




// ===== Sous-couches électroniques =====

subshells = [
    {name: '1s', capacity: 2, radius: 60, color: 'red'},
    {name: '2s', capacity: 2, radius: 120, color: 'blue'},
    {name: '2p', capacity: 6, radius: 150, color: 'blue'},
    {name: '3s', capacity: 2, radius: 220, color: 'green'},
    {name: '3p', capacity: 6, radius: 250, color: 'green'},
]

for (subshell of subshells) {
    let color = subshell['color'];
    let radius = subshell['radius'];

    let subshellShape = new createjs.Shape();
    subshellShape.graphics.beginStroke(color);
    subshellShape.graphics.drawCircle(0, 0, radius);
    subshellShape.graphics.endStroke();
    atomContainer.addChild(subshellShape);

    let textesubshell = new createjs.Text(subshell['name'], "bold 20px Quicksand", color);
    textesubshell.x = (radius + 15) * Math.cos(-Math.PI/4);
    textesubshell.y = (radius + 15) * Math.sin(-Math.PI/4);
    atomContainer.addChild(textesubshell);
}



// ===== Électrons =====

const electronsList = [
    // 1s
    ['red', 60, 0],
    ['red', 60, Math.PI],
    // 2s
    ['blue', 120, Math.PI/2],
    ['blue', 120, -Math.PI/2],
    // 2p
    ['blue', 150, 0],
    ['blue', 150, Math.PI],
    ['blue', 150, Math.PI/3],
    ['blue', 150, 4*Math.PI/3],
    ['blue', 150, 2*Math.PI/3],
    ['blue', 150, 5*Math.PI/3],
    // 3s
    ['green', 220, 0],
    ['green', 220, Math.PI],
    // 3p
    ['green', 250, Math.PI/6],
    ['green', 250, 7*Math.PI/6],
    ['green', 250, 3*Math.PI/6],
    ['green', 250, 9*Math.PI/6],
    ['green', 250, 5*Math.PI/6],
    ['green', 250, 11*Math.PI/6],
];

let electronsContainer = new createjs.Container();
atomContainer.addChild(electronsContainer);

function createElectron(color, radius, angle) {
    let electron = new createjs.Shape();
    electron.graphics.beginFill(color);
    electron.graphics.drawCircle(radius * Math.cos(angle), radius * Math.sin(angle), 10);
    electron.graphics.endFill();
    return electron;
}

const electronsShapesList = [];

for (electron of electronsList) {
    let electronShape = createElectron(electron[0], electron[1], electron[2]);
    electronsShapesList.push(electronShape);
}

function displayElectrons() {
    electronsContainer.removeAllChildren();
    let reste = electronsNumber;
    let i = 0;
    while (reste > 0) {
        electronsContainer.addChild(electronsShapesList[i]);
        reste = reste - 1;
        i++;
    }
}





//======================================
//     Configuration électronique
//======================================

let container_config_electronique = new createjs.Container();
stage.addChild(container_config_electronique);
container_config_electronique.x = 80;
container_config_electronique.y = 100;

// Texte
let texte_config_electronique = new createjs.Text("", "bold 50px Quicksand", "#00F");
container_config_electronique.addChild(texte_config_electronique);
texte_config_electronique.textAlign = "left";
texte_config_electronique.x = 0;
texte_config_electronique.y = 80;

const subshellSpans = document.querySelectorAll(".subshell");
const shellSpans = document.querySelectorAll(".shell");

let valenceShell = null;
const valenceDiv = document.querySelector("#valence");

function clearConfiguration() {
    /*
        Remet à zéro la configuration électronique.
    */
    for (span of subshellSpans) {
        span.innerHTML = "";
    }
    
    for (span of shellSpans) {
        span.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }
}

function displayConfiguration() {
    /*
        Affiche la configuration électronique correspondant au
        nombre d'électrons.
    */
    clearConfiguration();
    
    let remainder = electronsNumber;
    let i = 0;
    
    while (remainder > 0) {
        let text = "";
        subshellName = subshells[i]['name'];
        capacity = subshells[i]['capacity'];
        if (remainder > capacity) {
            text = subshellName + "<sup>" + capacity + "</sup>";
            remainder = remainder - capacity;
        } else {
            text = subshellName + "<sup>" + remainder + "</sup>";
            remainder = 0;
            valenceShell = subshellSpans[i].parentNode;
            valenceShell.style.backgroundColor = "#F0ECB0";
        }
        subshellSpans[i].innerHTML = text;
        i++;
    }
}

function displayValenceShell() {
    if (electronsNumber == 0) {
        valenceDiv.style.display = "none";
    } else {
        console.log(valenceShell);
        valenceDiv.style.color = window.getComputedStyle(valenceShell).getPropertyValue('color');
        valenceDiv.style.display = "block";
        valenceDiv.style.left = (
            valenceShell.getBoundingClientRect().left
            + 0.5*valenceShell.getBoundingClientRect().width
            - 0.5*valenceDiv.getBoundingClientRect().width
        ) + "px";
        valenceDiv.style.top = (valenceShell.getBoundingClientRect().top + 80) + "px";
    }
}



    
//==================
// Initialisation
//==================

stage.update();