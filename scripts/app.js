class Main {
    constructor(canvasElement) {
        this.canvas = document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas, true);
        BABYLON.Engine.ShadersRepository = "./shaders/";
    }
    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.resize();
        let hemisphericLight = new BABYLON.HemisphericLight("Light", BABYLON.Vector3.Up(), this.scene);
        this.light = hemisphericLight;
        let freeCamera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 1.6, 0), this.scene);
        freeCamera.attachControl(this.canvas);
        this.scene.activeCamera = freeCamera;
        BABYLON.SceneLoader.ImportMesh("", "./data/level-1.babylon", "", this.scene);
    }
    animate() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        window.addEventListener("resize", () => {
            this.resize();
        });
    }
    resize() {
        this.engine.resize();
    }
}
window.addEventListener("DOMContentLoaded", () => {
    let game = new Main("render-canvas");
    game.createScene();
    game.animate();
});
