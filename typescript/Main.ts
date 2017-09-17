class Main {

    public canvas: HTMLCanvasElement;
    public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public light: BABYLON.Light;
    public camera: BABYLON.Camera;
    public activables: ActivablesManager;
    private _aimed: Activable;
    private get aimed(): Activable {
        return this._aimed;
    }
    private set aimed(a: Activable) {
        if (this.aimed && a !== this.aimed) {
            this.aimed.Unlit();
        }
        this._aimed = a;
        if (this.aimed) {
            this.aimed.Lit();
        }
    }

    constructor(canvasElement: string) {
        this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(this.canvas, true);
        BABYLON.Engine.ShadersRepository = "./shaders/";
    }

    createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);
        this.resize();

        let hemisphericLight: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("Light", BABYLON.Vector3.Up(), this.scene);
        this.light = hemisphericLight;

        let freeCamera: BABYLON.FreeCamera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 1.6, 0), this.scene);
        freeCamera.angularSensibility /= 2;
        freeCamera.inertia = 0;
        freeCamera.inputs.add(new EscapeFreeCameraMouseInput());
        freeCamera.attachControl(this.canvas);
        freeCamera.minZ = 0.1;
        this.camera = freeCamera;

        this.activables = new ActivablesManager();

        BABYLON.SceneLoader.ImportMesh(
            "",
            "./data/level-1.babylon",
            "",
            this.scene,
            (
                meshes, particleSystems, skeletons
            ) => {
                let switches: BABYLON.AbstractMesh[] = [];
                let doors: BABYLON.AbstractMesh[] = [];
                for (let i: number = 0; i < meshes.length; i++) {
                    if (meshes[i].name.startsWith("BoxDoorL")) {
                        this.activables.set(ActivableBuilder.LeftBoxDoorActivable(meshes[i]));
                    } else if (meshes[i].name.startsWith("BoxDoorR")) {
                        this.activables.set(ActivableBuilder.RightBoxDoorActivable(meshes[i]));
                    } else if (meshes[i].name.startsWith("Floor")) {
                        let floorMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("Floor", this.scene);
                        floorMaterial.diffuseTexture = new BABYLON.Texture("./data/floor-diffuse.png", this.scene);
                        floorMaterial.bumpTexture = new BABYLON.Texture("./data/floor-normal.png", this.scene);
                        floorMaterial.bumpTexture.invertZ = true;
                        floorMaterial.ambientTexture = new BABYLON.Texture("./data/floor-ambient.png", this.scene);
                        floorMaterial.specularColor.copyFromFloats(0.3, 0.3, 0.3);
                        meshes[i].material = floorMaterial;
                    } else if (meshes[i].name.startsWith("Door")) {
                        let index: number = parseInt(meshes[i].name.substring(4));
                        doors[index] = meshes[i];
                    } else if (meshes[i].name.startsWith("Switch")) {
                        let index: number = parseInt(meshes[i].name.substring(6));
                        switches[index] = meshes[i];
                    }
                }
                let count: number = Math.min(switches.length, doors.length);
                for (var i = 0; i < count; i++) {
                    if (doors[i] && switches[i]) {
                        let door = ActivableBuilder.SlidingDoorActivable(doors[i]);
                        let doorSwitch = ActivableBuilder.DoorSwitchActivable(switches[i], door);
                        this.activables.set(door);
                        this.activables.set(doorSwitch);
                    }
                }
            }
        );

        let firstClick = () => {
            this.engine.switchFullscreen(true);
            this.engine.resize();
            this.canvas.removeEventListener("pointerup", firstClick);
        }
        this.canvas.addEventListener("pointerup", firstClick);

        let testActivate = (eventData: BABYLON.PointerInfo, eventState: BABYLON.EventState) => {
            let pick: BABYLON.PickingInfo = this.scene.pick(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
            if (pick.hit) {
                let activable: Activable = this.activables.getActivableForMesh(pick.pickedMesh);
                if (activable) {
                    this.aimed = activable;
                    if (eventData.type === BABYLON.PointerEventTypes._POINTERDOWN) {
                        activable.onActivate();
                        eventState.skipNextObservers = true;
                    }
                }
                else {
                    this.aimed = undefined;
                }
            }
        }
        this.scene.onPointerObservable.add(testActivate, undefined, true);
    }

    public animate(): void {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.resize();
        });
    }

    public resize(): void {
        this.engine.resize();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let game: Main = new Main("render-canvas");
    game.createScene();
    game.animate();
});
