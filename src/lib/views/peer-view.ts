import { IMutablePeer, IPeer, PeerId } from "../models/peer";

export interface IPeerView {
  create(contents: IMutablePeer): Promise<IPeer>;
  update(id: PeerId, data: Partial<IMutablePeer>): Promise<IPeer>;
  remove(peer: IPeer | PeerId): Promise<void>;
  findById(id: PeerId): Promise<IPeer>;
  findByFeature(feature: string): Promise<IPeer[]>;
}
