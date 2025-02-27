const MCCanvas = document.getElementById("MC_canvas");
MCCanvas.width = mainWidth;

const MCStage = new createjs.Stage(MCCanvas);
MCStage.enableMouseOver();
createjs.Touch.enable(MCStage);
MCStage.mouseMoveOutside = true;



//==============================
//        Vue transverse
//==============================

// conteneur
const transverseMCContainer = new createjs.Container();
MCStage.addChild(transverseMCContainer);

// shape pour la vue transverse du détecteur
const transverseATLAS = new createjs.Shape();
transverseMCContainer.addChild(transverseATLAS);
transverseATLAS.graphics.ss(2, 1, 1).s('rgb(100, 200, 100)').f('rgb(100, 200, 100)');

const transverseScale = 0.04;

// photons dans la vue transverse
const transversePhotons = new createjs.Shape();
transverseMCContainer.addChild(transversePhotons);



// ===== Electromagnetic barrel =====

const rIntEMB = 1500 * transverseScale;
const rExtEMB = 1970 * transverseScale;
const maxEtaEMB = 1.45;
const maxAngleEMB = 2 * Math.atan(Math.exp(-maxEtaEMB));

// barrel pour phi > 0
transverseATLAS.graphics.mt(rIntEMB / Math.tan(maxAngleEMB), rIntEMB);
transverseATLAS.graphics.lt(rExtEMB / Math.tan(maxAngleEMB), rExtEMB);
transverseATLAS.graphics.lt(-rExtEMB / Math.tan(maxAngleEMB), rExtEMB);
transverseATLAS.graphics.lt(-rIntEMB / Math.tan(maxAngleEMB), rIntEMB);
transverseATLAS.graphics.lt(rIntEMB / Math.tan(maxAngleEMB), rIntEMB);

// barrel pour phi < 0
transverseATLAS.graphics.mt(rIntEMB / Math.tan(maxAngleEMB), -rIntEMB);
transverseATLAS.graphics.lt(rExtEMB / Math.tan(maxAngleEMB), -rExtEMB);
transverseATLAS.graphics.lt(-rExtEMB / Math.tan(maxAngleEMB), -rExtEMB);
transverseATLAS.graphics.lt(-rIntEMB / Math.tan(maxAngleEMB), -rIntEMB);
transverseATLAS.graphics.lt(rIntEMB / Math.tan(maxAngleEMB), -rIntEMB);



// ===== Electromagnetic end-caps =====

const rIntEMEC = 4114 * transverseScale;
const rExtEMEC = 4971 * transverseScale;
const maxEtaEMEC = 1.375;
const maxAngleEMEC = 2 * Math.atan(Math.exp(-maxEtaEMEC));
const minEtaEMEC = 2.5;
const minAngleEMEC = 2 * Math.atan(Math.exp(-minEtaEMEC));

// phi < 0 et eta > 0
transverseATLAS.graphics.mt(rIntEMEC, rIntEMEC * Math.tan(minAngleEMEC));
transverseATLAS.graphics.lt(rIntEMEC, rIntEMEC * Math.tan(maxAngleEMEC));
transverseATLAS.graphics.lt(rExtEMEC, rExtEMEC * Math.tan(maxAngleEMEC));
transverseATLAS.graphics.lt(rExtEMEC, rExtEMEC * Math.tan(minAngleEMEC));
transverseATLAS.graphics.lt(rIntEMEC, rIntEMEC * Math.tan(minAngleEMEC));

// phi > 0 et eta > 0
transverseATLAS.graphics.mt(rIntEMEC, -rIntEMEC * Math.tan(minAngleEMEC));
transverseATLAS.graphics.lt(rIntEMEC, -rIntEMEC * Math.tan(maxAngleEMEC));
transverseATLAS.graphics.lt(rExtEMEC, -rExtEMEC * Math.tan(maxAngleEMEC));
transverseATLAS.graphics.lt(rExtEMEC, -rExtEMEC * Math.tan(minAngleEMEC));
transverseATLAS.graphics.lt(rIntEMEC, -rIntEMEC * Math.tan(minAngleEMEC));

