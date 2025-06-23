/*
    --------------------------------
    |     Spectres infrarouge      |
    --------------------------------

    Affichage de spectres infrarouge.
    Les spectres peuvent être téléchargés au format png.
    Les données peuvent être téléchargées au format csv.
*/


filename = "ethane";
reverseY = false;
wave_numbers = [];
transmittances = [];

const selector = document.querySelector("#selector");

// ajout des différents options
for (obj of list) {
    opt = document.createElement("option");
    opt.setAttribute("value", obj['fichier']);
    opt.innerText = obj['nom'];
    selector.appendChild(opt);
}

selector.addEventListener(
    "change",
    function() {
        filename = this.value;
        fichier = list.find(obj => obj.fichier === filename);
        reverseY = false;
        if (fichier['reverseY']) {
            reverseY = true;
        }
        loadFile();
    }
);



function loadFile() {
    /*
        Charge le fichier csv contenant les données du spectre.
    */
    wave_numbers = []
    transmittances = []
    
    fetch('/static/animations/spectres-infrarouge/data/' + filename + '.csv')
        .then(response => response.text())
        .then(csvText => {
            const lignes = csvText.trim().split('\n').slice(1);
            for (const ligne of lignes) {
                const valeurs = ligne.split(',').map(val => val.trim());
                if (valeurs[0] > 3800 || valeurs[0] < 600) {
                    continue;
                }
                
                wave_numbers.push(parseFloat(valeurs[0]))
                transmittance = Math.min(parseFloat(valeurs[1]), 1);
                // console.log(reverseY);
                if (reverseY) {
                    transmittance = 1 - transmittance;
                }
                transmittances.push(transmittance);
            }
            drawSpectrum();
        })
        .catch(error => console.error('Erreur de chargement CSV :', error));
}





//==============================
//            Graphe
//==============================

const canvas = document.getElementById("spectrum");

const stage = new createjs.Stage(canvas);
stage.enableMouseOver();
createjs.Touch.enable(stage);
stage.mouseMoveOutside = true;

const container = new createjs.Container();
stage.addChild(container);
container.x = 80;
container.y = 310;



// ===== Axes =====

const axes = new createjs.Shape();
container.addChild(axes);
axes.graphics.ss(2, 1, 1).s('black');
axes.graphics.drawRect(0, -50, 640, -250);

for (let x = 600; x <= 3800; x += 400) {
    axes.graphics.mt((3800-x)/5, -50);
    axes.graphics.lt((3800-x)/5, -45);
    
    text = new createjs.Text(x, "16px Quicksand");
    container.addChild(text);
    text.x = (3800-x)/5;
    text.y = -40;
    text.textAlign = 'center';
}

for (let y = 0; y <= 100; y += 10) {
    axes.graphics.mt(0, -2.5 * y - 50);
    axes.graphics.lt(-5, -2.5 * y - 50);
    
    text = new createjs.Text(y, "16px Quicksand");
    container.addChild(text);
    text.x = -10;
    text.y = -2.5 * y - 50;
    text.textAlign = 'right';
    text.textBaseline = 'middle';
}

const xLegend = new createjs.Text("Nombre d'onde σ (cm⁻¹)", "16px Quicksand");
container.addChild(xLegend);
xLegend.x = 0.5 * canvas.width - container.x;
xLegend.y = -10;
xLegend.textAlign = 'center';

const yLegend = new createjs.Text("Transmittance (%)", "16px Quicksand");
container.addChild(yLegend);
yLegend.x = -60;
yLegend.y = -50 - 250 * 0.5;
yLegend.rotation = -90;
yLegend.textAlign = 'center';




// ===== Spectre =====

const spectrum = new createjs.Shape();
container.addChild(spectrum);

function drawSpectrum() {
    /*
        Trace le spectre.
    */
    spectrum.graphics.clear();
    spectrum.graphics.ss(2, 1, 1).s('red');
    spectrum.graphics.mt(
        (3800-wave_numbers[0])/5,
        -transmittances[0] * 250 - 50
    );
    for (let i = 1; i < wave_numbers.length; i++) {
        spectrum.graphics.lt((3800-wave_numbers[i])/5, -transmittances[i] * 250 - 50);
    }
    stage.update();
}



// ===== Téléchargement du spectre =====

function saveCanvasAsImage() {
    /*
        Télécharge le spectre au format png.
    */
    const canvas = document.getElementById("spectrum");
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "spectre-" + filename + ".png";  // nom du fichier
    link.click();  // déclenche le téléchargement
}

function saveDataAsCSV() {
    /*
        Télécharge les données du spectre au format csv.
    */
    const link = document.createElement("a");
    link.href = '/static/animations/spectres-infrarouge/data/' + filename + '.csv';
    link.download = "spectre-" + filename + ".csv";
    link.click();
}




loadFile();