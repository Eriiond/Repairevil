export class InputManager {
    constructor(scene, callbacks) {
        this.keyDownSpace = false;

        scene.input.keyboard.on("keydown", function(event) {
            switch (event.code) {
                case "KeyA":
                    callbacks.onA();
                    break;
                case "KeyS":
                    callbacks.onS();
                    break;
                case "KeyD":
                    callbacks.onD();
                    break;
                case "KeyF":
                    callbacks.onF();
                    break;
                case "KeyC":
                    callbacks.onC();
                    break;
                case "KeyQ":
                    callbacks.onQ();
                    break;
                case "KeyW":
                    callbacks.onW();
                    break;
                case "KeyE":
                    callbacks.onE();
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
