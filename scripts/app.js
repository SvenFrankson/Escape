class Activable {
    constructor(target) {
        this.onActivate = () => { };
        this.target = target;
        console.log("Activable created for mesh " + target.name);
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
        freeCamera.angularSensibility *= 2;
        freeCamera.inputs.add(new EscapeFreeCameraMouseInput());
        freeCamera.attachControl(this.canvas);
        freeCamera.minZ = 0.1;
        this.camera = freeCamera;
        this.activables = new ActivablesManager();
        BABYLON.SceneLoader.ImportMesh("", "./data/level-1.babylon", "", this.scene, (meshes, particleSystems, skeletons) => {
            for (let i = 0; i < meshes.length; i++) {
                if (meshes[i].name.startsWith("BoxDoorL")) {
                    this.activables.set(ActivableBuilder.LeftBoxDoorActivable(meshes[i]));
                }
                else if (meshes[i].name.startsWith("BoxDoorR")) {
                    this.activables.set(ActivableBuilder.RightBoxDoorActivable(meshes[i]));
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
            if (eventData.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                let pick = this.scene.pick(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
                if (pick.hit) {
                    let activable = this.activables.getActivableForMesh(pick.pickedMesh);
                    if (activable) {
                        console.log("Activable activated for mesh " + pick.pickedMesh.name);
                        activable.onActivate();
                        eventState.skipNextObservers = true;
                    }
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
class VRCamera extends BABYLON.FreeCamera {
    constructor(name, position, scene) {
        super(name, position, scene);
        this.speed = 2;
        this._forward = false;
        this._pointerdown = () => {
            this._forward = true;
        };
        this._pointerup = () => {
            this._forward = false;
        };
        this._localZ = BABYLON.Vector3.Zero();
        this._deltaPos = BABYLON.Vector3.Zero();
        this._update = () => {
            if (this._forward) {
                this.getDirectionToRef(BABYLON.Axis.Z, this._localZ);
                this._localZ.y = 0;
                this._deltaPos.copyFrom(this._localZ);
                this._deltaPos.scaleInPlace(this.speed * this.getEngine().getDeltaTime() / 1000);
            }
        };
        scene.registerBeforeRender(this._update);
    }
    attachControl(canvas) {
        canvas.addEventListener("pointerdown", this._pointerdown);
        canvas.addEventListener("pointerup", this._pointerup);
    }
}
