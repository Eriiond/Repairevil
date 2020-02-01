const base_minSendPropability = 1;
const base_maxSendPropability = 100;

export class SpaceConnection {
  // startPlanet: Planet;
  // endPlanet: Planet;
  // sendPropbability: Number;

  constructor(startPlanet, endPlanet) {
    this.startPlanet = startPlanet;
    this.endPlanet = endPlanet;
    this.sendPorbability = generateProability();
  }

  generatePropability() {
    return getRandomArbitrary(base_minSendPropability, base_maxSendPropability);
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}