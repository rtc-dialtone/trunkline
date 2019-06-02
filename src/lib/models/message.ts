import { PeerId } from "./peer";

export type MessageId = string;

export interface IMutableMessage {
  data: string;
  mimeType: string;
}

export interface IMessage extends IMutableMessage {
  id: MessageId;
  createdAt: Date;
  createdBy: PeerId;
  sentTo: PeerId;
}
