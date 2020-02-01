export class ConnectionObject {
  constructor(model) {
    this.model = model;

    // this.sprite = this.add.sprite(0, 0, "planet");
    // this.sprite.setInteractive();
    // this.sprite.on("pointerup", this.onClick);
  }

  onClick() {
    console.log("!!!");
  }
}
