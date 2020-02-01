import { colors } from "./consts";

export class ConnectionObject {
  constructor(model) {
    this.model = model;

    // this.sprite = this.add.sprite(0, 0, "planet");
    // this.sprite.setInteractive();
    // this.sprite.on("pointerup", this.onClick);
  }

  draw(scene) {
    let [startX, startY] = this.model.startPlanet.getPosition();
    let [endX, endY] = this.model.endPlanet.getPosition();
    // const line = new Phaser.Geom.Line(100, 100, startX, startY, endX, endY);
    // graphics.strokeLineShape(line);
    scene.add
      .line(0, 0, startX, startY, endX, endY, colors.connectionColor, 0.5)
      .setOrigin(0, 0);
  }

  onClick() {}
}
