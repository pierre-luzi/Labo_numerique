/*
    --------------------------------
    |           Titrage            |
    --------------------------------

    Simulation d'un titrage colorimétrique.
    Options : choix de la solution titrée.
    Les quantités de matière introduites et présentes dans l'erlenmeyer
    sont affichées et représentées graphiquement.
    Il est possible de verser la solution titrante goutte à goutte.
    Paramètres :
        - volume initial de solution titrée ;
        - concentration de la solution titrée ;
        - concentration de la solution titrante.
*/



//==============================
//    Paramètres du titrage
//==============================

// coefficients stœchiométriques
let coeffTitrated = 1;
let coeffTitrant = 2;
let coeffProduct1 = 2;
let coeffProduct2 = 1;

// couleurs des solutions
let titratedColor = "255, 255, 100";
let titrantColor = "220, 220, 255";

// conditions initiales
let C0 = 1e-2;
let V0 = 10.;
let C = 1e-2;
let volume = 0;

let Veq = 2 * C0 * V0 / C;
let nMax = C0 * V0;



// ===== Choix du titrage =====

const selector = document.querySelector("#select_titrated");

// ajout des différents options
for (obj in list) {
    opt = document.createElement("option");
    opt.setAttribute("value", obj);
    opt.innerText = list[obj]['titratedSolution'];
    selector.appendChild(opt);
}

selector.addEventListener(
    "change",
    function() {
        value = this.value;
        setReactionParameters(value);
    }
);

function setReactionParameters(value) {
    /*
        Fixe les paramètres de la réaction du titrage.
    */
    obj = list[value];
    coeffTitrated = obj['coeffTitrated'];
    coeffTitrant = obj['coeffTitrant'];
    coeffProduct1 = obj['coeffProduct1'];
    coeffProduct2 = obj['coeffProduct2'];
    computeVEq();
    computeNScale();
    
    titratedColor = obj['titratedColor'];
    titrantColor = obj['titrantColor'];
    drawTitrant();
    drawErlen();
    drawDrop();
    setupStage.update();
    
    document.querySelector("#titrant_solution").innerHTML = obj['titrantSolution'];
    document.querySelector("#equation").innerHTML = obj['equation'];
    document.querySelector("#titrated").innerHTML = obj['titrated'];
    document.querySelector("#titrant").innerHTML = obj['titrant'];
    document.querySelector("#product1").innerHTML = obj['product1'];
    document.querySelector("#product2").innerHTML = obj['product2'];
}



// ===== Volume solution titrée =====

const V0Input = document.querySelector("#V0");
V0Input.value = 10.;

function changeV0Input() {
    /*
        Change le volume de solution titrée.
        Le volume à l'équivalence et l'échelle du graphique
        sont recalculés.
    */
    V0 = V0Input.value * 1.;    // assure que V0 soit un nombre
    displayIniTitrated();
    displayNReactant1();
    computeVEq();
    computeNScale();
    
    // remise à zéro de l'erlenmeyer
    yTitrated = 480;
    volumeErlen = 0;
    volume = 0;
    computeYTitrated();
    drawTitrated();
    setupStage.update();
}

V0Input.addEventListener("change", changeV0Input);
V0Input.addEventListener("keyup", function() {
    // limite le volume initial à 25 mL
    if (this.value > 25) {
        this.value = 25;
    }
    changeV0Input();
});



// ===== Concentration solution titrée =====

const titratedInput = document.querySelector("#C0");
titratedInput.value = 1;

function changeTitratedInput() {
    /*
        Change la concentration initiale de la solution titrée.
        Le volume à l'équivalence et l'échelle du graphique sont
        recalculés.
    */
    C0 = titratedInput.value * 1e-2;
    displayIniTitrated();
    displayNReactant1();
    computeVEq();
    computeNScale();
}

titratedInput.addEventListener("change", changeTitratedInput);
titratedInput.addEventListener("keyup", function() {
    // limite la concentration initiale à 5e-2 mol/L
    if (this.value > 5) {
        this.value = 5;
    }
    changeTitratedInput();
});



