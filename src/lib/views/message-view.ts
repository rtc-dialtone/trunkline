import { IMessage, IMutableMessage, MessageId } from "../models/message";
import { PeerId } from "../models/peer";

export interface IMessageView {
  create(createdBy: PeerId, sentTo: PeerId, contents: IMutableMessage): Promise<IMessage>;
  remove(msg: IMessage | MessageId): Promise<void>;
  findById(id: MessageId): Promise<IMessage>;
  findByPeer(peerId: PeerId): Promise<IMessage[]>;
}
