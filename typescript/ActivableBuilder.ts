class ActivableBuilder {
    public static LeftBoxDoorActivable(target: BABYLON.AbstractMesh): Activable {
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

    public static RightBoxDoorActivable(target: BABYLON.AbstractMesh): Activable {
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
}