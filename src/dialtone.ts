import { config as dotEnvConfig } from "dotenv";
import pino from "pino";
import yargs from "yargs";
import { bootstrap } from "./lib";
import { SupportedProtocol } from "./lib/protocols";
import { DatabaseType } from "./lib/views";

// try to load dotenv
// NOTE: should document that dotenv entries should be prefixed with TRUNKLINE_
// but that they are otherwise the same as CLI options (ie: TRUNKLINE_PORT=3000)
dotEnvConfig();

const argv = yargs
  .env("TRUNKLINE")
  .describe({
    database: `backing database type`,
    port: `port to bind to`,
    protocols: `supported protocols`,
    verbosity: `logging level`,
  })
  .number("port")
  .alias("P", "port")
  .default("port", 3000)
  .array("protocols")
  .default("protocols", ["http", "ws", "raw-socket"] as SupportedProtocol[])
  .string("database")
  .choices("database", ["memory", "sql"])
  .default("database", "memory" as DatabaseType)
  .string("verbosity")
  .alias("V", "verbosity")
  .choices("verbosity", ["trace", "debug", "info", "warn", "error", "fatal", "silent"])
  .default("verbosity", "info")
  .argv;

const logger = pino({
  level: argv.verbosity,
});

logger.info("bootstrapping with config", argv);

bootstrap({...argv, logger})
  .then(() => logger.info("bootstrapped safely"))
  .catch((err) => logger.error("bootstrap failed with error", err));
