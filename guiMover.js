import Settings from "./config";
import { tpsestimator } from "./config";

export function initiateGuiMover() {
    //selection
    let isTimerSelected = false;
    function clickFunc(mouseX, mouseY) {
        if (
            mouseX > tpsestimator.tpsDisplay.getRenderX() - 2 && mouseX < tpsestimator.tpsDisplay.getRenderX() + tpsestimator.tpsDisplay.getWidth() + 2 &&
            mouseY > tpsestimator.tpsDisplay.getRenderY() - 1 && mouseY < tpsestimator.tpsDisplay.getRenderY() + (tpsestimator.tpsDisplay.getHeight() * 9 + tpsestimator.tpsDisplay.getHeight() * 2)
        ) {
            isTimerSelected = true;
            tpsestimator.tpsDisplay.setBackgroundColor(Renderer.color(255, 255, 255, 50));
        }
    }
    tpsestimator.tpsDisplay.setRenderLoc(Settings.x, Settings.y);

    function dragFunc(dx, dy) {
        if (isTimerSelected) {
            Settings.x += dx;
            Settings.y += dy;
            tpsestimator.tpsDisplay.setRenderLoc(Settings.x, Settings.y);
        }
    }

    function releaseFunc() {
        //event
        updateSetting("x", Settings.x);
        updateSetting("y", Settings.y);

        isTimerSelected = false;
        tpsestimator.tpsDisplay.setBackgroundColor(Renderer.color(0, 0, 0, 0));
    }

    register("dragged", dragFunc);
    tpsestimator.tpsgui.registerClicked(clickFunc);
    tpsestimator.tpsgui.registerMouseReleased(releaseFunc);
}

export function guiMover() {
    if (tpsestimator.tpsgui.isOpen()) {
        Renderer.drawRect(
            Renderer.color(0, 0, 0, 70),
            0,
            0,
            Renderer.screen.getWidth(),
            Renderer.screen.getHeight()
        );
    }
}

export function updateSetting(setting, value){
    let lineBuffer = "";
    let fileBuffer = "";
    let file = FileLib.read(configLocation);

    for (let i in file){
        if(file[i] !== "\n"){
            lineBuffer = lineBuffer.concat(file[i]);
        } else {
            if(lineBuffer.includes(setting)) {
                lineBuffer = `${lineBuffer.split(setting.charAt(0))[0]}${setting} = ${value}\r\n`;
                fileBuffer = fileBuffer.concat(lineBuffer);
                lineBuffer = "";
            } else {
                fileBuffer = fileBuffer.concat(lineBuffer+="\n");
                lineBuffer = "";
            }
        }
    }
    FileLib.write(configLocation, fileBuffer);
}

const configLocation = "./config/ChatTriggers/modules/TPSEstimator/config.toml";