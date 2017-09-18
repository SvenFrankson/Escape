class Materials {

    private _scene: BABYLON.Scene;
    private _wall: BABYLON.StandardMaterial;
    public get wall(): BABYLON.StandardMaterial {
        if (!this._wall) {
            this._createWall();
        }
        return this._wall;
    }

    private _floor: BABYLON.StandardMaterial;
    public get floor(): BABYLON.StandardMaterial {
        if (!this._floor) {
            this._createFloor();
        }
        return this._floor;
    }

    private _skirting: BABYLON.StandardMaterial;
    public get skirting(): BABYLON.StandardMaterial {
        if (!this._skirting) {
            this._createSkirting();
        }
        return this._skirting;
    }

    private _vent: BABYLON.StandardMaterial;
    public get vent(): BABYLON.StandardMaterial {
        if (!this._vent) {
            this._createVent();
        }
        return this._vent;
    }

    private _sCrateTop: BABYLON.StandardMaterial;
    public get sCrateTop(): BABYLON.StandardMaterial {
        if (!this._sCrateTop) {
            this._createSCrateTop();
        }
        return this._sCrateTop;
    }

    private _sCrateBottom: BABYLON.StandardMaterial;
    public get sCrateBottom(): BABYLON.StandardMaterial {
        if (!this._sCrateBottom) {
            this._createSCrateBottom();
        }
        return this._sCrateBottom;
    }

    constructor(scene: BABYLON.Scene) {
        this._scene = scene;
    }

    private _createWall(): void {
        this._wall = new BABYLON.StandardMaterial("Wall", this._scene);
        this._wall.bumpTexture = new BABYLON.Texture("./data/wall-normal.png", this._scene);
        this._wall.ambientTexture = new BABYLON.Texture("./data/wall-ambient.png", this._scene);
        this._wall.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }

    private _createFloor(): void {
        this._floor = new BABYLON.StandardMaterial("Floor", this._scene);
        this._floor.diffuseTexture = new BABYLON.Texture("./data/floor-diffuse.png", this._scene);
        this._floor.bumpTexture = new BABYLON.Texture("./data/floor-normal.png", this._scene);
        this._floor.ambientTexture = new BABYLON.Texture("./data/floor-ambient.png", this._scene);
        this._floor.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }

    private _createSkirting(): void {
        this._skirting = new BABYLON.StandardMaterial("Skirting", this._scene);
        this._skirting.diffuseTexture = new BABYLON.Texture("./data/skirting-diffuse.png", this._scene);
        this._skirting.bumpTexture = new BABYLON.Texture("./data/skirting-normal.png", this._scene);
        this._skirting.ambientTexture = new BABYLON.Texture("./data/skirting-ambient.png", this._scene);
        this._skirting.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }

    private _createVent(): void {
        this._vent = new BABYLON.StandardMaterial("Vent", this._scene);
        this._vent.diffuseColor.copyFromFloats(1, 1, 1);
        this._vent.bumpTexture = new BABYLON.Texture("./data/vent-normal.png", this._scene);
        this._vent.ambientTexture = new BABYLON.Texture("./data/vent-ambient.png", this._scene);
        this._vent.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }

    private _createSCrateTop(): void {
        this._sCrateTop = new BABYLON.StandardMaterial("S-Crate-Top", this._scene);
        this._sCrateTop.diffuseColor = BABYLON.Color3.FromHexString("#f4b942");
        this._sCrateTop.bumpTexture = new BABYLON.Texture("./data/s-crate-top-normal.png", this._scene);
        this._sCrateTop.ambientTexture = new BABYLON.Texture("./data/s-crate-top-ambient.png", this._scene);
        this._sCrateTop.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }

    private _createSCrateBottom(): void {
        this._sCrateBottom = new BABYLON.StandardMaterial("S-Crate-Bottom", this._scene);
        this._sCrateBottom.diffuseColor = BABYLON.Color3.FromHexString("#f4b942");
        this._sCrateBottom.bumpTexture = new BABYLON.Texture("./data/s-crate-bottom-normal.png", this._scene);
        this._sCrateBottom.ambientTexture = new BABYLON.Texture("./data/s-crate-bottom-ambient.png", this._scene);
        this._sCrateBottom.specularColor.copyFromFloats(0.3, 0.3, 0.3);
    }
}