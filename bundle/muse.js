'use strict';

var require$$0 = require('rxjs');
var require$$1 = require('rxjs/operators');

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var muse$1 = {};

var museParse = {};

Object.defineProperty(museParse, "__esModule", { value: true });
var operators_1$1 = require$$1;
function parseControl(controlData) {
    return controlData.pipe(operators_1$1.concatMap(function (data) { return data.split(''); }), operators_1$1.scan(function (acc, value) {
        if (acc.indexOf('}') >= 0) {
            return value;
        }
        else {
            return acc + value;
        }
    }, ''), operators_1$1.filter(function (value) { return value.indexOf('}') >= 0; }), operators_1$1.map(function (value) { return JSON.parse(value); }));
}
museParse.parseControl = parseControl;
function decodeUnsigned12BitData(samples) {
    var samples12Bit = [];
    // tslint:disable:no-bitwise
    for (var i = 0; i < samples.length; i++) {
        if (i % 3 === 0) {
            samples12Bit.push((samples[i] << 4) | (samples[i + 1] >> 4));
        }
        else {
            samples12Bit.push(((samples[i] & 0xf) << 8) | samples[i + 1]);
            i++;
        }
    }
    // tslint:enable:no-bitwise
    return samples12Bit;
}
museParse.decodeUnsigned12BitData = decodeUnsigned12BitData;
function decodeUnsigned24BitData(samples) {
    var samples24Bit = [];
    // tslint:disable:no-bitwise
    for (var i = 0; i < samples.length; i = i + 3) {
        samples24Bit.push((samples[i] << 16) | (samples[i + 1] << 8) | samples[i + 2]);
    }
    // tslint:enable:no-bitwise
    return samples24Bit;
}
museParse.decodeUnsigned24BitData = decodeUnsigned24BitData;
function decodeEEGSamples(samples) {
    return decodeUnsigned12BitData(samples).map(function (n) { return 0.48828125 * (n - 0x800); });
}
museParse.decodeEEGSamples = decodeEEGSamples;
function decodePPGSamples(samples) {
    // Decode data packet of one PPG channel.
    // Each packet is encoded with a 16bit timestamp followed by 6
    // samples with a 24 bit resolution.
    return decodeUnsigned24BitData(samples);
}
museParse.decodePPGSamples = decodePPGSamples;
function parseTelemetry(data) {
    // tslint:disable:object-literal-sort-keys
    return {
        sequenceId: data.getUint16(0),
        batteryLevel: data.getUint16(2) / 512,
        fuelGaugeVoltage: data.getUint16(4) * 2.2,
        // Next 2 bytes are probably ADC millivolt level, not sure
        temperature: data.getUint16(8),
    };
    // tslint:enable:object-literal-sort-keys
}
museParse.parseTelemetry = parseTelemetry;
function parseImuReading(data, scale) {
    function sample(startIndex) {
        return {
            x: scale * data.getInt16(startIndex),
            y: scale * data.getInt16(startIndex + 2),
            z: scale * data.getInt16(startIndex + 4),
        };
    }
    // tslint:disable:object-literal-sort-keys
    return {
        sequenceId: data.getUint16(0),
        samples: [sample(2), sample(8), sample(14)],
    };
    // tslint:enable:object-literal-sort-keys
}
function parseAccelerometer(data) {
    return parseImuReading(data, 0.0000610352);
}
museParse.parseAccelerometer = parseAccelerometer;
function parseGyroscope(data) {
    return parseImuReading(data, 0.0074768);
}
museParse.parseGyroscope = parseGyroscope;

var museUtils = {};

