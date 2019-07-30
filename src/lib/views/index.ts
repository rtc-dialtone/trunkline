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

export const allocateRegistry = (type: DatabaseType): IViewRegistry => {
  return {
    message: type === DatabaseType.Memory ? new MemoryMessageView(new MemoryStore()) : new SqlMessageView(),
    peer: type === DatabaseType.Memory ? new MemoryPeerView(new MemoryStore()) : new SqlPeerView(),
  };
};