// phi < 0 et eta < 0
transverseATLAS.graphics.mt(-rIntEMEC, rIntEMEC * Math.tan(minAngleEMEC));
transverseATLAS.graphics.lt(-rIntEMEC, rIntEMEC * Math.tan(maxAngleEMEC));
transverseATLAS.graphics.lt(-rExtEMEC, rExtEMEC * Math.tan(maxAngleEMEC));
transverseATLAS.graphics.lt(-rExtEMEC, rExtEMEC * Math.tan(minAngleEMEC));
transverseATLAS.graphics.lt(-rIntEMEC, rIntEMEC * Math.tan(minAngleEMEC));

// phi > 0 et eta < 0
transverseATLAS.graphics.mt(-rIntEMEC, -rIntEMEC * Math.tan(minAngleEMEC));
transverseATLAS.graphics.lt(-rIntEMEC, -rIntEMEC * Math.tan(maxAngleEMEC));
transverseATLAS.graphics.lt(-rExtEMEC, -rExtEMEC * Math.tan(maxAngleEMEC));
transverseATLAS.graphics.lt(-rExtEMEC, -rExtEMEC * Math.tan(minAngleEMEC));
transverseATLAS.graphics.lt(-rIntEMEC, -rIntEMEC * Math.tan(minAngleEMEC));

transverseMCContainer.x = rExtEMEC + 10;
transverseMCContainer.y = rExtEMEC * Math.tan(maxAngleEMEC) + 20;





//==============================
//         Vue polaire
//==============================

// conteneur
const polarMCContainer = new createjs.Container();
MCStage.addChild(polarMCContainer);

// shape pour la vue polaire du détecteur
const polarATLAS = new createjs.Shape();
polarMCContainer.addChild(polarATLAS);

const rInt = 80;
const rExt = rExtEMEC * Math.tan(maxAngleEMEC);

const outerCircle = new createjs.Shape();
outerCircle.graphics.ss(2, 1, 1).s('rgb(100, 200, 100)');
outerCircle.graphics.beginFill('rgb(100, 200, 100)').dc(0, 0, rExt);
polarMCContainer.addChild(outerCircle);

const innerCircle = new createjs.Shape();
innerCircle.graphics.ss(2, 1, 1).s('rgb(100, 200, 100)');
innerCircle.graphics.beginFill('rgb(100, 200, 100)').dc(0, 0, rInt);
innerCircle.compositeOperation = "destination-out"; // Rend le cercle intérieur transparent
polarMCContainer.addChild(innerCircle);

// photons pour la vue transverse
const polarPhotons = new createjs.Shape();
polarMCContainer.addChild(polarPhotons);

polarMCContainer.x = 2 * rExtEMEC + rExt + 50;
polarMCContainer.y = transverseMCContainer.y;





//==============================
//      Tracé des photons
//==============================

// variables cinétiques des photons
let pt_lead;
let pt_sub;
let eta_lead;
let eta_sub;
let phi_lead;
let phi_sub;
let theta_lead;
let theta_sub;
let massGamGam;

// position des traces
let x_lead;
let y_lead;
let x_sub;
let y_sub;

function setPhotonProperties(event) {
    /*
        Récupère les variables de l'événement.
    */
    pt_lead = event[0];
    pt_sub = event[1];
    eta_lead = event[2];
    eta_sub = event[3];
    phi_lead = event[4];
    phi_sub = event[5];
    theta_lead = computeAngleFromEta(eta_lead);
    theta_sub = computeAngleFromEta(eta_sub);
    massGamGam = event[6];
}

function computeAngleFromEta(eta) {
    /*
        Calcule l'angle par rapport à l'axe du faisceau à partir
        de la pseudo-rapidité.
    */
    return 2 * Math.atan(Math.exp(-eta));
}

