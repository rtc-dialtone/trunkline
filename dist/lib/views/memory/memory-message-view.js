"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var MemoryMessageView = /** @class */ (function () {
    function MemoryMessageView(store) {
        this.store = store;
    }
    MemoryMessageView.prototype.create = function (createdBy, sentTo, contents) {
        var msg = __assign({}, contents, { createdAt: new Date(), createdBy: createdBy, id: uuid_1.v4(), sentTo: sentTo });
        this.store.push(msg);
        return Promise.resolve(msg);
    };
    MemoryMessageView.prototype.remove = function (msg) {
        // this indicates the {IMessage} case
        var fullMatch = typeof msg === "object";
        var index = this.store.findIndex(function (element) { return fullMatch ? element === msg : element.id === msg; });
        if (index !== -1) {
            this.store.spliceInPlace(index, 1);
            return Promise.resolve();
        }
        else {
            return Promise.reject(new Error("No such message"));
        }
    };
    MemoryMessageView.prototype.findById = function (id) {
        var index = this.store.findIndex(function (element) { return element.id === id; });
        if (index !== -1) {
            return Promise.resolve(this.store.getAt(index));
        }
        else {
            return Promise.reject(new Error("No such message"));
        }
    };
    MemoryMessageView.prototype.findByPeer = function (peerId) {
        var matches = this.store.filter(function (element) { return element.sentTo === peerId; });
        if (matches.length > 0) {
            return Promise.resolve(matches);
        }
        else {
            return Promise.reject(new Error("No such message(s)"));
        }
    };
    return MemoryMessageView;
}());
exports.MemoryMessageView = MemoryMessageView;
