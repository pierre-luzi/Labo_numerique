let day = 0;
let time = 0;
let meanAnomaly = 0;
let trueAnomaly = 0;
let altitude = 0;

const rad = Math.PI/180;
const obliquity = 23.436170;
const equinoxTrueAnomaly = 77.02230;
const equinoxEarthRotation = 224.38;

let theta = trueAnomaly - equinoxTrueAnomaly;
let earthRotation = 0;

let latitude = 0;

function month(date) {
    months = [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre"
    ]
    return months[date.getMonth()];
}

function computeMeanAnomaly() {
    /*
        Calcule l'anomalie moyenne.
        Le 1er janvier 2024, elle vaut 357.30115°.
    */
    meanAnomaly = (357.30115 + 0.98560028 * day + time/86400)%360;
}

function computeTrueAnomaly() {
    trueAnomaly = meanAnomaly;
    trueAnomaly += 1.9148 * Math.sin(meanAnomaly * Math.PI/180);
    trueAnomaly += 0.0200 * Math.sin(2 * meanAnomaly * Math.PI/180);
    trueAnomaly += 0.0003 * Math.sin(3 * meanAnomaly * Math.PI/180);
    trueAnomaly = trueAnomaly%360;
}

function computeTheta() {
    theta = trueAnomaly - equinoxTrueAnomaly;
}

function computeEarthRotation() {
    /*
        Calcule l'angle de rotation de la Terre, mesuré au méridien
        de Greenwich, par rapport au repère équatorial.
        À l'équinoxe de printemps 2024, le 20 mars à 3h06 GMT,
        l'angle valait 79,129167°.
    */
    earthRotation = equinoxEarthRotation + 360/86164 * (day + time/86400 - 79.129167) * 86400;
    earthRotation = earthRotation%360;
}

function computeAltitude() {
    /*
        Calcule l'altitude du Soleil au jour et à l'heure indiqués.
    */
    altitude = Math.asin(
        Math.cos(theta*rad)*Math.cos(latitude*rad)*Math.cos(earthRotation*rad)
        + Math.sin(theta*rad)*Math.cos(obliquity*rad)*Math.cos(latitude*rad)*Math.sin(earthRotation*rad)
        + Math.sin(theta*rad)*Math.sin(obliquity*rad)*Math.sin(latitude*rad)
    );
}

function equationOfTime() {
    /*
        Calcule l'équation du temps pour le jour indiqué.
    */
    let B = 2 * Math.PI * (day-81)/365;
    return 7.678 * Math.sin(B + 1.374) - 9.87 * Math.sin(2*B);
}