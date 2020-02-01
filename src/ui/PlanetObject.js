export class PlanetObject {
  constructor(model, sprite) {
    console.log("PlanetObject.contructor");
    this.model = model;

    this.sprite = sprite;
    this.sprite.setInteractive();
    this.sprite.on("pointerup", this.onClick);

    let xPos = model.position % 24;
    let yPos = Math.floor(model.position / 24);
    this.sprite.x = xPos * 50 + 25;
    this.sprite.y = yPos * 50 + 25;
  }

  onClick() {
    console.log("!!!");
  }

  update() {}
}
