import * as fz from "../converters/fromZigbee";
import * as exposes from "../lib/exposes";
import * as m from "../lib/modernExtend";
import * as tuya from "../lib/tuya";
import type {DefinitionWithExtend, Fz} from "../lib/types";

const e = exposes.presets;

// The Paulmann 501.41 remote sends a command for when a color temperature
// button is released after having been long-pressed. It sends a 5-byte
// frame. The third byte being set to 0x47 seems to indicate that the
// button long-press is over. When the default parser tries to parse
// the 5-bytes frame, this results in:
//
//   Failed to parse frame: RangeError [ERR_OUT_OF_RANGE]: The value of "offset" is out of range. It must be >= 0 and <= 4. Received 5
//
// Add a custom command parser to work around this.
const fzLocal = {
    paulmann50141ColorTemperatureStopCommand: {
        cluster: "lightingColorCtrl",
        type: "raw",
        convert: (model, msg, publish, options, meta) => {
            if (msg.data.length === 5 && msg.data[2] === 0x47) {
                return {
                    action: "color_temperature_move_stop",
                };
            }
        },
    } satisfies Fz.Converter,
};

export const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ["501.37"],
        model: "501.37",
        vendor: "Paulmann",
        description: "Smart switch 4 buttons white",
        fromZigbee: [fz.command_on, fz.command_off, fz.battery, fz.command_move, fz.command_stop],
        toZigbee: [],
        exposes: [
            e.battery(),
            e.action([
                "on_1",
                "off_1",
                "on_2",
                "off_2",
                "brightness_move_up_1",
                "brightness_move_down_1",
                "brightness_move_stop_1",
                "brightness_move_up_2",
                "brightness_move_down_2",
                "brightness_move_stop_2",
            ]),
        ],
        meta: {multiEndpoint: true},
    },
    {
        zigbeeModel: ["501.34"],
        model: "501.34",
        vendor: "Paulmann",
        description: "Smart switch 4 buttons white",
        fromZigbee: [fz.command_on, fz.command_off, fz.battery, fz.command_move, fz.command_stop],
        toZigbee: [],
        exposes: [
            e.battery(),
            e.action([
                "on_1",
                "off_1",
                "on_2",
                "off_2",
                "brightness_move_up_1",
                "brightness_move_down_1",
                "brightness_stop_1",
                "brightness_move_up_2",
                "brightness_move_down_2",
                "brightness_stop_2",
            ]),
        ],
        meta: {multiEndpoint: true},
    },
    {
        zigbeeModel: ["H036-0500"],
        model: "968.93",
        vendor: "Paulmann",
        description: "URail rail adapter smart home Zigbee on/off/dimm",
        extend: [m.light()],
    },
    {
        fingerprint: [{modelID: "RGBW", manufacturerName: "Paulmann Licht GmbH"}],
        model: "948.47/29165",
        vendor: "Paulmann",
        description: "RGBW light",
        extend: [m.light({colorTemp: {range: [153, 454]}, color: {modes: ["xy", "hs"]}})],
    },
    {
        zigbeeModel: ["H036-0007"],
        model: "929.66",
        vendor: "Paulmann",
        description: "Smart home Zigbee LED module coin 1x2.5W RGBW",
        extend: [m.light({colorTemp: {range: undefined}, color: {modes: ["xy", "hs"]}})],
    },
    {
        zigbeeModel: ["Switch Controller"],
        model: "50043",
        vendor: "Paulmann",
        description: "SmartHome Zigbee Cephei Switch Controller",
        extend: [m.onOff()],
    },
    {
        zigbeeModel: ["50131"],
        model: "501.31",
        vendor: "Paulmann",
        description: "Smart plug for Euro- and Schuko-sockets",
        extend: [m.onOff()],
    },
    {
        zigbeeModel: ["Dimmablelight"],
        model: "50044/50045",
        vendor: "Paulmann",
        description: "SmartHome Zigbee Dimmer or LED-stripe",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["500.47"],
        model: "500.47",
        vendor: "Paulmann",
        description: "SmartHome Zigbee MaxLED RGBW controller max. 72W 24V DC",
        extend: [m.light({colorTemp: {range: undefined}, color: {modes: ["xy", "hs"], applyRedFix: true}})],
    },
    {
        zigbeeModel: ["RGBW light", "500.49", "RGBW_light"],
        model: "50049/500.63",
        vendor: "Paulmann",
        description: "Smart Home Zigbee YourLED RGB Controller max. 60W / Smart Home Zigbee LED Reflektor 3,5W GU10 RGBW dimmbar",
        extend: [m.light({colorTemp: {range: undefined}, color: {modes: ["xy", "hs"], applyRedFix: true}})],
    },
    {
        zigbeeModel: ["RGBCW_LIGHT"],
        model: "4137",
        vendor: "Paulmann",
        description: "Smart Home Zigbee LED bulb 9,3W Matt E27 RGBW",
        extend: [m.light({colorTemp: {range: [153, 370]}, color: {modes: ["xy", "hs"]}})],
    },
    {
        fingerprint: [{modelID: "RGBW Controller", manufacturerName: "Paulmann Licht"}],
        model: "94191",
        vendor: "Paulmann",
        description: "Plug & shine LED strip",
        extend: [m.light({colorTemp: {range: [153, 370]}, color: {modes: ["xy", "hs"]}})],
    },
    {
        fingerprint: [
            {modelID: "CCT Light", manufacturerName: "Paulmann lamp"},
            {modelID: "CCT", manufacturerName: "Paulmann Licht GmbH"},
        ],
        zigbeeModel: ["CCT light", "CCT_light", "CCT light "],
        model: "50064",
        vendor: "Paulmann",
        description: "SmartHome led spot",
        extend: [m.light({colorTemp: {range: undefined}})],
    },
    {
        zigbeeModel: ["H036-0006"],
        model: "929.63",
        vendor: "Paulmann",
        description: "SmartHome Zigbee LED-Modul Coin 1x6W Tunable White",
        extend: [m.light({colorTemp: {range: undefined}})],
    },
    {
        zigbeeModel: ["500.46"],
        model: "500.46",
        vendor: "Paulmann",
        description: "SmartHome Zigbee MaxLED tunable white controller max. 144W / 24V DC",
        extend: [m.light({colorTemp: {range: [153, 370]}})],
    },
    {
        zigbeeModel: ["H036-0005"],
        model: "929.60",
        vendor: "Paulmann",
        description: "SmartHome Zigbee LED-Modul Coin 1x6W White",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["371000001"],
        model: "371000001",
        vendor: "Paulmann",
        description: "SmartHome led spot tuneable white",
        extend: [m.light({colorTemp: {range: undefined}})],
    },
    {
        fingerprint: [{modelID: "RGBW", manufacturerName: "Paulmann Licht"}],
        zigbeeModel: ["371000002"],
        model: "371000002",
        vendor: "Paulmann",
        description: "Amaris LED panels",
        extend: [m.light({colorTemp: {range: undefined}, color: {modes: ["xy", "hs"]}})],
    },
    {
        zigbeeModel: ["371050043"],
        model: "371050043",
        vendor: "Paulmann",
        description: "Solar LED house number light",
        extend: [m.onOff({powerOnBehavior: false})],
    },
    {
        zigbeeModel: ["371232040"],
        model: "371232040",
        vendor: "Paulmann",
        description: "LED panels",
        extend: [m.light({colorTemp: {range: [153, 350]}, color: {modes: ["xy", "hs"]}})],
    },
    {
        zigbeeModel: ["500.43"],
        model: "500.43",
        vendor: "Paulmann",
        description: "SmartHome controller (Relay)",
        extend: [m.onOff({powerOnBehavior: false})],
    },
    {
        zigbeeModel: ["500.44"],
        model: "500.44",
        vendor: "Paulmann",
        description: "URail power supply",
        extend: [m.light({color: {applyRedFix: true}})],
    },
    {
        zigbeeModel: ["500.45"],
        model: "500.45",
        vendor: "Paulmann",
        description: "SmartHome Zigbee Pendulum Light Aptare",
        extend: [m.light({color: {applyRedFix: true}})],
    },
    {
        zigbeeModel: ["500.48"],
        model: "500.48",
        vendor: "Paulmann",
        description: "SmartHome Zigbee YourLED dim/switch controller max. 60 W",
        extend: [m.light({color: {applyRedFix: true}})],
    },
    {
        fingerprint: [{manufacturerName: "Paulmann Licht GmbH", modelID: "Dimmable"}],
        zigbeeModel: ["H036-0001"],
        model: "93999",
        vendor: "Paulmann",
        description: "Plug Shine Zigbee controller",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["RemoteControl", "50067"],
        model: "500.67",
        vendor: "Paulmann",
        description: "RGB remote control",
        fromZigbee: [
            fz.command_on,
            fz.command_off,
            fz.command_toggle,
            fz.command_step,
            fz.command_move_to_color_temp,
            fz.command_move_to_color,
            fz.command_stop,
            fz.command_move,
            fz.command_color_loop_set,
            fz.command_ehanced_move_to_hue_and_saturation,
            fz.tint_scene,
        ],
        toZigbee: [],
        exposes: [
            e.action([
                "on",
                "off",
                "toggle",
                "brightness_step_up",
                "brightness_step_down",
                "color_temperature_move",
                "color_move",
                "brightness_stop",
                "brightness_move_down",
                "brightness_move_up",
                "color_loop_set",
                "enhanced_move_to_hue_and_saturation",
                "scene_*",
            ]),
        ],
    },
    {
        zigbeeModel: ["501.40"],
        model: "501.40",
        vendor: "Paulmann",
        description: "RGB remote control",
        extend: [
            m.deviceEndpoints({endpoints: {"1": 1, "2": 2, "3": 3, "4": 4}}),
            m.battery(),
            m.commandsOnOff(),
            m.commandsLevelCtrl(),
            m.commandsColorCtrl(),
            m.commandsScenes(),
        ],
    },
    {
        zigbeeModel: ["50141"],
        model: "501.41",
        vendor: "Paulmann Licht GmbH",
        description: "Remote control Smart Home Zigbee 3.0 White",
        fromZigbee: [fzLocal.paulmann50141ColorTemperatureStopCommand],
        extend: [
            m.battery({percentageReporting: false}),
            m.commandsOnOff({
                commands: ["on", "off"],
            }),
            m.commandsLevelCtrl({
                commands: ["brightness_move_up", "brightness_move_down", "brightness_stop", "brightness_step_up", "brightness_step_down"],
            }),
            m.commandsColorCtrl({
                commands: [
                    "color_temperature_move_up",
                    "color_temperature_move_down",
                    "color_temperature_move_stop",
                    "color_temperature_step_up",
                    "color_temperature_step_down",
                ],
            }),
            m.commandsScenes({commands: ["store", "recall"]}),
        ],
    },
    {
        fingerprint: [{modelID: "RGB", manufacturerName: "Paulmann Licht GmbH"}],
        model: "150257",
        vendor: "Paulmann",
        description: "SimpLED SmartHome dimmable RGB LED-stripe",
        extend: [m.light({color: true})],
    },
    {
        fingerprint: [
            {modelID: "Dimmable Light", manufacturerName: "Paulmann lamp"},
            {modelID: "Dimmable Light ", manufacturerName: "Paulmann lamp "},
        ],
        model: "501.22",
        vendor: "Paulmann",
        description: "White E27 LED bulb, dimmable",
        extend: [m.light()],
    },
    {
        zigbeeModel: ["RGBWW"],
        model: "291.52",
        vendor: "Paulmann",
        description: "Smart Home Zigbee LED bulb 4,9W Matt E14 RGBW",
        extend: [m.light({colorTemp: {range: [153, 454]}, color: {modes: ["xy", "hs"]}})],
    },
    {
        fingerprint: tuya.fingerprint("TS000F", ["_TZ3210_hjxqqofs\u0000"]),
        model: "501.39",
        vendor: "Paulmann",
        description: "Universal-switch white",
        extend: [m.onOff({powerOnBehavior: false})],
    },
    {
        zigbeeModel: ["371222402"],
        model: "371222402",
        vendor: "Paulmann",
        description: "Puric pane pendant light 6x6W dimmable",
        extend: [m.light()],
    },
];
