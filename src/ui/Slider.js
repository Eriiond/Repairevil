import RawSlider from "phaser3-rex-plugins/plugins/slider.js";

export class Slider {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.previousValue = 0.25;
    }

    init(scene) {
        this.eventEmitter = scene.eventEmitter;

        this.img = scene.add.sprite(0, 0, "rect").setScale(2, 4);
        this.img.setDepth(1);
        this.slider = new RawSlider(this.img, {
            endPoints: [
                {
                    x: this.x,
                    y: this.y + this.height / 2,
                },
                {
                    x: this.x + this.width,
                    y: this.y + +this.height / 2,
                },
            ],
            value: 0.25,
        });

        this.graphic && this.graphic.clear();
        this.graphics = scene.add.graphics();
        this.line = this.graphics
            .lineStyle(this.height, 0xdddddd, 1)
            .strokePoints(this.slider.endPoints);

        this.text = scene.add.text(0, 0, "", {
            fontSize: "20px",
        });
    }

    update() {
        if (this.slider.value !== this.previousValue) {
            this.eventEmitter.emit(
                "changeSpreadRate",
                Math.min(this.slider.value, 0.99)
            );
            this.previousValue = this.slider.value;
        }
    }

    getValue() {
        return Math.min(this.slider.value, 0.99);
    }

    hide() {
        this.img.visible = false;
        this.line.visible = false;
    }

    show() {
        this.img.visible = true;
        this.line.visible = true;
    }
}