// ===== Concentration solution titrante =====

const titrantInput = document.querySelector("#C");
titrantInput.value = 1;

function changeTitrantInput() {
    /*
        Change la concentration initiale de la solution titrante.
        Le volume à l'équivalence et l'échelle du graphique sont
        recalculés.
    */
    C = titrantInput.value * 1e-2;
    computeVEq();
    computeNScale();
}

titrantInput.addEventListener("change", changeTitrantInput);
titrantInput.addEventListener("keyup", function() {
    // limite la concentration initiale à 5e-2 mol/L
    if (this.value > 5) {
        this.value = 5;
    }
    changeTitrantInput();
});



// ===== Fonctions =====

const resetButton = document.querySelector("#button");
resetButton.addEventListener("mousedown", reset);

function reset() {
    /*
        Remise à zéro du titrage.
    */
    volume = 0;

    // active les inputs
    enableInputs();
    
    // affichage des quantités de matière
    displayIniTitrated();
    displayIniTitrant();
    displayNReactant1();
    displayNReactant2();
    displayNProduct1();
    displayNProduct2();
    
    // remise à zéro de l'erlenmeyer
    yTitrated = 480;
    volumeErlen = 0;
    computeYTitrated();
    drawTitrated();
    
    // remise à zéro de la burette
    drawBuret();
    drawFaucet();
    drawTitrant();
    writeTitrantVolume();
    faucet.addEventListener("mousedown", openFaucet);
    dropButton.addEventListener("mousedown", singleDrop);

    // remise à zéro des axes et calcul de l'échelle
    removeNTicks();
    computeNScale();
    drawPlotAxes();
    
    // remise à séro des graphes
    drawPlotTitrated();
    drawPlotTitrant();
    drawPlotProduct1();
    drawPlotProduct2();
    
    // mise à jour des stages
    setupStage.update();
    plotStage.update();
}

function enableInputs(enabled=true) {
    /*
        Activation ou désactivation des inputs.
        Cette fonction est appelée lorsque le titrage commence,
        afin de garder constante les concentrations.
    */
    selector.disabled = !enabled;
    V0Input.disabled = !enabled;
    titratedInput.disabled = !enabled;
    titrantInput.disabled = !enabled;
}

function computeVEq() {
    /*
        Calcule le volume à l'équivalence Veq en fonction des
        conditions initiales.
    */
    Veq = coeffTitrant * C0 * V0 / (coeffTitrated * C);
}





//==============================
//   Affichage des quantités
//==============================

function toExponentialHTML(number) {
    /*
        Écris un nombre en écriture scientifique au format HTML.
    */
    if (number == 0) {
        return 0;
    } else if (number >= 1) {
        return number.toLocaleString('fr-FR', {maximumFractionDigits: 1, minimumFractionDigits: 1});
    } else {
        let str = parseFloat(number).toExponential();
        let html = parseFloat(str.substring(0, 3)).toLocaleString('fr-FR', {minimumFractionDigits: 1});
        html += " &times; 10<sup>-" + str.substring(str.length-1); + "</sup>"
        return html;
    }
}



// ===== Quantités introduites dans l'erlenmeyer =====

const iniTitrated = document.querySelector("#ini_titrated");
const iniTitrant = document.querySelector("#ini_titrant");

function displayIniTitrated() {
    /*
        Affiche la quantité initiale de l'espèce titrée.
    */
    iniTitrated.innerHTML = toExponentialHTML(C0*V0*1e-3);
}

function displayIniTitrant() {
    /*
        Affiche la quantité initiale versée de l'espèce titrante.
    */
    iniTitrant.innerHTML = toExponentialHTML(C*volume*1e-3);
}



// ===== Réactif 1 =====

const reactant1 = document.querySelector("#n_reactant1");
let nReactant1 = C0 * V0;

function computeNReactant1() {
    /*
        Calcule la quantité restante de l'espèce titrée.
    */
    if (volume <= Veq) {
        nReactant1 = C0*V0 - C*volume/coeffTitrant;
        nReactant1 *= 1e-3;
    } else {
        nReactant1 = 0;
    }
}

