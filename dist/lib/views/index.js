"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memory_message_view_1 = require("./memory/memory-message-view");
var memory_peer_view_1 = require("./memory/memory-peer-view");
var memory_store_1 = require("./memory/memory-store");
var sql_message_view_1 = require("./sql/sql-message-view");
var sql_peer_view_1 = require("./sql/sql-peer-view");
var DatabaseType;
(function (DatabaseType) {
    DatabaseType["Memory"] = "memory";
    DatabaseType["Sql"] = "sql";
})(DatabaseType = exports.DatabaseType || (exports.DatabaseType = {}));
exports.allocateRegistry = function (type) {
    return {
        message: type === DatabaseType.Memory ? new memory_message_view_1.MemoryMessageView(new memory_store_1.MemoryStore()) : new sql_message_view_1.SqlMessageView(),
        peer: type === DatabaseType.Memory ? new memory_peer_view_1.MemoryPeerView(new memory_store_1.MemoryStore()) : new sql_peer_view_1.SqlPeerView(),
    };
};
