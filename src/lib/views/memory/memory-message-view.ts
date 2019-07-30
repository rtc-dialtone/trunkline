import { v4 as uuid } from "uuid";
import { IMessage, IMutableMessage, MessageId } from "../../models/message";
import { IMessageView } from "../message-view";
import { IMemoryStore } from "./memory-store";

export class MemoryMessageView implements IMessageView {
  private store: IMemoryStore<IMessage>;

  public constructor(store: IMemoryStore<IMessage>) {
    this.store = store;
  }

  public create(createdBy: string, sentTo: string, contents: IMutableMessage): Promise<IMessage> {
    const msg: IMessage = {...contents,
      createdAt: new Date(),
      createdBy,
      id: uuid(),
      sentTo,
    };

    this.store.push(msg);
    return Promise.resolve(msg);
  }

  public remove(msg: MessageId | IMessage): Promise<void> {
    // this indicates the {IMessage} case
    const fullMatch = typeof msg === "object";

    const index = this.store.findIndex((element) => fullMatch ? element === msg : element.id === msg);
    if (index !== -1) {
      this.store.splice(index, 1);
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("No such message"));
    }
  }

  public findById(id: string): Promise<IMessage> {
    const index = this.store.findIndex((element) => element.id === id);
    if (index !== -1) {
      return Promise.resolve(this.store.getAt(index));
    } else {
      return Promise.reject(new Error("No such message"));
    }
  }

  public findByPeer(peerId: string): Promise<IMessage[]> {
    const matches = this.store.filter((element) => element.sentTo === peerId);
    if (matches.length > 0) {
      return Promise.resolve(matches);
    } else {
      return Promise.reject(new Error("No such message(s)"));
    }
  }
}