function displayNReactant1() {
    /*
        Affiche la quantité restante de l'espèce titrée.
    */
    computeNReactant1();
    reactant1.innerHTML = toExponentialHTML(nReactant1);
}



// ===== Réactif 2 =====

const reactant2 = document.querySelector("#n_reactant2");
let nReactant2 = 0;

function computeNReactant2() {
    /*
        Calcule la quantité de matière de l'espèce titrante dans l'erlenmeyer.
    */
    if (volume <= Veq) {
        nReactant2 = 0;
    } else {
        nReactant2 = C * (volume - Veq);
        nReactant2 *= 1e-3;
    }
}

function displayNReactant2() {
    /*
        Affiche la quantité de l'espèce titrante dans l'erlenmeyer.
    */
    computeNReactant2();
    reactant2.innerHTML = toExponentialHTML(nReactant2);
}



// ===== Produit 1 =====

const product1 = document.querySelector("#n_product1");
let nProduct1 = 0;

function computeNProduct1() {
    /*
        Calcule la quantité de produit 1 dans l'erlenmeyer.
    */
    if (volume <= Veq) {
        nProduct1 = C * volume * coeffProduct1 / coeffTitrant;
    } else {
        nProduct1 = C * Veq * coeffProduct1 / coeffTitrant;
    }
    nProduct1 *= 1e-3;
}

function displayNProduct1() {
    /*
        Affiche la quantité de produit 1 dans l'erlenmeyer.
    */
    computeNProduct1();
    product1.innerHTML = toExponentialHTML(nProduct1);
}



// ===== Produit 1 =====

const product2 = document.querySelector("#n_product2");
let nProduct2 = 0;

function computeNProduct2() {
    /*
        Calcule la quantité de produit 2 dans l'erlenmeyer.
    */
    if (volume <= Veq) {
        nProduct2 = C * volume * coeffProduct2 / coeffTitrant;
    } else {
        nProduct2 = C * Veq * coeffProduct2 / coeffTitrant;
    }
    nProduct2 *= 1e-3;
}

function displayNProduct2() {
    /*
        Affiche la quantité de produit 2 dans l'erlenmeyer.
    */
    computeNProduct2();
    product2.innerHTML = toExponentialHTML(nProduct2);
}







//==============================
//           Montage
//==============================

const setupCanvas = document.getElementById("setup");
setupCanvas.height = 0.65 * window.screen.height;

const setupStage = new createjs.Stage(setupCanvas);
setupStage.enableMouseOver();
createjs.Touch.enable(setupStage);
setupStage.mouseMoveOutside = true;



// ===== Erlenmeyer =====

const erlen = new createjs.Shape();
setupStage.addChild(erlen);

erlen.graphics.clear();
erlen.graphics.ss(1, 1, 1).s('black');

erlen.graphics.drawEllipse(47, 380, 36, 10);
erlen.graphics.mt(47, 385).lt(47, 410);
erlen.graphics.lt(20, 480);
erlen.graphics.mt(83, 385).lt(83, 410);
erlen.graphics.lt(110, 480);
erlen.graphics.drawEllipse(20, 470, 90, 20);

const titrated = new createjs.Shape();
setupStage.addChild(titrated);

let yTitrated = 480;    // hauteur de la surface de solution titrée
let volumeErlen = 0;    // volume contenu dans l'erlenmeyer

function drawErlen() {
    /*
        Dessine l'erlenmeyer.
    */
    setupStage.removeChild(erlen);
    
    computeYTitrated();
    drawTitrated();
    
    setupStage.addChild(erlen);
}

