import knex from "knex";
import { Logger } from "../../";
import { IMessage, IMutableMessage, MessageId } from "../../models/message";
import { IMessageView } from "../message-view";

interface ISqlMessageViewOpts {
  logger: Logger;
  dbuser: string;
  dbpass: string;
  dbhost: string;
  dbtable: string;
}

/**
 * Sql view for operating on the MESSAGES table, of the following syntax:
 * TODO(bengreenier): document expected table create syntax
 */
export class SqlMessageView implements IMessageView {
  public static MESSAGE_TABLE_NAME = "MESSAGES";

  private client: knex<any, unknown>;

  public constructor(opts: ISqlMessageViewOpts) {
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

  public async create(createdBy: string, sentTo: string, contents: IMutableMessage): Promise<IMessage> {
    // rely on sql server to populate generated fields
    return await this.client<IMessage>(SqlMessageView.MESSAGE_TABLE_NAME)
      .insert({...contents, createdBy, sentTo});
  }

  public async remove(msg: MessageId | IMessage): Promise<void> {
    return await this.client<IMessage>(SqlMessageView.MESSAGE_TABLE_NAME)
      .where(typeof msg === "object" ? msg : { id: msg })
      .delete();
  }

  public async findById(id: string): Promise<IMessage> {
    const msg = await this.client<IMessage>(SqlMessageView.MESSAGE_TABLE_NAME)
      .where({ id })
      .first();
    if (!msg) {
      throw new Error(`cannot find message ${id}`);
    } else {
      return msg;
    }
  }

  public async findByPeer(peerId: string): Promise<IMessage[]> {
    return await this.client<IMessage>(SqlMessageView.MESSAGE_TABLE_NAME)
      .where({ sentTo: peerId });
  }
}