var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(museUtils, "__esModule", { value: true });
var rxjs_1 = require$$0;
var operators_1 = require$$1;
function decodeResponse(bytes) {
    return new TextDecoder().decode(bytes.subarray(1, 1 + bytes[0]));
}
museUtils.decodeResponse = decodeResponse;
function encodeCommand(cmd) {
    var encoded = new TextEncoder().encode("X" + cmd + "\n");
    encoded[0] = encoded.length - 1;
    return encoded;
}
museUtils.encodeCommand = encodeCommand;
function observableCharacteristic(characteristic) {
    return __awaiter(this, void 0, void 0, function () {
        var disconnected;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, characteristic.startNotifications()];
                case 1:
                    _a.sent();
                    disconnected = rxjs_1.fromEvent(characteristic.service.device, 'gattserverdisconnected');
                    return [2 /*return*/, rxjs_1.fromEvent(characteristic, 'characteristicvaluechanged').pipe(operators_1.takeUntil(disconnected), operators_1.map(function (event) { return event.target.value; }))];
            }
        });
    });
}
museUtils.observableCharacteristic = observableCharacteristic;

var zipSamples = {};

var hasRequiredZipSamples;

function requireZipSamples () {
	if (hasRequiredZipSamples) return zipSamples;
	hasRequiredZipSamples = 1;
	Object.defineProperty(zipSamples, "__esModule", { value: true });
	var rxjs_1 = require$$0;
	var operators_1 = require$$1;
	var muse_1 = requireMuse();
	function zipSamples$1(eegReadings) {
	    var buffer = [];
	    var lastTimestamp = null;
	    return eegReadings.pipe(operators_1.mergeMap(function (reading) {
	        if (reading.timestamp !== lastTimestamp) {
	            lastTimestamp = reading.timestamp;
	            if (buffer.length) {
	                var result = rxjs_1.from([buffer.slice()]);
	                buffer.splice(0, buffer.length, reading);
	                return result;
	            }
	        }
	        buffer.push(reading);
	        return rxjs_1.from([]);
	    }), operators_1.concat(rxjs_1.from([buffer])), operators_1.mergeMap(function (readings) {
	        var result = readings[0].samples.map(function (x, index) {
	            var data = [NaN, NaN, NaN, NaN, NaN];
	            for (var _i = 0, readings_1 = readings; _i < readings_1.length; _i++) {
	                var reading = readings_1[_i];
	                data[reading.electrode] = reading.samples[index];
	            }
	            return {
	                data: data,
	                index: readings[0].index,
	                timestamp: readings[0].timestamp + (index * 1000) / muse_1.EEG_FREQUENCY,
	            };
	        });
	        return rxjs_1.from(result);
	    }));
	}
	zipSamples.zipSamples = zipSamples$1;
	
	return zipSamples;
}

var zipSamplesPpg = {};

var hasRequiredZipSamplesPpg;

function requireZipSamplesPpg () {
	if (hasRequiredZipSamplesPpg) return zipSamplesPpg;
	hasRequiredZipSamplesPpg = 1;
	Object.defineProperty(zipSamplesPpg, "__esModule", { value: true });
	var rxjs_1 = require$$0;
	var operators_1 = require$$1;
	var muse_1 = requireMuse();
	function zipSamplesPpg$1(ppgReadings) {
	    var buffer = [];
	    var lastTimestamp = null;
	    return ppgReadings.pipe(operators_1.mergeMap(function (reading) {
	        if (reading.timestamp !== lastTimestamp) {
	            lastTimestamp = reading.timestamp;
	            if (buffer.length) {
	                var result = rxjs_1.from([buffer.slice()]);
	                buffer.splice(0, buffer.length, reading);
	                return result;
	            }
	        }
	        buffer.push(reading);
	        return rxjs_1.from([]);
	    }), operators_1.concat(rxjs_1.from([buffer])), operators_1.mergeMap(function (readings) {
	        var result = readings[0].samples.map(function (x, index) {
	            var data = [NaN, NaN, NaN];
	            for (var _i = 0, readings_1 = readings; _i < readings_1.length; _i++) {
	                var reading = readings_1[_i];
	                data[reading.ppgChannel] = reading.samples[index];
	            }
	            return {
	                data: data,
	                index: readings[0].index,
	                timestamp: readings[0].timestamp + (index * 1000) / muse_1.PPG_FREQUENCY,
	            };
	        });
	        return rxjs_1.from(result);
	    }));
	}
	zipSamplesPpg.zipSamplesPpg = zipSamplesPpg$1;
	
	return zipSamplesPpg;
}