function drawTitrated() {
    /*
        Dessine la solution titrée.
    */
    titrated.graphics.clear();
    if (nReactant1 > 0) {
        titrated.graphics.f('rgba(' + titratedColor + ', 0.5)');
    } else {
        titrated.graphics.f('rgba(' + titrantColor + ', 0.5)');
    }
    
    // surface inférieure de la solution
    titrated.graphics.drawEllipse(20, 470, 90, 20);
    
    // solution en volume
    let r = radiusErlen(yTitrated);
    titrated.graphics.mt(20, 480).lt(65-r, yTitrated);
    titrated.graphics.lt(65+r, yTitrated);
    titrated.graphics.lt(110,480);
    
    // surface supérieure de la solution
    if (nReactant1 > 0) {
        titrated.graphics.f('rgba(' + titratedColor + ', 0.9)');
    } else {
        titrated.graphics.f('rgba(' + titrantColor + ', 0.9)');
    }
    titrated.graphics.drawEllipse(65-r, yTitrated-5, 2*r, 10);
}

function computeYTitrated() {
    /*
        Calcule l'ordonnée de la surface de la solution
        dans l'erlenmeyer.
    */
    let Vtot = volume + V0 + 30;
    let Vpixels = Vtot * Math.PI * 10 * 8**2;
    /* Un volume de 1 mL dans la burette est représenté par
    un cylindre de 10 px de hauteur et 8 px de rayon. */
    
    for (let y = yTitrated; y > 410; y--) {
        if (volumeErlen > Vpixels) {
            yTitrated = y;
            return;
        }
        volumeErlen += Math.PI * radiusErlen(y)**2;
    }
}

function radiusErlen(y) {
    /*
        Renvoie le rayon de l'erlenmeyer à l'ordonnée y.
    */
    return (45-18)/70 * (y-410) + 18;
}



// ===== Burette =====

const buret = new createjs.Shape();
setupStage.addChild(buret);

const faucet = new createjs.Shape();
setupStage.addChild(faucet);
faucet.cursor = 'pointer';
let faucetOpen = false;

function drawBuret() {
    /*
        Dessine la burette.
    */
    buret.graphics.clear();
    buret.graphics.ss(1, 1, 1).s('black');
    
    // corps de la burette
    buret.graphics.drawEllipse(50, 10, 30, 6);
    buret.graphics.mt(50, 13).lt(57, 25);
    buret.graphics.lt(57, 310);
    buret.graphics.lt(63, 340);
    buret.graphics.lt(63, 370);
    buret.graphics.lt(67, 375);
    buret.graphics.lt(67, 340);
    buret.graphics.lt(73, 310);
    buret.graphics.lt(73, 25);
    buret.graphics.lt(80, 13);
    
    // trait épais
    buret.graphics.ss(3, 1, 1).s('rgb(150, 150, 150)');
    buret.graphics.mt(72, 40).lt(72, 290);
    
    // graduations
    buret.graphics.ss(1, 1, 1).s('black');
    for (let volume = 0; volume <= 25; volume++) {
        if (volume %5 == 0) {
            buret.graphics.mt(73, 10*volume + 40);
            buret.graphics.lt(68, 10*volume + 40);
            
            let text = new createjs.Text(volume, "7px Quicksand");
            setupStage.addChild(text);
            text.x = 67;
            text.y = 10*volume + 40;
            text.textBaseline = 'middle';
            text.textAlign = 'right';
        } else {
            buret.graphics.mt(57, 10*volume + 40);
            buret.graphics.lt(73, 10*volume + 40);
        }
    }
    
    setupStage.update();
}

function drawFaucet() {
    /*
        Dessine le robinet de la burette.
    */
    faucet.graphics.clear();
    
    // partie blanche
    faucet.graphics.ss(1, 1, 1).s('black').f('white');
    faucet.graphics.drawRect(61, 350, 8, 6);
    
    // partie rouge
    faucet.graphics.f('rgb(255, 100, 100)');
    faucet.graphics.drawRect(60, 349, -4, 8);
    
    // partie mobile
    if (faucetOpen) {
        faucet.graphics.mt(69, 350);
        faucet.graphics.lt(72, 350);
        faucet.graphics.lt(76, 346);
        faucet.graphics.lt(81, 346);
        faucet.graphics.lt(81, 360);
        faucet.graphics.lt(76, 360);
        faucet.graphics.lt(72, 356);
        faucet.graphics.lt(69, 356);
    } else {
        faucet.graphics.mt(69, 350);
        faucet.graphics.lt(72, 350);
        faucet.graphics.lt(76, 352);
        faucet.graphics.lt(81, 352);
        faucet.graphics.lt(81, 354);
        faucet.graphics.lt(76, 354);
        faucet.graphics.lt(72, 356);
        faucet.graphics.lt(69, 356);
    }
    
    setupStage.update();
}

