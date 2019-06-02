"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SqlMessageView = /** @class */ (function () {
    function SqlMessageView() {
    }
    SqlMessageView.prototype.create = function (createdBy, sentTo, contents) {
        throw new Error("Method not implemented.");
    };
    SqlMessageView.prototype.remove = function (msg) {
        throw new Error("Method not implemented.");
    };
    SqlMessageView.prototype.findById = function (id) {
        throw new Error("Method not implemented.");
    };
    SqlMessageView.prototype.findByPeer = function (peerId) {
        throw new Error("Method not implemented.");
    };
    return SqlMessageView;
}());
exports.SqlMessageView = SqlMessageView;
