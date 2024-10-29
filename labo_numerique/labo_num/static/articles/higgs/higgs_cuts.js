/*
    --------------------------------
    |   Diffraction par N fentes   |
    --------------------------------

    Ce script simule les franges d'égale inclinaison produites par un
    interféromètre de Michelson réglé en lame d'air.
    Un curseur permet de régler l'épaisseur de la lame d'air. Un autre
    curseur permet de choisir la longueur d'onde.
    Un schéma du montage est représenté, ainsi que deux rayons lumineux
    secondaires issus d'un rayon primaire.
*/





//==============================
//       Canvas graphique
//==============================

const eventsCanvas = document.getElementById("events_canvas");
eventsCanvas.width = 680;
eventsCanvas.height = 360;

const eventsStage = new createjs.Stage(eventsCanvas);



// ===== Conteneur du graphe =====

const eventsContainer = new createjs.Container();
eventsStage.addChild(eventsContainer);
eventsContainer.x = eventsCanvas.width/2 - 300 + 20;
eventsContainer.y = 320;



const eventsAxes = new createjs.Shape();
eventsContainer.addChild(eventsAxes);

eventsAxes.graphics.ss(1, 1, 1).s('black').f('white');
eventsAxes.graphics.drawRect(0, 0, 600, yMax);
eventsAxes.graphics.ef();

// échelle pour la masse
for (let m = 100; m <= 160; m += 10) {
    let massLegend = new createjs.Text(m, "14px Quicksand", 'black');
    eventsContainer.addChild(massLegend);
    massLegend.x = (m-100)*xScale;
    massLegend.y = 12;
    massLegend.textBaseline = 'middle';
    massLegend.textAlign = 'center';
}

for (let m = 102; m < 160; m += 2) {
    let x = (m-100) * xScale;
    if (m % 10 == 0) {
        eventsAxes.graphics.mt(x, -6).lt(x, 0);
        eventsAxes.graphics.mt(x, nMax * yScale).lt(x, nMax * yScale + 6);
    } else {
        eventsAxes.graphics.mt(x, -3).lt(x, 0);
        eventsAxes.graphics.mt(x, nMax * yScale).lt(x, nMax * yScale + 3);
    }
}

// échelle pour le nombre d'entrées
for (let n = 400; n < nMaxCuts; n += 400) {
    let nLegend = new createjs.Text(n, "14px Quicksand", 'black');
    eventsContainer.addChild(nLegend);
    nLegend.x = -5;
    nLegend.y = n * yScaleCuts;
    nLegend.textBaseline = 'middle';
    nLegend.textAlign = 'right';
}

for (let n = 80; n < nMaxCuts; n += 80) {
    let y = n * yScaleCuts;
    if (n % 400 == 0) {
        eventsAxes.graphics.mt(0, y).lt(6, y);
        eventsAxes.graphics.mt(600, y).lt(594, y);
    } else {
        eventsAxes.graphics.mt(0, y).lt(3, y);
        eventsAxes.graphics.mt(600, y).lt(597, y);
    }
}



// ===== Légende du graphe =====

const xCutsLegend = 390;

const ATLASCutsLegend = new createjs.Text("ATLAS Open Data", "20px Quicksand", 'black');
eventsContainer.addChild(ATLASCutsLegend);
ATLASCutsLegend.x = xCutsLegend;
ATLASCutsLegend.y = yMaxCuts + 25;
ATLASCutsLegend.textBaseline = 'middle';
ATLASCutsLegend.textAlign = 'left';

const educationCutsLegend = new createjs.Text("for education", "14px Quicksand", 'black');
eventsContainer.addChild(educationCutsLegend);
educationCutsLegend.x = xCutsLegend;
educationCutsLegend.y = yMaxCuts + 45;
educationCutsLegend.textBaseline = 'middle';
educationCutsLegend.textAlign = 'left';

const lumiCutsLegend = new createjs.Text("√s = 13 TeV, ∫ L dt = 36,1 fb⁻¹", "16px Quicksand", 'black');
eventsContainer.addChild(lumiCutsLegend);
lumiCutsLegend.x = xCutsLegend;
lumiCutsLegend.y = yMaxCuts + 65;
lumiCutsLegend.textBaseline = 'middle';
lumiCutsLegend.textAlign = 'left';

