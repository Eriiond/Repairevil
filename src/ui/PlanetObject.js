export class PlanetObject {
  constructor(model, sprite) {
    console.log("PlanetObject.contructor");
    this.model = model;

    this.sprite = sprite;
    this.sprite.setInteractive();
    this.sprite.on("pointerup", this.onClick);
  }

  onClick() {
    console.log("!!!");
  }
}
