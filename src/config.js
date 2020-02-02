import Phaser from "phaser";

export default {
    type: Phaser.AUTO,
    parent: "content",
    width: 1600,
    height: 900,
    localStorageName: "repairevil",
    scale: {
        mode: Phaser.Scale.FIT,
    },
    dom: {
        createContainer: true,
    },
};
