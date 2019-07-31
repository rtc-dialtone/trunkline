import { BaseLogger } from "pino";
import { SupportedProtocol } from "./protocols";
import { HttpProtocol } from "./protocols/http";
import { RawSocket } from "./protocols/raw-socket";
import { Ws } from "./protocols/ws";
import { allocateRegistry, DatabaseType } from "./views";

export type Logger = BaseLogger;

export interface IBootstrapConfig {
  logger: Logger;
  port: number;
  protocols: SupportedProtocol[];
  database: DatabaseType;
}

export const bootstrap = async (opts: IBootstrapConfig) => {
  const views = allocateRegistry(opts.database);
  await opts.protocols.map((protocol) => {
    switch (protocol) {
      case SupportedProtocol.Http:
        return new HttpProtocol({ ...opts, views });
      case SupportedProtocol.RawSocket:
        return new RawSocket({ ...opts, views });
      case SupportedProtocol.Websocket:
        return new Ws({ ...opts, views });
      default:
        throw new Error(`Unknown protocol: ${protocol}`);
    }
  }).forEach(async (protocol) => {
    await protocol.setup();
  });
};
