import { BaseLogger } from "pino";
import { SupportedProtocol } from "./protocols";
import { HttpProtocol } from "./protocols/http";
import { allocateRegistry, DatabaseType } from "./views";

export type Logger = BaseLogger;

export interface IBootstrapConfig {
  logger: Logger;
  port: number;
  protocols: SupportedProtocol[];
  database: DatabaseType;
  dbuser?: string;
  dbpass?: string;
  dbhost?: string;
  dbtable?: string;
}

export const bootstrap = async (opts: IBootstrapConfig) => {
  const views = allocateRegistry(opts);
  await opts.protocols.map((protocol) => {
    switch (protocol) {
      case SupportedProtocol.Http:
        return new HttpProtocol({ ...opts, views });
      default:
        throw new Error(`Unknown protocol: ${protocol}`);
    }
  }).forEach(async (protocol) => {
    await protocol.setup();
  });
};
