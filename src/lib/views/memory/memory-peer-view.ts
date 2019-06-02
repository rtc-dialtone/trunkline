import { v4 as uuid } from "uuid";
import { IMutablePeer, IPeer, PeerId } from "../../models/peer";
import { IPeerView } from "../peer-view";
import { IMemoryStore } from "./memory-store";

export class MemoryPeerView implements IPeerView {
  private store: IMemoryStore<IPeer>;

  public constructor(store: IMemoryStore<IPeer>) {
    this.store = store;
  }

  public create(contents: IMutablePeer): Promise<IPeer> {
    const msg: IPeer = {...contents,
      id: uuid(),
      lastSeenAt: new Date(),
    };

    this.store.push(msg);
    return Promise.resolve(msg);
  }

  public update(id: PeerId, data: Partial<IMutablePeer>): Promise<IPeer> {
    const index = this.store.findIndex((element) => element.id === id);

    if (index === -1) {
      return Promise.reject(new Error("No such peer"));
    }

    const peer = this.store.getAt(index);
    peer.connectionMax = data.connectionMax ? data.connectionMax : peer.connectionMax;
    peer.connectionCount = data.connectionCount ? data.connectionCount : peer.connectionCount;
    peer.features = (data.features ? data.features : peer.features)
      .concat(peer.features)
      .filter((value, i, self) => {
        return self.indexOf(value) === i;
      });
    peer.lastSeenAt = new Date();

    this.store.setAt(index, peer);
    return Promise.resolve(peer);
  }

  public remove(peer: PeerId | IPeer): Promise<void> {
    // this indicates the {IPeer} case
    const fullMatch = typeof peer === "object";

    const index = this.store.findIndex((element) => fullMatch ? element === peer : element.id === peer);
    if (index !== -1) {
      this.store.spliceInPlace(index, 1);
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("No such peer"));
    }
  }

  public findById(id: PeerId): Promise<IPeer> {
    const index = this.store.findIndex((element) => element.id === id);
    if (index !== -1) {
      return Promise.resolve(this.store.getAt(index));
    } else {
      return Promise.reject(new Error("No such peer"));
    }
  }

  public findByFeature(feature: string): Promise<IPeer[]> {
    const matches = this.store.filter((element) => element.features.includes(feature));
    if (matches.length > 0) {
      return Promise.resolve(matches);
    } else {
      return Promise.reject(new Error("No such peer(s)"));
    }
  }
}
