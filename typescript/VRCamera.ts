class VRCamera extends BABYLON.FreeCamera {
    
    public speed: number = 2;

    private _forward: boolean = false;

    constructor(name: string, position: BABYLON.Vector3, scene: BABYLON.Scene) {
        super(name, position, scene);
        scene.registerBeforeRender(this._update);
    }

    public attachControl(canvas: HTMLCanvasElement): void {
        canvas.addEventListener("pointerdown", this._pointerdown);
        canvas.addEventListener("pointerup", this._pointerup);
    }

    private _pointerdown = () => {
        this._forward = true;
    }

    private _pointerup = () => {
        this._forward = false;
    }

    private _localZ: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private _deltaPos: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private _update = () => {
        if (this._forward) {
            this.getDirectionToRef(BABYLON.Axis.Z, this._localZ);
            this._localZ.y = 0;
            this._deltaPos.copyFrom(this._localZ);
            this._deltaPos.scaleInPlace(this.speed * this.getEngine().getDeltaTime() / 1000);
        }
    }
}