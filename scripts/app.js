class Activable {
    constructor(target) {
        this.onActivate = () => { };
        this.target = target;
        console.log("Activable created for mesh " + target.name);
    }
    Lit() {
        this.target.outlineWidth = 0.01;
        this.target.outlineColor = BABYLON.Color3.FromHexString("#42d1f4");
        this.target.renderOutline = true;
    }
    Unlit() {
        this.target.renderOutline = false;
    }
}
class ActivableBuilder {
    static LeftBoxDoorActivable(target) {
        let door = new Door(target);
        door.openAnimation = () => {
            let k = 0;
            let step = () => {
                k++;
                door.target.rotation.y = Math.PI / 2 * k / 60;
                if (k >= 60) {
                    target.getScene().unregisterBeforeRender(step);
                }
            };
            target.getScene().registerBeforeRender(step);
        };
        door.closeAnimation = () => {
            let k = 60;
            let step = () => {
                k--;
                door.target.rotation.y = Math.PI / 2 * k / 60;
                if (k <= 0) {
                    target.getScene().unregisterBeforeRender(step);
                }
            };
            target.getScene().registerBeforeRender(step);
        };
        door.onActivate = () => {
            door.switch();
        };
        return door;
    }
    static RightBoxDoorActivable(target) {
        let door = new Door(target);
        door.openAnimation = () => {
            let k = 0;
            let step = () => {
                k++;
                door.target.rotation.y = -Math.PI / 2 * k / 60;
                if (k >= 60) {
                    target.getScene().unregisterBeforeRender(step);
                }
            };
            target.getScene().registerBeforeRender(step);
        };
        door.closeAnimation = () => {
            let k = 60;
            let step = () => {
                k--;
                door.target.rotation.y = -Math.PI / 2 * k / 60;
                if (k <= 0) {
                    target.getScene().unregisterBeforeRender(step);
                }
            };
            target.getScene().registerBeforeRender(step);
        };
        door.onActivate = () => {
            door.switch();
        };
        return door;
    }
    static SlidingDoorActivable(target) {
        let door = new Door(target);
        let direction = BABYLON.Vector3.Zero();
        target.getDirectionToRef(BABYLON.Axis.X, direction);
        direction.scaleInPlace(1 / 60);
        door.openAnimation = () => {
            let k = 0;
            let step = () => {
                k++;
                door.target.position.addInPlace(direction);
                if (k >= 60) {
                    target.getScene().unregisterBeforeRender(step);
                }
            };
            target.getScene().registerBeforeRender(step);
        };
        door.closeAnimation = () => {
            let k = 0;
            let step = () => {
                k++;
                door.target.position.addInPlace(direction.scale(-1));
                if (k >= 60) {
                    target.getScene().unregisterBeforeRender(step);
                }
            };
            target.getScene().registerBeforeRender(step);
        };
        return door;
    }
    static DoorSwitchActivable(target, door) {
        let doorSwitch = new Activable(target);
        doorSwitch.onActivate = () => {
            door.switch();
        };
        return doorSwitch;
    }
}
class ActivablesManager {
    constructor() {
        this.instances = new Map();
    }
    getActivableForMesh(mesh) {
        return this.instances.get(mesh);
    }
    set(activable) {
        this.instances.set(activable.target, activable);
    }
}
class Door extends Activable {
    constructor(target) {
        super(target);
        this.isClosed = true;
        this.closeAnimation = () => { };
        this.openAnimation = () => { };
    }
    switch() {
        if (this.isClosed) {
            this.openAnimation();
            this.isClosed = false;
        }
        else if (!this.isClosed) {
            this.closeAnimation();
            this.isClosed = true;
        }
    }
}
class EscapeFreeCameraMouseInput {
    constructor(touchEnabled = true) {
        this.touchEnabled = touchEnabled;
        this._move = false;
        this._localZ = BABYLON.Vector3.Zero();
        this._deltaPos = BABYLON.Vector3.Zero();
    }
    attachControl(element, noPreventDefault) {
        if (!this._pointerInput) {
            this._pointerInput = (p, s) => {
                var evt = p.event;
                if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                    this._move = true;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                        element.focus();
                    }
                }
                else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
                    this._move = false;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
        }
        this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP);
    }
    checkInputs() {
        if (this._move) {
            this.camera.getDirectionToRef(BABYLON.Axis.Z, this._localZ);
            this._localZ.y = 0;
            this._deltaPos.copyFrom(this._localZ);
            this._deltaPos.scaleInPlace(2 * this.camera.getEngine().getDeltaTime() / 1000);
            this.camera.position.addInPlace(this._deltaPos);
        }
    }
    detachControl(element) {
        if (this._observer && element) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            this._observer = null;
        }
    }
    getClassName() {
        return "EscapeFreeCameraMouseInput";
    }
    getSimpleName() {
        return "escapePointer";
    }
}
BABYLON.CameraInputTypes["FreeCameraMouseInput"] = EscapeFreeCameraMouseInput;
class Main {
    get aimed() {
        return this._aimed;
    }
    set aimed(a) {
        if (this.aimed && a !== this.aimed) {
            this.aimed.Unlit();
        }
        this._aimed = a;
        if (this.aimed) {
            this.aimed.Lit();
        }
    }
    constructor(canvasElement) {
        Main.instance = this;
        this.canvas = document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas, true);
        BABYLON.Engine.ShadersRepository = "./shaders/";
    }
    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.resize();
        let pointLightRoom1 = new BABYLON.PointLight("Light", new BABYLON.Vector3(0, 2.1, 0), this.scene);
        pointLightRoom1.intensity = 0.3;
        pointLightRoom1.radius = 4;
        this.light1 = pointLightRoom1;
        let pointLightRoom2 = new BABYLON.PointLight("Light", new BABYLON.Vector3(-1.5, 2.6, -4.5), this.scene);
        pointLightRoom2.intensity = 0.7;
        pointLightRoom2.radius = 6;
        this.light2 = pointLightRoom2;
        let freeCamera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 1.6, 0), this.scene);
        freeCamera.angularSensibility /= 2;
        freeCamera.inertia = 0;
        freeCamera.inputs.add(new EscapeFreeCameraMouseInput());
        freeCamera.attachControl(this.canvas);
        freeCamera.minZ = 0.1;
        this.camera = freeCamera;
        this.activables = new ActivablesManager();
        this.materials = new Materials(this.scene);
        BABYLON.SceneLoader.ImportMesh("", "./data/level-1.babylon", "", this.scene, (meshes, particleSystems, skeletons) => {
            let switches = [];
            let doors = [];
            for (let i = 0; i < meshes.length; i++) {
                if (meshes[i].name.startsWith("BoxDoorL")) {
                    this.activables.set(ActivableBuilder.LeftBoxDoorActivable(meshes[i]));
                }
                else if (meshes[i].name.startsWith("BoxDoorR")) {
                    this.activables.set(ActivableBuilder.RightBoxDoorActivable(meshes[i]));
                }
                else if (meshes[i].name.startsWith("Floor")) {
                    meshes[i].material = this.materials.floor;
                }
                else if (meshes[i].name.startsWith("Walls")) {
                    meshes[i].material = this.materials.wall;
                }
                else if (meshes[i].name.startsWith("Skirting")) {
                    meshes[i].material = this.materials.skirting;
                }
                else if (meshes[i].name.startsWith("Vent")) {
                    meshes[i].material = this.materials.vent;
                }
                else if (meshes[i].name.startsWith("Door")) {
                    let index = parseInt(meshes[i].name.substring(4));
                    doors[index] = meshes[i];
                    let m = meshes[i];
                    if (m instanceof BABYLON.Mesh) {
                        for (var j = 0; j < m.instances.length; j++) {
                            index = parseInt(m.instances[j].name.substring(4));
                            doors[index] = m.instances[j];
                        }
                    }
                }
                else if (meshes[i].name.startsWith("Switch")) {
                    let index = parseInt(meshes[i].name.substring(6));
                    switches[index] = meshes[i];
                    let m = meshes[i];
                    if (m instanceof BABYLON.Mesh) {
                        for (var j = 0; j < m.instances.length; j++) {
                            index = parseInt(m.instances[j].name.substring(6));
                            switches[index] = m.instances[j];
                        }
                    }
                }
            }
            let count = Math.min(switches.length, doors.length);
            for (var i = 0; i < count; i++) {
                if (doors[i] && switches[i]) {
                    let door = ActivableBuilder.SlidingDoorActivable(doors[i]);
                    let doorSwitch = ActivableBuilder.DoorSwitchActivable(switches[i], door);
                    this.activables.set(door);
                    this.activables.set(doorSwitch);
                }
            }
        });
        let firstClick = () => {
            this.engine.switchFullscreen(true);
            this.engine.resize();
            this.canvas.removeEventListener("pointerup", firstClick);
        };
        this.canvas.addEventListener("pointerup", firstClick);
        let testActivate = (eventData, eventState) => {
            let pick = this.scene.pick(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
            if (pick.hit) {
                let activable = this.activables.getActivableForMesh(pick.pickedMesh);
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
        };
        this.scene.onPointerObservable.add(testActivate, undefined, true);
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
class Materials {
    get wall() {
        if (!this._wall) {
            this._createWall();
        }
        return this._wall;
    }
    get floor() {
        if (!this._floor) {
            this._createFloor();
        }
        return this._floor;
    }
    get skirting() {
        if (!this._skirting) {
            this._createSkirting();
        }
        return this._skirting;
    }
    get vent() {
        if (!this._vent) {
            this._createVent();
        }
        return this._vent;
    }
    constructor(scene) {
        this._scene = scene;
    }
    _createWall() {
        this._wall = new BABYLON.StandardMaterial("Wall", this._scene);
        this._wall.bumpTexture = new BABYLON.Texture("./data/wall-normal.png", this._scene);
        this._wall.ambientTexture = new BABYLON.Texture("./data/wall-ambient.png", this._scene);
        this._wall.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }
    _createFloor() {
        this._floor = new BABYLON.StandardMaterial("Floor", this._scene);
        this._floor.diffuseTexture = new BABYLON.Texture("./data/floor-diffuse.png", this._scene);
        this._floor.bumpTexture = new BABYLON.Texture("./data/floor-normal.png", this._scene);
        this._floor.ambientTexture = new BABYLON.Texture("./data/floor-ambient.png", this._scene);
        this._floor.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }
    _createSkirting() {
        this._skirting = new BABYLON.StandardMaterial("Skirting", this._scene);
        this._skirting.diffuseTexture = new BABYLON.Texture("./data/skirting-diffuse.png", this._scene);
        this._skirting.bumpTexture = new BABYLON.Texture("./data/skirting-normal.png", this._scene);
        this._skirting.ambientTexture = new BABYLON.Texture("./data/skirting-ambient.png", this._scene);
        this._skirting.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }
    _createVent() {
        this._vent = new BABYLON.StandardMaterial("Vent", this._scene);
        this._vent.diffuseColor.copyFromFloats(0.9, 0.9, 0.9);
        this._vent.bumpTexture = new BABYLON.Texture("./data/vent-normal.png", this._scene);
        this._vent.ambientTexture = new BABYLON.Texture("./data/vent-ambient.png", this._scene);
        this._vent.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }
}