function openFaucet() {
    /*
        Ouvre le robinet de la burette.
    */
    enableInputs(false);
    faucetOpen = true;
    drawFaucet();
    pour();
    faucet.addEventListener("pressup", closeFaucet);
    faucet.removeEventListener("mousedown", openFaucet);
}

function closeFaucet() {
    /*
        Ferme le robinet de la burette.
    */
    clearInterval(interval);
    faucetOpen = false;
    drawFaucet();
    drawTitrant();
    faucet.removeEventListener("pressup", closeFaucet);
    faucet.addEventListener("mousedown", openFaucet);
}

faucet.addEventListener("mousedown", openFaucet);
faucet.addEventListener("mousedown", addNTicks);



// ===== Solution titrante =====

const titrant = new createjs.Shape();
setupStage.addChild(titrant);

const titrantVolume = new createjs.Text();
setupStage.addChild(titrantVolume);
titrantVolume.x = 85;
titrantVolume.y = 40;
titrantVolume.textBaseline = 'middle';
titrantVolume.textAlign = 'left';

function drawTitrant() {
    /*
        Dessine la solution titrante dans la burette.
    */
    setupStage.removeChild(buret);
    setupStage.removeChild(faucet);
    
    titrant.graphics.clear();
    titrant.graphics.ss(1, 1, 1).f('rgb(' + titrantColor + ')');
    
    titrant.graphics.mt(57, 40 + volume * 10);
    titrant.graphics.lt(57, 310);
    titrant.graphics.lt(63, 340);
    titrant.graphics.lt(63, 350);
    titrant.graphics.lt(67, 350);
    titrant.graphics.lt(67, 340);
    titrant.graphics.lt(73, 310);
    titrant.graphics.lt(73, 40 + volume * 10);
    
    if (faucetOpen) {
        titrant.graphics.mt(64, 356);
        titrant.graphics.lt(64, yTitrated);
        titrant.graphics.lt(66, yTitrated);
        titrant.graphics.lt(66, 356);
    }
    
    setupStage.addChild(buret);
    setupStage.addChild(faucet);
    setupStage.update();
}

function writeTitrantVolume() {
    /*
        Écris, à droite de la burette, le volume versé
        de solution titrante.
    */
    titrantVolume.y = 40 + volume * 10;
    titrantVolume.text = volume.toLocaleString('fr-FR', {maximumFractionDigits: 1, minimumFractionDigits: 1}) + ' mL';
}



// ===== Goutte =====

const drop = new createjs.Shape();
drop.x = 65;

function drawDrop() {
    drop.graphics.clear();
    drop.graphics.f('rgb(' + titrantColor + ')');
    drop.graphics.dc(0, 0, 2);
}

// logo de la goutte
const image = new Image();
image.src = "img/drop.png";

const dropIcon = new createjs.Bitmap(image);
setupStage.addChild(dropIcon);
// const dropIconBounds = dropIcon.getBounds();
dropIcon.x = 40-dropIcon.getBounds().width*0.03/2;
dropIcon.y = 354-dropIcon.getBounds().height*0.03/2;
dropIcon.scale = 0.03;

const dropButton = new createjs.Shape();
setupStage.addChild(dropButton);
dropButton.x = 40;
dropButton.y = 354;
dropButton.cursor = 'pointer';

dropButton.graphics.ss(2, 1, 1).s('rgb(132, 219, 255)');
dropButton.graphics.f('rgba(255, 255, 255, 0.01)');
dropButton.graphics.dc(0, 0, 10);
dropButton.graphics.mt(0, -3).lt()