function drawPhotonsTrajectories() {
    /*
        Trace les trajectoires des photons.
    */
    
    // ===== Trajectoire dans la vue transverse =====
    transversePhotons.graphics.clear();
    transversePhotons.graphics.ss(2, 1, 1).s('orange');
    
    // leading photon
    if (Math.abs(eta_lead) < 1.45) {
        // photon dans l'EMB
        y_lead = phi_lead > 0 ? rExtEMB : -rExtEMB;
        x_lead = rExtEMB / Math.tan(theta_lead);
    } else {
        // photon dans l'EMEC
        x_lead = eta_lead > 0 ? rExtEMEC : -rExtEMEC;
        y_lead = phi_lead > 0 ? rExtEMEC * Math.abs(Math.tan(theta_lead)) : -rExtEMEC * Math.abs(Math.tan(theta_lead));
    }
    
    // subleading photon
    if (Math.abs(eta_sub) < 1.45) {
        // photon dans l'EMB
        y_sub = phi_sub > 0 ? rExtEMB : -rExtEMB;
        x_sub = rExtEMB / Math.tan(theta_sub);
    } else {
        // photon dans l'EMEC
        x_sub = eta_sub > 0 ? rExtEMEC : -rExtEMEC;
        y_sub = phi_sub > 0 ? rExtEMEC * Math.abs(Math.tan(theta_sub)) : -rExtEMEC * Math.abs(Math.tan(theta_sub));
    }
    
    transversePhotons.graphics.mt(x_lead, -y_lead);
    transversePhotons.graphics.lt(0, 0);
    transversePhotons.graphics.lt(x_sub, -y_sub);
    
    
    // ===== Trajectoire dans la vue polaire =====
    polarPhotons.graphics.clear();
    polarPhotons.graphics.ss(2, 1, 1).s('orange');
    polarPhotons.graphics.mt(rExt * Math.cos(phi_lead), -rExt * Math.sin(phi_lead));
    polarPhotons.graphics.lt(0, 0);
    polarPhotons.graphics.lt(rExt * Math.cos(phi_sub), -rExt * Math.sin(phi_sub));
    
    MCStage.update();
}





//==============================
//         Histogramme
//==============================

// limites de l'histogramme
const minMC = 110;
const maxMC = 140;

// conteneur
const histogramMCContainer = new createjs.Container();
MCStage.addChild(histogramMCContainer);

// axes
const histogramMCAxes = new createjs.Shape();
histogramMCContainer.addChild(histogramMCAxes);
histogramMCContainer.x = 2 * (rExtEMEC + rExt + 50);
histogramMCContainer.y = 2 * transverseMCContainer.y - 20;

const histogramMCWidth = mainWidth - histogramMCContainer.x - 40;  // largeur de l'histogramme
const xScaleMC = histogramMCWidth / (maxMC - minMC);
const yMaxMC = 2 * transverseMCContainer.y - 40;

histogramMCAxes.graphics.ss(2, 1, 1).s('black');
histogramMCAxes.graphics.drawRect(0, 0, histogramMCWidth, -yMaxMC);

// échelle pour la masse
for (let m = minMC; m <= maxMC; m += 10) {
    let massLegend = new createjs.Text(m, "12px Quicksand", 'black');
    histogramMCContainer.addChild(massLegend);
    massLegend.x = (m-minMC) * xScaleMC;
    massLegend.y = 10;
    massLegend.textBaseline = 'middle';
    massLegend.textAlign = 'center';
}

// légende
const massMCLegend = new createjs.Text("Masse invariante (GeV/c²)", "12px Quicksand", 'black');
histogramMCContainer.addChild(massMCLegend);
massMCLegend.x = histogramMCWidth;
massMCLegend.y = 25;
massMCLegend.textBaseline = 'middle';
massMCLegend.textAlign = 'right';

// initialisation des bins
let bins = [];
for (let i = 0; i < numBins; i++) {
    bins[i] = 0;
}

