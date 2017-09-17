class EscapeFreeCameraMouseInput implements BABYLON.ICameraInput<BABYLON.FreeCamera> {
    public camera: BABYLON.FreeCamera;

    private _move: boolean = false;
    private _pointerInput: (p: BABYLON.PointerInfo, s: BABYLON.EventState) => void;
    private _observer: BABYLON.Observer<BABYLON.PointerInfo>;

    constructor(public touchEnabled = true) {
    }           

    attachControl(element: HTMLElement, noPreventDefault?: boolean) {
        if (!this._pointerInput) {
            this._pointerInput = (p, s) => {
                var evt = <PointerEvent>p.event;

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
            }
        }

        this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP);
    }

    private _localZ: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private _deltaPos: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public checkInputs() {
        if (this._move) {
            this.camera.getDirectionToRef(BABYLON.Axis.Z, this._localZ);
            this._localZ.y = 0;
            this._deltaPos.copyFrom(this._localZ);
            this._deltaPos.scaleInPlace(2 * this.camera.getEngine().getDeltaTime() / 1000);
            this.camera.position.addInPlace(this._deltaPos);
        }
    }

    detachControl(element: HTMLElement) {
        if (this._observer && element) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            this._observer = null;
        }
    }

    getClassName(): string {
        return "EscapeFreeCameraMouseInput";
    }

    getSimpleName() {
        return "escapePointer";
    }      
}

BABYLON.CameraInputTypes["FreeCameraMouseInput"] = EscapeFreeCameraMouseInput;