dropButton.addEventListener("mousedown", singleDrop);
dropButton.addEventListener("mousedown", addNTicks);
dropButton.addEventListener("mousedown", hideDropInfo);
dropButton.addEventListener("mouseover", displayDropInfo);
dropButton.addEventListener("mouseout", hideDropInfo);

const dropInfo = new createjs.Shape();
dropInfo.x = 10;
dropInfo.y = 339;
dropInfo.graphics.ss(2, 1, 1).s('rgb(132, 219, 255)');
dropInfo.graphics.f('white');
dropInfo.graphics.drawRect(0, 0, 100, -20);

const dropInfoText = new createjs.Text("Une seule goutte", "12px Quicksand", 'rgb(132, 219, 255)');
dropInfoText.x = 60;
dropInfoText.y = 329;
dropInfoText.textBaseline = 'middle';
dropInfoText.textAlign = 'center';

function displayDropInfo() {
    /*
        Affiche l'infobulle pour le bouton "Une seule goutte".
    */
    setupStage.addChild(dropInfo);
    setupStage.addChild(dropInfoText);
    setupStage.update();
}

function hideDropInfo() {
    /*
        Cache l'infobulle pour le bouton "Une seule goutte".
    */
    setupStage.removeChild(dropInfo);
    setupStage.removeChild(dropInfoText);
    setupStage.update();
}





//==============================
//            Graphe
//==============================

const plotCanvas = document.getElementById("plot");

const plotStage = new createjs.Stage(plotCanvas);
plotStage.enableMouseOver();
createjs.Touch.enable(plotStage);
plotStage.mouseMoveOutside = true;

const plotContainer = new createjs.Container();
plotStage.addChild(plotContainer);
plotContainer.x = 50;
plotContainer.y = 410;



// ===== Titre =====

const plotTitle = new createjs.Text("Évolution des quantités de matière en fonction du volume versé de solution titrante", "16px Quicksand");
plotContainer.addChild(plotTitle);
plotTitle.x = 0.5 * plotCanvas.width - plotContainer.x;
plotTitle.y = -390;
plotTitle.lineWidth = 0.9 * plotCanvas.width;
plotTitle.textAlign = 'center';



// ===== Axes =====

const plotAxes = new createjs.Shape();
plotContainer.addChild(plotAxes);
const volScale = 10;
let nScale = -1e2;


// légende abscisses
const volLegend = new createjs.Text("V (mL)", "15px Quicksand");
plotContainer.addChild(volLegend);
volLegend.x = 260;
volLegend.textBaseline = 'middle';
volLegend.textAlign = 'left';

// graduations
for (let V = 0; V < 25; V+=5) {
    let legend = new createjs.Text(V, "14px Quicksand");
    plotContainer.addChild(legend);
    legend.x = volScale * V;
    legend.y = 17;
    legend.textBaseline = 'middle';
    legend.textAlign = 'center';
}

// légende ordonnées
const nLegend = new createjs.Text("n (× 10⁻⁴ mol)", "15px Quicksand");
plotContainer.addChild(nLegend);
nLegend.x = -5;
nLegend.y = -330;
nLegend.textBaseline = 'middle';
nLegend.textAlign = 'left';

// légende graduations ordonnées
const nTicks = [];
for (let i = 0; i < 2; i++) {
    nTicks.push(new createjs.Text("", "15px Quicksand"));
    nTicks[i].x = -10;
    nTicks[i].y = -300/2 * (i+1);
    nTicks[i].textBaseline = 'middle';
    nTicks[i].textAlign = 'right';
}

