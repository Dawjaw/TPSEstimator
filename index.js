import { tpsestimator } from "./config";
import Settings from "./config";
import { guiMover, initiateGuiMover } from "./guiMover";

// to open the config gui use the "openGUI" function
register("command", () => Settings.openGUI()).setName("tpsconfig");
register("command", () => Settings.openGUI()).setName("tpsestimator");

tpsestimator.tpsgui = new Gui();
tpsestimator.tpsDisplay = new Display()
    .setShouldRender(false)
    .setBackground('full')
    .setBackgroundColor(Renderer.color(0,0,0,0));

initiateGuiMover();
register('renderOverlay', guiMover);

let lastTime;
let lastAge = -1;

let MAX_TICKRATE = 20.0;
let MIN_TICKRATE = 0.0;
let tpsArray = [];

const reducer = (previousValue, currentValue) => previousValue + currentValue;

function clampTickrate(rate) {
    return Math.min(MAX_TICKRATE, Math.max(MIN_TICKRATE, rate));
}

let S03PacketTimeUpdate = Java.type("net.minecraft.network.play.server.S03PacketTimeUpdate").class.toString();

register('packetReceived', (packet, event) => {
    if (packet.class.toString().equals(S03PacketTimeUpdate) && World.isLoaded()) {
        // func_149365_d world time || func_149366_c total world time  ! method
        // field_149369_a total || world time field_149368_b ! field
        let age = packet.func_149365_d();
        let time = Date.now();

        if (lastAge === -1) {
            lastTime = time;
            lastAge = age;
            return;
        }

        let diffAge = age - lastAge;
        let diffTime = time - lastTime;

        lastAge = age;
        lastTime = time;

        let tps = diffAge / (diffTime / 1000.0);
        if (Number.isNaN(tps)) {
            return;
        }

        let tpsRounded = Math.round(tps * 100) / 100.0;

        if (tpsArray.length < Settings.tpsSlider) {
            tpsArray.push(clampTickrate(tpsRounded));
        } else if (tpsArray.length === Settings.tpsSlider) {
            tpsArray.shift();
            tpsArray.push(clampTickrate(tpsRounded));
        } else if (tpsArray.length > Settings.tpsSlider) {
            tpsArray = [];
        }

        let total = 0;
        for(let i = 0; i < tpsArray.length; i++) {
            total += tpsArray[i];
        }

        let avg = Math.round((tpsArray.slice(Math.max(0, tpsArray.length - 5)).reduce(reducer) / Math.min(5, Math.max(0, tpsArray.length))) * 100) / 100.0;
        let avg1m = Math.round((tpsArray.slice(Math.max(0, tpsArray.length - 60)).reduce(reducer) / Math.min(60, Math.max(0, tpsArray.length))) * 100) / 100.0;
        let last5m = Math.round((tpsArray.slice(Math.max(0, tpsArray.length - 300)).reduce(reducer) / Math.min(300, Math.max(0, tpsArray.length))) * 100) / 100.0;

        let formattedAvg = avg >= 18 ? `§a${avg}` : avg <= 18 & avg >= 10 ? `§e${avg}` : avg <= 10 ? `§4${avg}` : "?";
        let formattedAvg1m = avg1m >= 18 ? `§a${avg1m}` : avg1m <= 18 & avg1m >= 10 ? `§e${avg1m}` : avg1m <= 10 ? `§4${avg1m}` : "?";
        let formattedLast5m = last5m >= 18 ? `§a${last5m}` : last5m <= 18 & last5m >= 10 ? `§e${last5m}` : last5m <= 10 ? `§4${last5m}` : "?";

        tpsestimator.tps = `§65s: ${formattedAvg} §r| §61m: ${formattedAvg1m} §r| §65m: ${formattedLast5m}§r`;
    }
});

const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook");

register('packetReceived', (packet, event) => {
    if (packet instanceof S08PacketPlayerPosLook) {
        ChatLib.chat("§4Player was moved by the server!§r");
    }
});

register('tick', () => {
    if (!Settings.guiToggle) {
        tpsestimator.tpsDisplay.setShouldRender(false);
        return;
    }
    tpsestimator.tpsDisplay.setShouldRender(true);
    tpsestimator.tpsDisplay.setLine(0, new DisplayLine("§2TPS: §6" + tpsestimator.tps + "§r").setShadow(true))
})