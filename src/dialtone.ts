import pino from "pino";
import yargs from "yargs";
import { bootstrap } from "./lib";
import { SupportedProtocol } from "./lib/protocols";
import { DatabaseType } from "./lib/views";

const argv = yargs
  .describe({
    database: `backing database type`,
    port: `port to bind to`,
    protocols: `supported protocols`,
  })
  .number("port")
  .default("port", 3000)
  .array("protocols")
  .default("protocols", ["http"] as SupportedProtocol[])
  .string("database")
  .choices("database", ["memory", "sql"])
  .default("database", "memory" as DatabaseType)
  .argv;
const logger = pino();

logger.info(`bootstrapping with ${JSON.stringify(argv)}`);

bootstrap({...argv, logger})
  .then(() => logger.info("bootstrapped safely"))
  .catch((err) => logger.error(`bootstrap failed with ${err}`));
