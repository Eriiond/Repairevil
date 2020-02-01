export class InputManager {
    constructor(scene, callbacks) {
        this.keyDownSpace = false;

        scene.input.keyboard.on("keydown", function(event) {
            switch (event.code) {
                case "Space":
                    callbacks.onSpaceDown();
                    break;
                case "KeyA":
                    callbacks.onA();
                    break;
                case "KeyS":
                    callbacks.onS();
                    break;
                case "KeyD":
                    callbacks.onD();
                    break;
            }
        });
        scene.input.keyboard.on("keyup", function(event) {
            switch (event.code) {
                case "Space":
                    callbacks.onSpaceUp();
                    break;
            }
        });
    }
}