const canalCutsLegend = new createjs.Text("H → γγ", "16px Quicksand", 'black');
eventsContainer.addChild(canalCutsLegend);
canalCutsLegend.x = xCutsLegend;
canalCutsLegend.y = yMaxCuts + 85;
canalCutsLegend.textBaseline = 'middle';
canalCutsLegend.textAlign = 'left';

const massCutsLegend = new createjs.Text("Masse invariante (GeV)", "16px Quicksand", 'black');
eventsContainer.addChild(massCutsLegend);
massCutsLegend.x = 600;
massCutsLegend.y = 30;
massCutsLegend.textBaseline = 'middle';
massCutsLegend.textAlign = 'right';

const eventsCutsLegend = new createjs.Text("Événements / 3 GeV", "16px Quicksand", 'black');
eventsContainer.addChild(eventsCutsLegend);
eventsCutsLegend.x = -50;
eventsCutsLegend.y = yMaxCuts;
eventsCutsLegend.textBaseline = 'middle';
eventsCutsLegend.textAlign = 'right';
eventsCutsLegend.rotation = -90;



let events = [2220,2015,1827,1689,1581,1454,1452,1403,1300,1257,1134,1070,1099,954,946,922,888,778,769,752]

const cutsHistogram = new createjs.Shape();
eventsContainer.addChild(cutsHistogram);


function drawEvents() {
    /*
        Représente l'histogramme des événements.
    */
    cutsHistogram.graphics.clear();
    cutsHistogram.graphics.ss(2, 1, 1).s('black').f('orange');
    
    for (let i = 0; i < numBins; i++) {
        let x = (xBins[i]-100) * xScale;
        let n = events[i];
        let uncertainty = Math.sqrt(events[i]);
        
        cutsHistogram.graphics.drawRect(i * (max-min)/numBins * xScale, 0, (max-min)/numBins * xScale, n * yScaleCuts);
                
        // // nombre d'entrées
        // cutsHistogram.graphics.mt(x, yScaleCuts * n);
        // cutsHistogram.graphics.dc(x, yScaleCuts * n, 3);
        //
        // // incertitudes
        // cutsHistogram.graphics.mt(x, yScaleCuts * (n-uncertainty));
        // cutsHistogram.graphics.lt(x, yScaleCuts * (n+uncertainty));
    }
    
    eventsStage.update();
}


let cutString = "lead40_sub30_iso4";
let ptLeadCut = 30;
let ptSubCut = 25;
let isoCut = 6;

const ptLeadCutSpan = document.getElementById("pt_lead_cut");
const ptSubCutSpan = document.getElementById("pt_sub_cut");
const isoCutSpan = document.getElementById("iso_cut");

ptLeadCutSpan.value = ptLeadCut;
ptSubCutSpan.value = ptSubCut;
isoCutSpan.value = isoCut;

ptLeadCutSpan.addEventListener("change", function() {
    ptLeadCut = parseInt(ptLeadCutSpan.value);
    if (ptLeadCut <= ptSubCut) {
        ptSubCut = ptLeadCut-1;
        ptSubCutSpan.value = ptSubCut;
    }
    updateCuts();
});

ptSubCutSpan.addEventListener("change", function() {
    ptSubCut = parseInt(ptSubCutSpan.value);
    if (ptLeadCut <= ptSubCut) {
        ptLeadCut = ptSubCut+1;
        ptLeadCutSpan.value = ptLeadCut;
    }
    updateCuts();
});

isoCutSpan.addEventListener("change", function() {
    isoCut = parseInt(isoCutSpan.value);
    updateCuts();
});

function updateCuts() {
    setCutString();
    applyCuts();
}

function setCutString() {
    cutString = "lead" + ptLeadCut + "_sub" + ptSubCut + "_ptiso" + isoCut;
}

function applyCuts() {
    fetch(cutsPath + isoCut + ".json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier JSON");
            }
            return response.json();
        })
        .then(data => {
            // récupération de l'événement
            if (!data[cutString]) {
                console.error("Aucune donnée trouvée pour l'index spécifié");
                return;
            }
            
            events = data[cutString];            
            drawEvents();
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
}









// ===== Initialisation =====

setCutString();
applyCuts();
eventsStage.update();