function drawPlotAxes() {
    /*
        Dessine les axes du graphique.
    */
    plotAxes.graphics.clear();
    
    // tracé des axes
    plotAxes.graphics.ss(2, 1, 1).s('black');
    plotAxes.graphics.mt(0, 0).lt(250, 0);
    plotAxes.graphics.mt(245, 5).lt(250, 0).lt(245, -5);
    plotAxes.graphics.mt(0, 0).lt(0, -320);
    plotAxes.graphics.mt(-5, -315).lt(0, -320).lt(5, -315);
    
    // graduations volume
    for (let V = 0; V < 25; V+=5) {
        plotAxes.graphics.mt(volScale*V, 0).lt(volScale*V, 5);
    }
    
    // graduations quantité de matière
    for (let i = 1; i < 3; i++) {
        plotAxes.graphics.mt(0, nScale*i*nMax/2);
        plotAxes.graphics.lt(-5, nScale*i*nMax/2);
    }
}

function computeNMax() {
    /*
        Calcule la plus grande quantité de matière
        atteinte pendant le titrage.
    */
    if (Veq < 25) {
        nMax = Math.max(
            C0 * V0,
            C * (25-Veq),
            coeffProduct1/coeffTitrant*C*Veq,
            coeffProduct2/coeffTitrant*C*Veq,
        );
    } else {
        nMax = Math.max(
            C0 * V0,
            coeffProduct1/coeffTitrant*C*25,
            coeffProduct2/coeffTitrant*C*25,
        )
    }
}

function computeNScale() {
    /*
        Calcule l'échelle des axes :
        300 px doivent correspondre à la quantité de matière
        la plus élevée.
    */
    computeNMax();
    nScale = -300/nMax;
}

function addNTicks() {
    /*
        Trace l'échelle de quantité de matière.
    */
    if (volume == 0) {
        for (let i = 1; i < 3; i++) {
            nTicks[i-1].text = (i * nMax * 10 / 2).toLocaleString('fr-FR', {minimumFractionDigits: 2});
            plotContainer.addChild(nTicks[i-1]);
        }
        plotStage.update();
    }
}

function removeNTicks() {
    /*
        Supprime la légende des graduations de quantité de matière.
    */
    for (let i = 0; i < 2; i++) {
        plotContainer.removeChild(nTicks[i]);
        plotStage.update();
    }
}



// ===== Espèce titrée =====

const plotTitrated = new createjs.Shape();
plotStage.addChild(plotTitrated);
plotContainer.addChild(plotTitrated);

function drawPlotTitrated() {
    /*
        Trace la quantité restante de l'espèce titrée.
    */
    plotTitrated.graphics.clear();
    plotTitrated.graphics.ss(2, 1, 1).s('blue');
    plotTitrated.graphics.mt(0, C0 * V0 * nScale);
    if (volume < Veq) {
        plotTitrated.graphics.lt(volume*volScale, (C0*V0 - C*volume*coeffTitrated/coeffTitrant)*nScale);
    } else if (volume > Veq) {
        plotTitrated.graphics.lt(Veq*volScale, 0);
        plotTitrated.graphics.lt(volume*volScale, 0);
    }
}



// ===== Espèce titrante =====

const plotTitrant = new createjs.Shape();
plotStage.addChild(plotTitrant);
plotContainer.addChild(plotTitrant);

function drawPlotTitrant() {
    /*
        Trace la quantité restante de l'espèce titrante.
    */
    plotTitrant.graphics.clear();
    plotTitrant.graphics.ss(2, 1, 1).s('orange');
    plotTitrant.graphics.mt(0, 0);
    if (volume < Veq) {
        plotTitrant.graphics.lt(volume*volScale, 0);
    } else if (volume > Veq) {
        plotTitrant.graphics.lt(Veq*volScale, 0);
        plotTitrant.graphics.lt(volume*volScale, C*(volume-Veq)*nScale);
    }
}



// ===== Produit 1 =====

const plotProduct1 = new createjs.Shape();
plotStage.addChild(plotProduct1);
plotContainer.addChild(plotProduct1);

