import { colors } from "../ui/consts";
import { OwnerDefault, OwnerPlayer, OwnerVirus } from "../model/Planet";

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
  init() {
    this.reset();
  }

  onClick() {}

  update() {}

  draw(selected) {
    let owner = this.model.getOwner();
    switch (owner) {
      case OwnerDefault: {
        this.sprite.tint = selected
          ? colors.selectedDefaultPlanetTint
          : colors.noTint;
        break;
      }
      case OwnerPlayer: {
        this.sprite.tint = selected
          ? colors.selectedPlayerPlanetTint
          : colors.playerPlanetTint;
        break;
      }
      case OwnerVirus: {
        this.sprite.tint = selected
          ? colors.selectedVirusPlanetTint
          : colors.virusPlanetTint;
        break;
      }
      default:
        throw new Error("unknown owner constant: ", owner);
    }
  }

  // reset() {
  //   let owner = this.model.getOwner();
  //   switch (owner) {
  //     case OwnerDefault: {
  //       this.sprite.tint = colors.noTint;
  //       break;
  //     }
  //     case OwnerPlayer: {
  //       this.sprite.tint = colors.playerPlanetTint;
  //       break;
  //     }
  //     case OwnerVirus: {
  //       this.sprite.tint = colors.virusPlanetTint;
  //       break;
  //     }
  //     default:
  //       throw new Error("unknown owner constant: ", owner);
  //   }
  // }
}
