const feynmanCanvas = document.getElementById("feynman_canvas");
feynmanCanvas.width = mainWidth;

const feynmanStage = new createjs.Stage(feynmanCanvas);
feynmanStage.enableMouseOver();
createjs.Touch.enable(feynmanStage);
feynmanStage.mouseMoveOutside = true;

const feynmanContainer = new createjs.Container();
feynmanStage.addChild(feynmanContainer);

const feynmanDiagram = new createjs.Shape();
feynmanContainer.addChild(feynmanDiagram);
feynmanContainer.x = mainWidth/2 - 270;
feynmanContainer.y = 60;



// ===== Boucle quarks top =====

// Higgs
feynmanDiagram.graphics.setStrokeDash([10,6]).s('red');
feynmanDiagram.graphics.mt(0, 0).lt(100, 0);
feynmanDiagram.graphics.setStrokeDash([]);

// boucle quarks top
feynmanDiagram.graphics.ss(2, 1, 1).s('green');
feynmanDiagram.graphics.mt(100, 0).lt(140, -40).lt(140, 40).lt(100, 0);

// photons
feynmanDiagram.graphics.s('orange');
drawPhoton(feynmanDiagram, 140, -40, 240, -40);
drawPhoton(feynmanDiagram, 140, 40, 240, 40);


// ===== Boucle bosons W =====

// Higgs
feynmanDiagram.graphics.setStrokeDash([10,6]).s('red');
feynmanDiagram.graphics.mt(300, 0).lt(400, 0);
feynmanDiagram.graphics.setStrokeDash([]);

// bosons bosons W
feynmanDiagram.graphics.s('rgb(100, 100, 230)');
drawPhoton(feynmanDiagram, 400, 0, 440, -40, 3, 1./25);
drawPhoton(feynmanDiagram, 440, -40, 440, 40, 3, 1./25);
drawPhoton(feynmanDiagram, 440, 40, 400, 0, 3, 1./25);

// photons
feynmanDiagram.graphics.s('orange');
drawPhoton(feynmanDiagram, 440, -40, 540, -40);
drawPhoton(feynmanDiagram, 440, 40, 540, 40);


let higgsText = [];
for (let i = 0; i < 2; i++) {
    higgsText.push(new createjs.Text("h", "16px Quicksand", 'red'));
    feynmanContainer.addChild(higgsText[i]);
    higgsText[i].x = -10 + i * 300;
    higgsText[i].textBaseline = 'middle';
    higgsText[i].textAlign = 'right';
}

let photonText = [];
for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
        photonText.push(new createjs.Text("γ", "16px Quicksand", 'orange'));
        feynmanContainer.addChild(photonText[i*2+j]);
        photonText[i*2+j].x = 250 + i * 300;
        photonText[i*2+j].y = j%2 == 0 ? -40 : 40;
        photonText[i*2+j].textBaseline = 'middle';
        photonText[i*2+j].textAlign = 'left';
    }
}

feynmanStage.update();


// Fonction pour dessiner des lignes ondulées (photons)
function drawPhoton(shape, x1, y1, x2, y2, amplitude=5, frequency=1./20) {
    let dx = (x2 - x1) / 100;
    let dy = (y2 - y1) / 100;
    // let amplitude = 3;
    // let frequency = 1./30;
    
    shape.graphics.mt(x1, y1);
    
    for (let i = 1; i <= 100; i++) {
        let x;
        let y;
        if (x1 != x2 && y1 != y2) {
            x = x1 + i * dx - (y2-y1)/(x2-x1) * Math.sin(i * frequency * 2 * Math.PI) * amplitude;
            y = y1 + i * dy + Math.sin(i * frequency * 2 * Math.PI) * amplitude;
        } else if (x1 == x2) {
            x = x1 + i * dx - Math.sin(i * frequency * 2 * Math.PI) * amplitude;
            y = y1 + i * dy;
        } else {
            x = x1 + i * dx;
            y = y1 + i * dy + Math.sin(i * frequency * 2 * Math.PI) * amplitude;
        }
        shape.graphics.lt(x, y);
    }
}