function drawPlotProduct1() {
    /*
        Trace la quantité du produit 1 dans l'erlenmeyer.
    */
    plotProduct1.graphics.clear();
    plotProduct1.graphics.ss(2, 1, 1).s('red');
    plotProduct1.graphics.mt(0, 0);
    if (volume < Veq) {
        plotProduct1.graphics.lt(volume*volScale, coeffProduct1/coeffTitrant*C*volume*nScale);
    } else if (volume > Veq) {
        plotProduct1.graphics.lt(Veq*volScale, coeffProduct1/coeffTitrant*C*Veq*nScale);
        plotProduct1.graphics.lt(volume*volScale, coeffProduct1/coeffTitrant*C*Veq*nScale);
    }
}



// ===== Produit 2 =====

const plotProduct2 = new createjs.Shape();
plotStage.addChild(plotProduct2);
plotContainer.addChild(plotProduct2);

function drawPlotProduct2() {
    /*
        Trace la quantité du produit 2 dans l'erlenmeyer.
    */
    plotProduct2.graphics.clear();
    plotProduct2.graphics.ss(2, 1, 1).s('green');
    plotProduct2.graphics.mt(0, 0);
    if (volume < Veq) {
        plotProduct2.graphics.lt(volume*volScale, coeffProduct2/coeffTitrant*C*volume*nScale);
    } else if (volume > Veq) {
        plotProduct2.graphics.lt(Veq*volScale, coeffProduct2/coeffTitrant*C*Veq*nScale);
        plotProduct2.graphics.lt(volume*volScale, coeffProduct2/coeffTitrant*C*Veq*nScale);
    }
}







//==============================
//          Animation
//==============================

function pour() {
    /*
        Mise à jour lors du versement de la solution titrante.
    */
    const deltaTime = 24;

    clearInterval(interval);
    interval = setInterval(animate, deltaTime);

    function animate() {
        if (volume >= 25) {
            clearInterval(interval);
            closeFaucet();
            faucet.removeEventListener("mousedown", openFaucet);
            dropButton.removeEventListener("mousedown", singleDrop);
            return;
        }
        volume += 0.05;
        update();
    }
}

function singleDrop() {
    /*
        Verse une seule goutte (0,05 mL) dans l'erlenmeyer.
    */
    
    // bloque l'utilisation du robinet pendant la chute de la goutte.
    faucet.removeEventListener("mousedown", openFaucet);
    dropButton.removeEventListener("mousedown", singleDrop);
    
    enableInputs(false);
    
    const deltaTime = 24;
    volume += 0.05;
    
    computeYTitrated();
    drawTitrant();
    writeTitrantVolume();
    drop.y = 360;
    setupStage.addChild(drop);

    clearInterval(interval);
    interval = setInterval(animate, deltaTime);
    
    function animate() {
        if (drop.y >= yTitrated) {
            clearInterval(interval);
            setupStage.removeChild(drop);
            updateQuantities();
            updatePlots();
            // drawTitrated();
            drawErlen();
            
            if (volume < 25) {
                faucet.addEventListener("mousedown", openFaucet);
                dropButton.addEventListener("mousedown", singleDrop);
            }
        }
        setupStage.removeChild(erlen);
        drop.y += 3;
        setupStage.addChild(erlen);
        setupStage.update();
    }
}

function updateQuantities() {
    /*
        Mise à jour des quantités de matière.
    */
    displayIniTitrant();
    displayNReactant1();
    displayNReactant2();
    displayNProduct1();
    displayNProduct2();
}

function updatePlots() {
    /*
        Mise à jour du graphe.
    */
    drawPlotTitrated();
    drawPlotTitrant();
    drawPlotProduct1();
    drawPlotProduct2();
    
    plotStage.update();
}

function update() {
    updateQuantities();
    updatePlots();
    
    // montage
    drawTitrant();
    writeTitrantVolume();
    drawErlen();
        
    // mise à jour
    setupStage.update();
}

let interval = null;





//==============================
//        Initialisation
//==============================

drawBuret();
drawFaucet();
drawTitrant();
drawDrop();
writeTitrantVolume();
drawErlen();

displayIniTitrated();
displayNReactant1();
displayNReactant2();
displayNProduct1();
displayNProduct2();

computeNScale();
drawPlotAxes();

setupStage.update();
plotStage.update();