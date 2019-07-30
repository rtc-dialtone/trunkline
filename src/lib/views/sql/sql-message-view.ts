import { IMessage, IMutableMessage, MessageId } from "../../models/message";
import { IMessageView } from "../message-view";

export class SqlMessageView implements IMessageView {
  public create(createdBy: string, sentTo: string, contents: IMutableMessage): Promise<IMessage> {
    throw new Error("Method not implemented.");
  }

  public remove(msg: MessageId | IMessage): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public findById(id: string): Promise<IMessage> {
    throw new Error("Method not implemented.");
  }

  public findByPeer(peerId: string): Promise<IMessage[]> {
    throw new Error("Method not implemented.");
  }
}
