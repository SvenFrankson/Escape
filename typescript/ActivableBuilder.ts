class ActivableBuilder {
    public static LeftBoxDoorActivable(target: BABYLON.AbstractMesh): Door {
        let door: Door = new Door(target);
        door.openAnimation = () => {
            let k: number = 0;
            let step = () => {
                k++;
                door.target.rotation.y = Math.PI / 2 * k / 60;
                if (k >= 60) {
                    target.getScene().unregisterBeforeRender(step);
                }
            }
            target.getScene().registerBeforeRender(step);
        }
        door.closeAnimation = () => {
            let k: number = 60;
            let step = () => {
                k--;
                door.target.rotation.y = Math.PI / 2 * k / 60;
                if (k <= 0) {
                    target.getScene().unregisterBeforeRender(step);
                }
            }
            target.getScene().registerBeforeRender(step);
        }
        door.onActivate = () => {
            door.switch();
        }

        return door;
    }

    public static RightBoxDoorActivable(target: BABYLON.AbstractMesh): Door {
        let door: Door = new Door(target);
        door.openAnimation = () => {
            let k: number = 0;
            let step = () => {
                k++;
                door.target.rotation.y = -Math.PI / 2 * k / 60;
                if (k >= 60) {
                    target.getScene().unregisterBeforeRender(step);
                }
            }
            target.getScene().registerBeforeRender(step);
        }
        door.closeAnimation = () => {
            let k: number = 60;
            let step = () => {
                k--;
                door.target.rotation.y = -Math.PI / 2 * k / 60;
                if (k <= 0) {
                    target.getScene().unregisterBeforeRender(step);
                }
            }
            target.getScene().registerBeforeRender(step);
        }
        door.onActivate = () => {
            door.switch();
        }

        return door;
    }

    public static SlidingDoorActivable(target: BABYLON.AbstractMesh): Door {
        let door: Door = new Door(target);
        let direction: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        target.getDirectionToRef(BABYLON.Axis.X, direction);
        direction.scaleInPlace(1/60);
        door.openAnimation = () => {
            let k: number = 0;
            let step = () => {
                k++;
                door.target.position.addInPlace(direction);
                if (k >= 60) {
                    target.getScene().unregisterBeforeRender(step);
                }
            }
            target.getScene().registerBeforeRender(step);
        }
        door.closeAnimation = () => {
            let k: number = 0;
            let step = () => {
                k++;
                door.target.position.addInPlace(direction.scale(-1));
                if (k >= 60) {
                    target.getScene().unregisterBeforeRender(step);
                }
            }
            target.getScene().registerBeforeRender(step);
        }

        return door;
    }

    public static DoorSwitchActivable(target: BABYLON.AbstractMesh, door: Door): Activable {
        let doorSwitch: Activable = new Activable(target);

        doorSwitch.onActivate = () => {
            door.switch();
        }

        return doorSwitch;
    }
}