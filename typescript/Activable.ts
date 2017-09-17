class Activable {
    public target: BABYLON.AbstractMesh;
    public onActivate = () => {};

    constructor(target: BABYLON.AbstractMesh) {
        this.target = target;
        console.log("Activable created for mesh " + target.name);
    }
}