//==============================
//     Tracé des curseurs
//==============================

const lineLength = 300;

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
    text = new createjs.Text(valeur, "20px Quicksand", "#333");
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