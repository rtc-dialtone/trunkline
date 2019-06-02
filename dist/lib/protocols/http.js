"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var _1 = require(".");
var HttpProtocol = /** @class */ (function (_super) {
    __extends(HttpProtocol, _super);
    function HttpProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HttpProtocol.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var router, boundPort;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        router = fastify_1.default({
                            logger: this.logger,
                        });
                        // TODO(bengreenier): refactor out binds
                        router.post("/peers", this.createPeer.bind(this));
                        router.get("/peers/:peerid", this.getPeer.bind(this));
                        router.put("/peers/:peerid", this.updatePeer.bind(this));
                        router.delete("/peers/:peerid", this.removePeer.bind(this));
                        router.get("/features/:featureid/peers", this.getPeersWithFeature.bind(this));
                        router.get("/peers/:peerid/messages", this.getPeerMessages.bind(this));
                        router.post("/peers/:peerid/messages", this.createPeerMessage.bind(this));
                        router.get("/peers/:peerid/messages/:messageid", this.getPeerMessage.bind(this));
                        router.delete("/peers/:peerid/messages/:messageid", this.removePeerMessage.bind(this));
                        // do the actual async bind
                        return [4 /*yield*/, router.listen(this.port)];
                    case 1:
                        // do the actual async bind
                        _a.sent();
                        boundPort = router.server.address().port;
                        this.boundRouter = router;
                        if (this.port !== boundPort) {
                            this.port = boundPort;
                        }
                        this.logger.info("HttpProtocol listening on " + this.port);
                        return [2 /*return*/];
                }
            });
        });
    };
    HttpProtocol.prototype.tearDown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.boundRouter) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.boundRouter.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    HttpProtocol.prototype.createPeer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var peer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.body || Object.entries(req.body).length === 0) {
                            req.body = {
                                connectionCount: 0,
                                connectionMax: 1,
                                features: [],
                            };
                        }
                        return [4 /*yield*/, this.views.peer.create(req.body)];
                    case 1:
                        peer = _a.sent();
                        res.status(201);
                        return [2 /*return*/, peer];
                }
            });
        });
    };
    HttpProtocol.prototype.getPeer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var peer, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.views.peer.findById(req.params.peerid)];
                    case 1:
                        peer = _a.sent();
                        res.status(200);
                        return [2 /*return*/, peer];
                    case 2:
                        e_1 = _a.sent();
                        this.logger.debug("Failed to find peer: " + e_1);
                        res.status(404);
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HttpProtocol.prototype.updatePeer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var peer, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.views.peer.update(req.params.peerid, req.body)];
                    case 1:
                        peer = _a.sent();
                        res.status(201);
                        return [2 /*return*/, peer];
                    case 2:
                        e_2 = _a.sent();
                        this.logger.debug("Failed to find peer: " + e_2);
                        res.status(404);
                        throw e_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HttpProtocol.prototype.removePeer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.views.peer.remove(req.params.peerid)];
                    case 1:
                        _a.sent();
                        res.status(200);
                        res.send();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        this.logger.debug("Failed to find peer: " + e_3);
                        res.status(404);
                        throw e_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HttpProtocol.prototype.getPeersWithFeature = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var peers, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.views.peer.findByFeature(req.params.featureid)];
                    case 1:
                        peers = _a.sent();
                        res.status(200);
                        return [2 /*return*/, { peers: peers }];
                    case 2:
                        e_4 = _a.sent();
                        this.logger.debug("Failed to find peer: " + e_4);
                        res.status(404);
                        throw e_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HttpProtocol.prototype.getPeerMessages = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var messages, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.views.message.findByPeer(req.params.peerid)];
                    case 1:
                        messages = _a.sent();
                        res.status(200);
                        return [2 /*return*/, { messages: messages }];
                    case 2:
                        e_5 = _a.sent();
                        this.logger.debug("Failed to find peer: " + e_5);
                        res.status(404);
                        throw e_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HttpProtocol.prototype.createPeerMessage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var createdBy, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createdBy = req.headers["x-peer-id"];
                        if (!createdBy) {
                            res.status(400);
                            throw new Error("Missing x-peer-id");
                        }
                        return [4 /*yield*/, this.views.message.create(createdBy, req.params.peerid, req.body)];
                    case 1:
                        message = _a.sent();
                        res.status(201);
                        return [2 /*return*/, message];
                }
            });
        });
    };
    HttpProtocol.prototype.getPeerMessage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var message, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.views.message.findById(req.params.messageid)];
                    case 1:
                        message = _a.sent();
                        res.status(200);
                        return [2 /*return*/, message];
                    case 2:
                        e_6 = _a.sent();
                        this.logger.debug("Failed to find message: " + e_6);
                        res.status(404);
                        throw e_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HttpProtocol.prototype.removePeerMessage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.views.message.remove(req.params.messageid)];
                    case 1:
                        _a.sent();
                        res.status(200);
                        res.send();
                        return [3 /*break*/, 3];
                    case 2:
                        e_7 = _a.sent();
                        this.logger.debug("Failed to find message: " + e_7);
                        res.status(404);
                        throw e_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return HttpProtocol;
}(_1.BaseProtocol));
exports.HttpProtocol = HttpProtocol;
