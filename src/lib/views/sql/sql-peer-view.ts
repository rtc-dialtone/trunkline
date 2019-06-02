import { IMutablePeer, IPeer, PeerId } from "../../models/peer";
import { IPeerView } from "../peer-view";

export class SqlPeerView implements IPeerView {
  public create(contents: IMutablePeer): Promise<IPeer> {
    throw new Error("Method not implemented.");
  }
  public update(id: PeerId, data: Partial<IMutablePeer>): Promise<IPeer> {
    throw new Error("Method not implemented.");
  }
  public remove(peer: PeerId | IPeer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public findById(id: PeerId): Promise<IPeer> {
    throw new Error("Method not implemented.");
  }
  public findByFeature(feature: string): Promise<IPeer[]> {
    throw new Error("Method not implemented.");
  }
}
