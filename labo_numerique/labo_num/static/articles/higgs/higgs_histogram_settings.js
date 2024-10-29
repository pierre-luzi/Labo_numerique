const main = document.querySelector('main');
const mainWidth = main.clientWidth;

const numBins = 20;
const min = 100;
const max = 160;
const binSize = (max-min)/numBins;
let xBins = [];
for (let i = 0; i < numBins; i++) {
    xBins.push(min + (i+0.5)*binSize);
}

const nMax = 1400;
const nMaxCuts = 2300;
const yMax = -300;
const yMaxCuts = -300;
const yScale = yMax / nMax;
const yScaleCuts = yMaxCuts / nMaxCuts;
const nMaxSignal = 150;
const yMaxSignal = -35;
const yScaleSignal = yMaxSignal / nMaxSignal;

const xScale = 600 / (max-min);