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
electronsNumberTitle = new createjs.Text("Nombre d'électrons", "bold 28px Quicksand", "#C00");
electronsNumberContainer.addChild(electronsNumberTitle);
electronsNumberTitle.x = 0;
electronsNumberTitle.y = 30;

// Texte
electronsNumberText = new createjs.Text(electronsNumber, "bold 50px Quicksand", "#C00");
electronsNumberContainer.addChild(electronsNumberText);
electronsNumberText.textAlign = "right";
electronsNumberText.x = 350;
electronsNumberText.y = 20;

function displayElectronsNumber() {
    /*
        Cette fonction met à jour l'affichage du nombre d'électrons.
    */
    electronsNumberText.text = electronsNumber;
}



// ===== Augmentation du nombre d'électrons =====

increaseButton = new createjs.Shape();
electronsNumberContainer.addChild(increaseButton);
increaseButton.x = 400;
increaseButton.y = 20;
increaseButton.graphics.setStrokeStyle(7, 'round').s('#cc0000');
increaseButton.graphics.mt(0, -15).lt(0, 15);
increaseButton.graphics.mt(-15, 0).lt(15, 0);
increaseButton.shadow = new createjs.Shadow("#000000", 2, 2, 8);
increaseButton.cursor = "pointer";

increaseLegend = new createjs.Text("Augmenter", "bold 14px Quicksand", "#cc0000");
electronsNumberContainer.addChild(increaseLegend);
increaseLegend.x = 440;
increaseLegend.y = 15;

increaseButton.on("mousedown", function (event) {
    this.x = this.x + 1;
    this.y = this.y + 2;
    this.shadow.offsetY -= 2;
    stage.update();
})

increaseButton.on("pressup", function(event) {
    this.x = this.x - 1;
    this.y = this.y - 2;
    this.shadow.offsetY += 2;
    stage.update();
})

increaseButton.on("click", function(event) {
    electronsNumber = Math.min(18, electronsNumber + 1);
    displayElectronsNumber();
    affiche_texte_config();
    displayElectrons();
})



// ===== Diminution du nombre d'électrons =====

decreaseButton = new createjs.Shape();
electronsNumberContainer.addChild(decreaseButton);
decreaseButton.x = 400;
decreaseButton.y = 70;
decreaseButton.graphics.setStrokeStyle(7, 'round').s('#cc0000');
decreaseButton.graphics.mt(-15, 0).lt(15, 0);
decreaseButton.shadow = new createjs.Shadow("#000000", 2, 2, 8);
decreaseButton.cursor = "pointer";

decreaseLegend = new createjs.Text("Diminuer", "bold 14px Quicksand", "#cc0000");
electronsNumberContainer.addChild(decreaseLegend);
decreaseLegend.x = 440;
decreaseLegend.y = 65;

decreaseButton.on("mousedown", function(event) {
    this.y = this.y + 3;
    this.shadow.offsetY -= 2;
    stage.update();
})

decreaseButton.on("pressup", function(event) {
    this.y = this.y - 3;
    this.shadow.offsetY += 2;
    electronsNumber = Math.max(0, electronsNumber - 1);
    displayElectronsNumber();
    affiche_texte_config();
    displayElectrons();
    stage.update();
})

decreaseButton.on("click", function(event) {

})





//======================================
//      Représentation de l'atome
//======================================
    
const atomContainer = new createjs.Container();
stage.addChild(atomContainer);
atomContainer.x = 850;
atomContainer.y = 260;



// ===== Noyau =====

nucleus = new createjs.Shape();
atomContainer.addChild(nucleus);
nucleus.graphics.beginRadialGradientFill(['#a0a0a0', '#303030'], [0, 1], 0, 0, 0, 0, 0, 40);
nucleus.graphics.drawCircle(0, 0, 40);

nucleusText = new createjs.Text("Noyau", "bold 20px Quicksand", 'white');
atomContainer.addChild(nucleusText);
nucleusText.textAlign = "center";
nucleusText.x = 0;
nucleusText.y = -10;




// ===== Sous-couches électroniques =====

subshells = [
    {nom: '1s', contenance: 2, rayon: 60, couleur: 'red'},
    {nom: '2s', contenance: 2, rayon: 120, couleur: 'blue'},
    {nom: '2p', contenance: 6, rayon: 150, couleur: 'blue'},
    {nom: '3s', contenance: 2, rayon: 220, couleur: 'green'},
    {nom: '3p', contenance: 6, rayon: 250, couleur: 'green'},
]

for (subshell of subshells) {
    let color = subshell['couleur'];
    let radius = subshell['rayon'];

    let subshellShape = new createjs.Shape();
    subshellShape.graphics.beginStroke(color);
    subshellShape.graphics.drawCircle(0, 0, radius);
    subshellShape.graphics.endStroke();
    // subshellShape.graphics.beginRadialGradientFill(['white', 'yellow'], [0, 1], 0, 0, radius-20, 0, 0, radius+50);
    // subshellShape.graphics.drawCircle(0, 0, radius);
    // subshellShape.graphics.beginRadialGradientFill(['yellow', 'white'], [0, 1], 0, 0, radius-50, 0, 0, radius+20);
    // subshellShape.graphics.drawCircle(0, 0, radius);
    atomContainer.addChild(subshellShape);

    textesubshell = new createjs.Text(subshell['nom'], "bold 20px Quicksand", color);
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

electronsContainer = new createjs.Container();
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

container_config_electronique = new createjs.Container();
stage.addChild(container_config_electronique);
container_config_electronique.x = 80;
container_config_electronique.y = 100;

// Titre "Configuration électronique"
titre_config_electronique = new createjs.Text("Configuration électronique :", "bold 28px Quicksand", "#00F");
container_config_electronique.addChild(titre_config_electronique);
titre_config_electronique.x = 0;
titre_config_electronique.y = 25;

// Texte
texte_config_electronique = new createjs.Text("", "bold 50px Quicksand", "#00F");
container_config_electronique.addChild(texte_config_electronique);
texte_config_electronique.textAlign = "left";
texte_config_electronique.x = 0;
texte_config_electronique.y = 80;

function affiche_texte_config() {
    exposants = ['¹', '²', '³', '⁴', '⁵', '⁶'];
    texte = "";
    reste = electronsNumber;
    subshell = 0;
    while (reste > 0) {
        nom = subshells[subshell]['nom'];
        contenance = subshells[subshell]['contenance'];
        if (reste > contenance) {
            texte = texte + nom + exposants[contenance-1];
            reste = reste - contenance;
        } else {
            texte = texte + nom + exposants[reste-1];
            reste = 0;
        }
        texte = texte + " ";
        subshell++;
    }
    texte_config_electronique.text = texte;
}



    
//==================
// Initialisation
//==================

stage.update();