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
var MemoryPeerView = /** @class */ (function () {
    function MemoryPeerView(store) {
        this.store = store;
    }
    MemoryPeerView.prototype.create = function (contents) {
        var msg = __assign({}, contents, { id: uuid_1.v4(), lastSeenAt: new Date() });
        this.store.push(msg);
        return Promise.resolve(msg);
    };
    MemoryPeerView.prototype.update = function (id, data) {
        var index = this.store.findIndex(function (element) { return element.id === id; });
        if (index === -1) {
            return Promise.reject(new Error("No such peer"));
        }
        var peer = this.store.getAt(index);
        peer.connectionMax = data.connectionMax ? data.connectionMax : peer.connectionMax;
        peer.connectionCount = data.connectionCount ? data.connectionCount : peer.connectionCount;
        peer.features = (data.features ? data.features : peer.features)
            .concat(peer.features)
            .filter(function (value, i, self) {
            return self.indexOf(value) === i;
        });
        peer.lastSeenAt = new Date();
        this.store.setAt(index, peer);
        return Promise.resolve(peer);
    };
    MemoryPeerView.prototype.remove = function (peer) {
        // this indicates the {IPeer} case
        var fullMatch = typeof peer === "object";
        var index = this.store.findIndex(function (element) { return fullMatch ? element === peer : element.id === peer; });
        if (index !== -1) {
            this.store.spliceInPlace(index, 1);
            return Promise.resolve();
        }
        else {
            return Promise.reject(new Error("No such peer"));
        }
    };
    MemoryPeerView.prototype.findById = function (id) {
        var index = this.store.findIndex(function (element) { return element.id === id; });
        if (index !== -1) {
            return Promise.resolve(this.store.getAt(index));
        }
        else {
            return Promise.reject(new Error("No such peer"));
        }
    };
    MemoryPeerView.prototype.findByFeature = function (feature) {
        var matches = this.store.filter(function (element) { return element.features.includes(feature); });
        if (matches.length > 0) {
            return Promise.resolve(matches);
        }
        else {
            return Promise.reject(new Error("No such peer(s)"));
        }
    };
    return MemoryPeerView;
}());
exports.MemoryPeerView = MemoryPeerView;
