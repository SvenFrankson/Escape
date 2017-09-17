class ActivablesManager {
    private instances: Map<BABYLON.AbstractMesh, Activable>;

    constructor() {
        this.instances = new Map<BABYLON.AbstractMesh, Activable>();
    }

    public getActivableForMesh(mesh: BABYLON.AbstractMesh): Activable {
        return this.instances.get(mesh);
    }

    public set(activable: Activable): void {
        this.instances.set(activable.target, activable);
    }
}