var hasRequiredMuse;

function requireMuse () {
	if (hasRequiredMuse) return muse$1;
	hasRequiredMuse = 1;
	(function (exports) {
		var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
		    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
		    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
		    function verb(n) { return function (v) { return step([n, v]); }; }
		    function step(op) {
		        if (f) throw new TypeError("Generator is already executing.");
		        while (_) try {
		            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
		            if (y = 0, t) op = [op[0] & 2, t.value];
		            switch (op[0]) {
		                case 0: case 1: t = op; break;
		                case 4: _.label++; return { value: op[1], done: false };
		                case 5: _.label++; y = op[1]; op = [0]; continue;
		                case 7: op = _.ops.pop(); _.trys.pop(); continue;
		                default:
		                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
		                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
		                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
		                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
		                    if (t[2]) _.ops.pop();
		                    _.trys.pop(); continue;
		            }
		            op = body.call(thisArg, _);
		        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
		        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
		    }
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		var rxjs_1 = require$$0;
		var operators_1 = require$$1;
		var muse_parse_1 = museParse;
		var muse_utils_1 = museUtils;
		var zip_samples_1 = requireZipSamples();
		exports.zipSamples = zip_samples_1.zipSamples;
		var zip_samplesPpg_1 = requireZipSamplesPpg();
		exports.zipSamplesPpg = zip_samplesPpg_1.zipSamplesPpg;
		exports.MUSE_SERVICE = 0xfe8d;
		var CONTROL_CHARACTERISTIC = '273e0001-4c4d-454d-96be-f03bac821358';
		var TELEMETRY_CHARACTERISTIC = '273e000b-4c4d-454d-96be-f03bac821358';
		var GYROSCOPE_CHARACTERISTIC = '273e0009-4c4d-454d-96be-f03bac821358';
		var ACCELEROMETER_CHARACTERISTIC = '273e000a-4c4d-454d-96be-f03bac821358';
		var PPG_CHARACTERISTICS = [
		    '273e000f-4c4d-454d-96be-f03bac821358',
		    '273e0010-4c4d-454d-96be-f03bac821358',
		    '273e0011-4c4d-454d-96be-f03bac821358',
		];
		exports.PPG_FREQUENCY = 64;
		exports.PPG_SAMPLES_PER_READING = 6;
		var EEG_CHARACTERISTICS = [
		    '273e0003-4c4d-454d-96be-f03bac821358',
		    '273e0004-4c4d-454d-96be-f03bac821358',
		    '273e0005-4c4d-454d-96be-f03bac821358',
		    '273e0006-4c4d-454d-96be-f03bac821358',
		    '273e0007-4c4d-454d-96be-f03bac821358',
		];
		exports.EEG_FREQUENCY = 256;
		exports.EEG_SAMPLES_PER_READING = 12;
		// These names match the characteristics defined in PPG_CHARACTERISTICS above
		exports.ppgChannelNames = ['ambient', 'infrared', 'red'];
		// These names match the characteristics defined in EEG_CHARACTERISTICS above
		exports.channelNames = ['TP9', 'AF7', 'AF8', 'TP10', 'AUX'];
		var MuseClient = /** @class */ (function () {
		    function MuseClient() {
		        this.enableAux = false;
		        this.enablePpg = false;
		        this.deviceName = '';
		        this.connectionStatus = new rxjs_1.BehaviorSubject(false);
		        this.gatt = null;
		        this.lastIndex = null;
		        this.lastTimestamp = null;
		    }
		    MuseClient.prototype.connect = function (gatt) {
		        return __awaiter(this, void 0, void 0, function () {
		            var device, _a, service, _b, _c, telemetryCharacteristic, _d, gyroscopeCharacteristic, _e, accelerometerCharacteristic, _f, ppgObservables, ppgChannelCount, _loop_1, this_1, ppgChannelIndex, eegObservables, channelCount, _loop_2, this_2, channelIndex;
		            var _this = this;
		            return __generator(this, function (_g) {
		                switch (_g.label) {
		                    case 0:
		                        if (!gatt) return [3 /*break*/, 1];
		                        this.gatt = gatt;
		                        return [3 /*break*/, 4];
		                    case 1: return [4 /*yield*/, navigator.bluetooth.requestDevice({
		                            filters: [{ services: [exports.MUSE_SERVICE] }],
		                        })];
		                    case 2:
		                        device = _g.sent();
		                        _a = this;
		                        return [4 /*yield*/, device.gatt.connect()];
		                    case 3:
		                        _a.gatt = _g.sent();
		                        _g.label = 4;
		                    case 4:
		                        this.deviceName = this.gatt.device.name || null;
		                        return [4 /*yield*/, this.gatt.getPrimaryService(exports.MUSE_SERVICE)];
		                    case 5:
		                        service = _g.sent();
		                        rxjs_1.fromEvent(this.gatt.device, 'gattserverdisconnected')
		                            .pipe(operators_1.first())
		                            .subscribe(function () {
		                            _this.gatt = null;
		                            _this.connectionStatus.next(false);
		                        });
		                        // Control
		                        _b = this;
		                        return [4 /*yield*/, service.getCharacteristic(CONTROL_CHARACTERISTIC)];
		                    case 6:
		                        // Control
		                        _b.controlChar = _g.sent();
		                        _c = this;
		                        return [4 /*yield*/, muse_utils_1.observableCharacteristic(this.controlChar)];
		                    case 7:
		                        _c.rawControlData = (_g.sent()).pipe(operators_1.map(function (data) { return muse_utils_1.decodeResponse(new Uint8Array(data.buffer)); }), operators_1.share());
		                        this.controlResponses = muse_parse_1.parseControl(this.rawControlData);
		                        return [4 /*yield*/, service.getCharacteristic(TELEMETRY_CHARACTERISTIC)];
		                    case 8:
		                        telemetryCharacteristic = _g.sent();
		                        _d = this;
		                        return [4 /*yield*/, muse_utils_1.observableCharacteristic(telemetryCharacteristic)];
		                    case 9:
		                        _d.telemetryData = (_g.sent()).pipe(operators_1.map(muse_parse_1.parseTelemetry));
		                        return [4 /*yield*/, service.getCharacteristic(GYROSCOPE_CHARACTERISTIC)];
		                    case 10:
		                        gyroscopeCharacteristic = _g.sent();
		                        _e = this;
		                        return [4 /*yield*/, muse_utils_1.observableCharacteristic(gyroscopeCharacteristic)];
		                    case 11:
		                        _e.gyroscopeData = (_g.sent()).pipe(operators_1.map(muse_parse_1.parseGyroscope));
		                        return [4 /*yield*/, service.getCharacteristic(ACCELEROMETER_CHARACTERISTIC)];
		                    case 12:
		                        accelerometerCharacteristic = _g.sent();
		                        _f = this;
		                        return [4 /*yield*/, muse_utils_1.observableCharacteristic(accelerometerCharacteristic)];
		                    case 13:
		                        _f.accelerometerData = (_g.sent()).pipe(operators_1.map(muse_parse_1.parseAccelerometer));
		                        this.eventMarkers = new rxjs_1.Subject();
		                        if (!this.enablePpg) return [3 /*break*/, 18];
		                        this.ppgCharacteristics = [];
		                        ppgObservables = [];
		                        ppgChannelCount = PPG_CHARACTERISTICS.length;
		                        _loop_1 = function (ppgChannelIndex) {
		                            var characteristicId, ppgChar, _a, _b;
		                            return __generator(this, function (_c) {
		                                switch (_c.label) {
		                                    case 0:
		                                        characteristicId = PPG_CHARACTERISTICS[ppgChannelIndex];
		                                        return [4 /*yield*/, service.getCharacteristic(characteristicId)];
		                                    case 1:
		                                        ppgChar = _c.sent();
		                                        _b = (_a = ppgObservables).push;
		                                        return [4 /*yield*/, muse_utils_1.observableCharacteristic(ppgChar)];
		                                    case 2:
		                                        _b.apply(_a, [(_c.sent()).pipe(operators_1.map(function (data) {
		                                                var eventIndex = data.getUint16(0);
		                                                return {
		                                                    index: eventIndex,
		                                                    ppgChannel: ppgChannelIndex,
		                                                    samples: muse_parse_1.decodePPGSamples(new Uint8Array(data.buffer).subarray(2)),
		                                                    timestamp: _this.getTimestamp(eventIndex, exports.PPG_SAMPLES_PER_READING, exports.PPG_FREQUENCY),
		                                                };
		                                            }))]);
		                                        this_1.ppgCharacteristics.push(ppgChar);
		                                        return [2 /*return*/];
		                                }
		                            });
		                        };
		                        this_1 = this;
		                        ppgChannelIndex = 0;
		                        _g.label = 14;
		                    case 14:
		                        if (!(ppgChannelIndex < ppgChannelCount)) return [3 /*break*/, 17];
		                        return [5 /*yield**/, _loop_1(ppgChannelIndex)];
		                    case 15:
		                        _g.sent();
		                        _g.label = 16;
		                    case 16:
		                        ppgChannelIndex++;
		                        return [3 /*break*/, 14];
		                    case 17:
		                        this.ppgReadings = rxjs_1.merge.apply(void 0, ppgObservables);
		                        _g.label = 18;
		                    case 18:
		                        // EEG
		                        this.eegCharacteristics = [];
		                        eegObservables = [];
		                        channelCount = this.enableAux ? EEG_CHARACTERISTICS.length : 4;
		                        _loop_2 = function (channelIndex) {
		                            var characteristicId, eegChar, _a, _b;
		                            return __generator(this, function (_c) {
		                                switch (_c.label) {
		                                    case 0:
		                                        characteristicId = EEG_CHARACTERISTICS[channelIndex];
		                                        return [4 /*yield*/, service.getCharacteristic(characteristicId)];
		                                    case 1:
		                                        eegChar = _c.sent();
		                                        _b = (_a = eegObservables).push;
		                                        return [4 /*yield*/, muse_utils_1.observableCharacteristic(eegChar)];
		                                    case 2:
		                                        _b.apply(_a, [(_c.sent()).pipe(operators_1.map(function (data) {
		                                                var eventIndex = data.getUint16(0);
		                                                return {
		                                                    electrode: channelIndex,
		                                                    index: eventIndex,
		                                                    samples: muse_parse_1.decodeEEGSamples(new Uint8Array(data.buffer).subarray(2)),
		                                                    timestamp: _this.getTimestamp(eventIndex, exports.EEG_SAMPLES_PER_READING, exports.EEG_FREQUENCY),
		                                                };
		                                            }))]);
		                                        this_2.eegCharacteristics.push(eegChar);
		                                        return [2 /*return*/];
		                                }
		                            });
		                        };
		                        this_2 = this;
		                        channelIndex = 0;
		                        _g.label = 19;
		                    case 19:
		                        if (!(channelIndex < channelCount)) return [3 /*break*/, 22];
		                        return [5 /*yield**/, _loop_2(channelIndex)];
		                    case 20:
		                        _g.sent();
		                        _g.label = 21;
		                    case 21:
		                        channelIndex++;
		                        return [3 /*break*/, 19];
		                    case 22:
		                        this.eegReadings = rxjs_1.merge.apply(void 0, eegObservables);
		                        this.connectionStatus.next(true);
		                        return [2 /*return*/];
		                }
		            });
		        });
		    };
		    MuseClient.prototype.sendCommand = function (cmd) {
		        return __awaiter(this, void 0, void 0, function () {
		            return __generator(this, function (_a) {
		                switch (_a.label) {
		                    case 0: return [4 /*yield*/, this.controlChar.writeValue(muse_utils_1.encodeCommand(cmd))];
		                    case 1:
		                        _a.sent();
		                        return [2 /*return*/];
		                }
		            });
		        });
		    };
		    MuseClient.prototype.start = function () {
		        return __awaiter(this, void 0, void 0, function () {
		            var preset;
		            return __generator(this, function (_a) {
		                switch (_a.label) {
		                    case 0: return [4 /*yield*/, this.pause()];
		                    case 1:
		                        _a.sent();
		                        preset = 'p21';
		                        if (this.enablePpg) {
		                            preset = 'p50';
		                        }
		                        else if (this.enableAux) {
		                            preset = 'p20';
		                        }
		                        return [4 /*yield*/, this.controlChar.writeValue(muse_utils_1.encodeCommand(preset))];
		                    case 2:
		                        _a.sent();
		                        return [4 /*yield*/, this.controlChar.writeValue(muse_utils_1.encodeCommand('s'))];
		                    case 3:
		                        _a.sent();
		                        return [4 /*yield*/, this.resume()];
		                    case 4:
		                        _a.sent();
		                        return [2 /*return*/];
		                }
		            });
		        });
		    };
		    MuseClient.prototype.pause = function () {
		        return __awaiter(this, void 0, void 0, function () {
		            return __generator(this, function (_a) {
		                switch (_a.label) {
		                    case 0: return [4 /*yield*/, this.sendCommand('h')];
		                    case 1:
		                        _a.sent();
		                        return [2 /*return*/];
		                }
		            });
		        });
		    };
		    MuseClient.prototype.resume = function () {
		        return __awaiter(this, void 0, void 0, function () {
		            return __generator(this, function (_a) {
		                switch (_a.label) {
		                    case 0: return [4 /*yield*/, this.sendCommand('d')];
		                    case 1:
		                        _a.sent();
		                        return [2 /*return*/];
		                }
		            });
		        });
		    };
		    MuseClient.prototype.deviceInfo = function () {
		        return __awaiter(this, void 0, void 0, function () {
		            var resultListener;
		            return __generator(this, function (_a) {
		                switch (_a.label) {
		                    case 0:
		                        resultListener = this.controlResponses
		                            .pipe(operators_1.filter(function (r) { return !!r.fw; }), operators_1.take(1))
		                            .toPromise();
		                        return [4 /*yield*/, this.sendCommand('v1')];
		                    case 1:
		                        _a.sent();
		                        return [2 /*return*/, resultListener];
		                }
		            });
		        });
		    };
		    MuseClient.prototype.injectMarker = function (value, timestamp) {
		        if (timestamp === void 0) { timestamp = new Date().getTime(); }
		        return __awaiter(this, void 0, void 0, function () {
		            return __generator(this, function (_a) {
		                switch (_a.label) {
		                    case 0: return [4 /*yield*/, this.eventMarkers.next({ value: value, timestamp: timestamp })];
		                    case 1:
		                        _a.sent();
		                        return [2 /*return*/];
		                }
		            });
		        });
		    };
		    MuseClient.prototype.disconnect = function () {
		        if (this.gatt) {
		            this.lastIndex = null;
		            this.lastTimestamp = null;
		            this.gatt.disconnect();
		            this.connectionStatus.next(false);
		        }
		    };
		    MuseClient.prototype.getTimestamp = function (eventIndex, samplesPerReading, frequency) {
		        var READING_DELTA = 1000 * (1.0 / frequency) * samplesPerReading;
		        if (this.lastIndex === null || this.lastTimestamp === null) {
		            this.lastIndex = eventIndex;
		            this.lastTimestamp = new Date().getTime() - READING_DELTA;
		        }
		        // Handle wrap around
		        while (this.lastIndex - eventIndex > 0x1000) {
		            eventIndex += 0x10000;
		        }
		        if (eventIndex === this.lastIndex) {
		            return this.lastTimestamp;
		        }
		        if (eventIndex > this.lastIndex) {
		            this.lastTimestamp += READING_DELTA * (eventIndex - this.lastIndex);
		            this.lastIndex = eventIndex;
		            return this.lastTimestamp;
		        }
		        else {
		            return this.lastTimestamp - READING_DELTA * (this.lastIndex - eventIndex);
		        }
		    };
		    return MuseClient;
		}());
		exports.MuseClient = MuseClient;
		
	} (muse$1));
	return muse$1;
}

var museExports = requireMuse();
var muse = /*@__PURE__*/getDefaultExportFromCjs(museExports);

module.exports = muse;
