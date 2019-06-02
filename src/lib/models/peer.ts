export type PeerId = string;

export interface IMutablePeer {
  features: string[];
  connectionCount: number;
  connectionMax: number;
}

export interface IPeer extends IMutablePeer {
  id: PeerId;
  lastSeenAt: Date;
}
