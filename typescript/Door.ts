class Door extends Activable {

    private isClosed: boolean = true;

    constructor(target: BABYLON.AbstractMesh) {
        super(target);
    }

    public closeAnimation: () => void = () => {};
    public openAnimation: () => void = () => {};
    public switch() {
        if (this.isClosed) {
            this.openAnimation();
            this.isClosed = false;
        } else if (!this.isClosed) {
            this.closeAnimation();
            this.isClosed = true;
        }
    }
}