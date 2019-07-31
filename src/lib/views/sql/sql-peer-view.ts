import knex from "knex";
import { Logger } from "../../";
import { IMutablePeer, IPeer, PeerId } from "../../models/peer";
import { IPeerView } from "../peer-view";

interface ISqlPeerViewOpts {
  logger: Logger;
  dbuser: string;
  dbpass: string;
  dbhost: string;
  dbtable: string;
}

/**
 * Sql view for operating on the PEERS table, of the following syntax:
 * TODO(bengreenier): document expected table create syntax
 */
export class SqlPeerView implements IPeerView {
  public static PEER_TABLE_NAME = "PEERS";

  private client: knex<any, unknown>;

  public constructor(opts: ISqlPeerViewOpts) {
    this.client = knex({
      client: "mssql",
      connection: {
        database: opts.dbtable,
        host: opts.dbhost,
        password: opts.dbpass,
        user: opts.dbuser,
      },
      log: {
        debug: (msg) => opts.logger.debug(msg),
        deprecate: (msg) => opts.logger.trace(msg),
        error: (msg) => opts.logger.error(msg),
        warn: (msg) => opts.logger.warn(msg),
      },
    });
  }

  public async create(contents: IMutablePeer): Promise<IPeer> {
    // rely on sql server to populate generated fields
    return await this.client<IPeer>(SqlPeerView.PEER_TABLE_NAME)
      .insert(contents);
  }

  public async update(id: PeerId, data: Partial<IMutablePeer>): Promise<IPeer> {
    return await this.client<IPeer>(SqlPeerView.PEER_TABLE_NAME)
      .where({ id })
      .update(data);
  }

  public async remove(peer: PeerId | IPeer): Promise<void> {
    return await this.client<IPeer>(SqlPeerView.PEER_TABLE_NAME)
      .where(typeof peer === "object" ? peer : { id: peer })
      .delete();
  }

  public async findById(id: PeerId): Promise<IPeer> {
    const peer = await this.client<IPeer>(SqlPeerView.PEER_TABLE_NAME)
      .where({ id })
      .first();
    if (!peer) {
      throw new Error(`cannot find peer ${id}`);
    } else {
      return peer;
    }
  }

  public async findByFeature(feature: string): Promise<IPeer[]> {
    return await this.client<IPeer>(SqlPeerView.PEER_TABLE_NAME)
      .where("features", "LIKE", `%${feature}%`);
  }
}
