"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SupportedProtocol;
(function (SupportedProtocol) {
    SupportedProtocol["Http"] = "http";
    SupportedProtocol["RawSocket"] = "raw-socket";
})(SupportedProtocol = exports.SupportedProtocol || (exports.SupportedProtocol = {}));
var BaseProtocol = /** @class */ (function () {
    function BaseProtocol(opts) {
        this.port = opts.port;
        this.logger = opts.logger;
        this.views = opts.views;
    }
    Object.defineProperty(BaseProtocol.prototype, "portBound", {
        /**
         * The port that is bound to the underlying protocol
         * Note: this has a strange name, as to not collide with port
         * If https://github.com/Microsoft/TypeScript/issues/2845 changes, we'll adapt
         */
        get: function () { return this.port; },
        enumerable: true,
        configurable: true
    });
    return BaseProtocol;
}());
exports.BaseProtocol = BaseProtocol;
