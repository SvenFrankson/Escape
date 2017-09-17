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
}