// histogramme pour le Monte Carlo
const histogramMC = new createjs.Shape();
histogramMCContainer.addChild(histogramMC);

const histogramMCText = new createjs.Text("", "14px Quicksand", 'black');
histogramMCContainer.addChild(histogramMCText);
histogramMCText.x = 0.8 * histogramMCWidth;
histogramMCText.y = 0.8 * yMaxMC;

function drawHistogramMC() {
    /*
        Trace l'histogramme pour les événements du Monte Carlo.
    */
    histogramMC.graphics.clear();
    histogramMC.graphics.ss(1, 1, 1).s('black').f('orange');
    
    let binsMax = bins.reduce((max, current) => Math.max(max, current), -Infinity);
    for (let i = 0; i < numBins; i++) {
        histogramMC.graphics.drawRect(
            i * (maxMC - minMC)/numBins * xScaleMC,
            0,
            (maxMC - minMC)/numBins * xScaleMC,
            -0.8 * yMaxMC * bins[i]/binsMax
        );
    }
    
    MCStage.update();
}

function addEventToHistogram() {
    /*
        Ajoute l'événement en cours à l'histogramme.
    */
    if (massGamGam >= minMC && massGamGam <= maxMC) {
        i = Math.floor((massGamGam - minMC) * numBins / (maxMC - minMC));
        bins[i]++;
        drawHistogramMC();
    }
}





//==============================
//          Simulation
//==============================

let paused = true;
let eventIndex = 0;

const simulationButton = document.getElementById("simulation_button");
simulationButton.addEventListener("mousedown", launchSimulation);

function launchSimulation() {
    paused = false;
    simulateEvent(eventIndex);
    simulationButton.removeEventListener("mousedown", launchSimulation);
    simulationButton.addEventListener("mousedown", pauseSimulation);
    simulationButton.innerText = "Mettre en pause";
}

function pauseSimulation() {
    paused = true;
    simulationButton.removeEventListener("mousedown", pauseSimulation);
    simulationButton.addEventListener("mousedown", launchSimulation);
    simulationButton.innerText = "Lancer la simulation";
}

function simulateEvent(i) {
    /*
        Simule un événement du Monte Carlo.
    */
    fetch(MCFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier JSON");
            }
            return response.json();
        })
        .then(data => {
            // récupération de l'événement
            let event = data[i];
            
            if (!event) {
                console.error("Aucune donnée trouvée pour l'index spécifié");
                return;
            }
            
            setPhotonProperties(event);
            drawPhotonsTrajectories();
            addEventToHistogram();
            displaySimulationValues();
            eventIndex++;
            if (i == 10000) {
                photonsTrajectories.graphics.clear();
                paused = true;
            } else if (!paused) {
                simulateEvent(i+1);
            }
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
}

const leadEnergySpan = document.getElementById("lead_energy");
const subEnergySpan = document.getElementById("sub_energy");
const photonsAngleSpan = document.getElementById("photons_angle");
const invariantMassSpan = document.getElementById("invariant_mass");

function displaySimulationValues() {
    leadEnergySpan.innerText = (pt_lead * Math.cosh(eta_lead)).toLocaleString('fr-FR', {maximumFractionDigits: 2});
    subEnergySpan.innerText = (pt_sub * Math.cosh(eta_sub)).toLocaleString('fr-FR', {maximumFractionDigits: 2});
    photonsAngle = Math.acos(Math.cos(theta_lead) * Math.cos(theta_sub) + Math.sin(theta_lead) * Math.sin(theta_sub) * Math.cos(phi_lead - phi_sub));
    photonsAngleSpan.innerText = photonsAngle.toLocaleString('fr-FR', {maximumFractionDigits: 2});
    invariantMassSpan.innerText = massGamGam.toLocaleString('fr-FR', {maximumFractionDigits: 2});
}



MCCanvas.height = 2 * transverseMCContainer.y + 20;
MCStage.update();