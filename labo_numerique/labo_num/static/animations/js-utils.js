//==============================
//     Tracé des curseurs
//==============================

let lineLength = 300;
let cursorFont = "20px Quicksand";

function cursorLine(x, y, stage) {
    /*
        Cette fonction trace une barre horizontale de longueur lineLength.
        La barre est tracée à la position (x, y).
        Arguments :
            - x : l'abscisse de la ligne ;
            - y : l'ordonnée de la ligne ;
            - stage : l'élément Stage dans lequel tracer la ligne.
    */
    line = new createjs.Shape();
    stage.addChild(line);
    line.graphics.ss(4, 1, 1).s('#333').mt(0, 0).lt(lineLength, 0);
    line.x = x;
    line.y = y;
    return line;
}

function cursorButton(color, x, y, stage) {
    /*
        Cette fonction trace un bouton à la position (x ,y).
        Arguments :
            - color : la couleur du bouton ;
            - x : l'abscisse de la ligne ;
            - y : l'ordonnée de la ligne ;
            - stage : l'élément Stage dans lequel tracer le boutton.
    */
    button = new createjs.Shape();
    stage.addChild(button)
    button.cursor = 'pointer';
    drawButton(button, color);
    button.shadow = new createjs.Shadow("#000", 4, 4, 5);
    button.x = x;
    button.y = y;
    return button
}

function drawButton(button, color) {
    /*
        Cette fonction dessine le bouton avec la couleur souhaitée.
        Arguments :
            - button : l'élément Shape représentant le bouton ;
            - color : la couleur souhaitée.
    */
    button.graphics.clear();
    button.graphics.f(color).dc(0, 0, 10).ef().es();
    button.parent.update();
}

function cursorText(valeur, x, y, stage) {
    /*
        Cette fonction crée un texte à la position (x, y).
    */
    text = new createjs.Text(valeur, cursorFont, "#333");
    text.x = x;
    text.y = y;
    text.textBaseline = "middle"
    stage.addChild(text);
    return text;
}





//==============================
//     Tracé de vecteurs
//==============================

function drawVector(shape, xstart, ystart, xend, yend, color, dashed=false) {
    /*
        Cette fonction trace, dans l'élément shape,
        un vecteur. L'élément shape doit être une instance
        de la classe Shape de CreateJS.
        Arguments :
            - xstart : abscisse de départ ;
            - ystart : ordonnée d'arrivée ;
            - xend : abscisse d'arrivée ;
            - yend : ordonnée d'arrivée ;
            - color : couleur ;
            - dashed : vrai si le vecteur est tracé en pointillés.
    */
    if (dashed) {
        shape.graphics.setStrokeDash([10,8]);
    } else {
        shape.graphics.setStrokeDash([1,0]);
    }
    shape.graphics.s(color);
    
    // tracé du corps du vecteur
    shape.graphics.mt(xstart, ystart).lt(xend, yend);
    
    // calcul de l'angle polaire du vecteur
    let angle = Math.atan((yend - ystart)/(xend - xstart));
    if (xend - xstart < 0) {
        angle = Math.PI + angle;
    }
    
    // tracé de l'extrémité fléchée
    shape.graphics.mt(xend, yend);
    shape.graphics.lt(
        xend + 10 * Math.cos(angle + 3/4 * Math.PI),
        yend + 10 * Math.sin(angle + 3/4 * Math.PI)
    );    
    shape.graphics.mt(xend, yend);
    shape.graphics.lt(
        xend + 10 * Math.cos(angle - 3/4 * Math.PI),
        yend + 10 * Math.sin(angle - 3/4 * Math.PI)
    );
}





//==============================
//     Couleurs spectrales
//==============================

function wavelengthToRGB(wavelength, gamma=0.8) {
    /*
        Cette fonction convertit une longueur d'onde 
        en une couleur au format RGB. La longueur d'onde
        doit être exprimée en nanomètres et comprise entre
        380 et 750 (789 THz - 400 THz).

        Based on code by Dan Bruton
        http://www.physics.sfasu.edu/astro/color/spectra.html
    */
    
    let R = 0.0;
    let G = 0.0;
    let B = 0.0;
    
    if (wavelength >= 380 && wavelength <= 440) {
        let attenuation = 0.3 + 0.7 * (wavelength - 380) / (440 - 380);
        R = ((-(wavelength - 440) / (440 - 380)) * attenuation) ** gamma;
        G = 0.0;
        B = (1.0 * attenuation) ** gamma;
    } else if (wavelength >= 440 && wavelength <= 490) {
        R = 0.0;
        G = ((wavelength - 440) / (490 - 440)) ** gamma;
        B = 1.0;
    } else if (wavelength >= 490 && wavelength <= 510) {
        R = 0.0;
        G = 1.0;
        B = (-(wavelength - 510) / (510 - 490)) ** gamma;
    } else if (wavelength >= 510 && wavelength <= 580) {
        R = ((wavelength - 510) / (580 - 510)) ** gamma;
        G = 1.0;
        B = 0.0;
    } else if (wavelength >= 580 && wavelength <= 645) {
        R = 1.0;
        G = (-(wavelength - 645) / (645 - 580)) ** gamma;
        B = 0.0;
    } else if (wavelength >= 645 && wavelength <= 750) {
        let attenuation = 0.3 + 0.7 * (750 - wavelength) / (750 - 645);
        R = (1.0 * attenuation) ** gamma;
        G = 0.0;
        B = 0.0;
    }
    
    return [R*255, G*255, B*255];
}