export class PlanetObject {
  constructor(model, sprite) {
    this.model = model;

    this.sprite = sprite;
    this.sprite.setInteractive();
    this.sprite.on("pointerup", this.onClick);

    let [x, y] = this.model.getPosition();
    this.sprite.x = x;
    this.sprite.y = y;
  }

  onClick() {}

  update() {}
}
