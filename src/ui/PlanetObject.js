export default class PlanetObject {
  constructor(model, sprite) {
    this.model = model;
    this.sprite = sprite;

    this.sprite.setInteractive();
    this.sprite.on("pointerup", this.onClick, this.planet);
  }

  onClick() {
    console.log("!!!");
  }
}
