class Activable {
    public target: BABYLON.AbstractMesh;
    public onActivate = () => {};

    constructor(target: BABYLON.AbstractMesh) {
        this.target = target;
        console.log("Activable created for mesh " + target.name);
    }

    public Lit() {
        this.target.outlineWidth = 0.01;
        this.target.outlineColor = BABYLON.Color3.FromHexString("#42d1f4");
        this.target.renderOutline = true;
    }

    public Unlit() {
        this.target.renderOutline = false;
    }
}