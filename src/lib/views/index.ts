import { IBootstrapConfig } from "../";
import { MemoryMessageView } from "./memory/memory-message-view";
import { MemoryPeerView } from "./memory/memory-peer-view";
import { MemoryStore } from "./memory/memory-store";
import { IMessageView } from "./message-view";
import { IPeerView } from "./peer-view";
import { SqlMessageView } from "./sql/sql-message-view";
import { SqlPeerView } from "./sql/sql-peer-view";

export enum DatabaseType {
  Memory = "memory",
  Sql = "sql",
}

export interface IViewRegistry {
  message: IMessageView;
  peer: IPeerView;
}

export const allocateRegistry = (config: IBootstrapConfig): IViewRegistry => {
  if (config.database === DatabaseType.Sql && (
    !config.dbhost || !config.dbtable || !config.dbuser || !config.dbpass
  )) {
    throw new Error("Unable to proceed: database == Sql, but config was missing");
  }

  // assuming we didn't error out above, we can confirm for the compiler that
  // we have valid sql db options present in the config object
  const sqlSafeConfig: Required<IBootstrapConfig> = config as any;

  return {
    message: config.database === DatabaseType.Memory ?
      new MemoryMessageView(new MemoryStore()) :
      new SqlMessageView(sqlSafeConfig),
    peer: config.database === DatabaseType.Memory ?
      new MemoryPeerView(new MemoryStore()) :
      new SqlPeerView(sqlSafeConfig),
  };
};
