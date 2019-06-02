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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pino_1 = __importDefault(require("pino"));
var yargs_1 = __importDefault(require("yargs"));
var lib_1 = require("./lib");
var argv = yargs_1.default
    .describe({
    database: "backing database type",
    port: "port to bind to",
    protocols: "supported protocols",
})
    .number("port")
    .default("port", 3000)
    .array("protocols")
    .default("protocols", ["http"])
    .string("database")
    .choices("database", ["memory", "sql"])
    .default("database", "memory")
    .argv;
var logger = pino_1.default();
logger.info("bootstrapping with " + JSON.stringify(argv));
lib_1.bootstrap(__assign({}, argv, { logger: logger }))
    .then(function () { return logger.info("bootstrapped safely"); })
    .catch(function (err) { return logger.error("bootstrap failed with " + err); });
