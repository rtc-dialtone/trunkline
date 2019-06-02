"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A lightweight fronting store over a basic array
 * Note: Why? Mock-ability of course.
 */
var MemoryStore = /** @class */ (function () {
    function MemoryStore() {
        this.backing = [];
    }
    MemoryStore.prototype.getAt = function (index) {
        return this.backing[index];
    };
    MemoryStore.prototype.setAt = function (index, value) {
        this.backing[index] = value;
    };
    MemoryStore.prototype.push = function () {
        var _a;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return (_a = this.backing).push.apply(_a, items);
    };
    MemoryStore.prototype.findIndex = function (predicate, thisArg) {
        return this.backing.findIndex(predicate, thisArg);
    };
    MemoryStore.prototype.filter = function (callbackfn, thisArg) {
        return this.backing.filter(callbackfn, thisArg);
    };
    MemoryStore.prototype.spliceInPlace = function (start, deleteCount) {
        this.backing = this.backing.splice(start, deleteCount);
    };
    return MemoryStore;
}());
exports.MemoryStore = MemoryStore;
