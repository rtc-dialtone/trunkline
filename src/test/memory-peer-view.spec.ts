import { IMutablePeer, IPeer, PeerId } from "../lib/models/peer";
import { MemoryPeerView } from "../lib/views/memory/memory-peer-view";
import { MemoryStore } from "../lib/views/memory/memory-store";

const mockGeneratedUuid = "aabbccddeeff";

// mock out our memory store, uuid generator, and global.Date
jest.mock("../lib/views/memory/memory-store");
jest.mock("uuid", () => {
  return {
    v4: () => mockGeneratedUuid,
  };
});
(global as any).Date = jest.fn().mockReturnThis();

describe("views.memory.message", () => {
  let peerView: MemoryPeerView;
  const memoryStore = new MemoryStore<IPeer>() as jest.Mocked<MemoryStore<IPeer>>;
  const peerDate = new Date();

  beforeEach(() => {
    peerView = new MemoryPeerView(memoryStore);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create peers", async () => {
      const expectedData: IMutablePeer = {
        connectionCount: 1,
        connectionMax: 1,
        features: [
          "test",
        ],
      };
      const expectedMsg: IPeer = {...expectedData,
        id: mockGeneratedUuid,
        lastSeenAt: peerDate,
      };
      const peer = await peerView.create(expectedData);
      expect(peer).toEqual(expectedMsg);
      expect(memoryStore.push).toHaveBeenCalledTimes(1);
      expect(memoryStore.push).toHaveBeenCalledWith(expectedMsg);
    });
  });

  describe("update", () => {
    it("should fail to find not-present peers", async () => {
      memoryStore.findIndex.mockReturnValueOnce(-1);

      await expect(peerView.update("non-existent-peer", { connectionCount: 1 })).rejects.toBeInstanceOf(Error);
    });

    it("should not update if nothing changes", async () => {
      const expectedPeerId = "test";
      const expectedPeer: IPeer = {
        connectionCount: 0,
        connectionMax: 1,
        features: [
          "test",
        ],
        id: expectedPeerId,
        lastSeenAt: new Date(),
      };

      memoryStore.findIndex.mockReturnValueOnce(0);
      memoryStore.getAt.mockReturnValueOnce(expectedPeer);

      const res = await peerView.update(expectedPeerId, {});

      expect(res).toEqual(expectedPeer);
    });

    it("should override values", async () => {
      const expectedPeerId: PeerId = "test";
      const expectedPeerData: IMutablePeer = {
        connectionCount: 1,
        connectionMax: 10,
        features: ["test"],
      };
      let expectedPeer: IPeer = {...expectedPeerData,
        id: expectedPeerId,
        lastSeenAt: new Date(),
      };
      memoryStore.findIndex.mockReturnValueOnce(0);
      memoryStore.getAt.mockReturnValueOnce({
        connectionCount: 0,
        connectionMax: 1,
        features: [],
        id: expectedPeerId,
        lastSeenAt: new Date(),
      });

      let res = await peerView.update(expectedPeerId, expectedPeerData);

      expect(memoryStore.setAt).toHaveBeenCalledTimes(1);
      expect(memoryStore.setAt).toHaveBeenCalledWith(0, expectedPeer);
      expect(res).toEqual(expectedPeer);

      memoryStore.findIndex.mockReturnValueOnce(0);
      memoryStore.getAt.mockReturnValueOnce({
        connectionCount: 0,
        connectionMax: 1,
        features: ["hi"],
        id: expectedPeerId,
        lastSeenAt: new Date(),
      });

      expectedPeer = {...expectedPeer,
        features: ["test", "hi"],
      };

      memoryStore.setAt.mockClear();

      res = await peerView.update(expectedPeerId, expectedPeerData);

      expect(memoryStore.setAt).toHaveBeenCalledTimes(1);
      expect(memoryStore.setAt).toHaveBeenCalledWith(0, expectedPeer);
      expect(res).toEqual(expectedPeer);
    });
  });

  describe("remove", () => {
    it("should fail if the element cannot be found", async () => {
      memoryStore.findIndex.mockReturnValueOnce(-1);
      await expect(peerView.remove("test")).rejects.toBeInstanceOf(Error);
    });

    it("should remove", async () => {
      memoryStore.findIndex.mockReturnValueOnce(1);

      await expect(peerView.remove("test")).resolves.toBeUndefined();
      expect(memoryStore.splice).toHaveBeenCalledTimes(1);
      expect(memoryStore.splice).toHaveBeenCalledWith(1, 1);
    });
  });

  describe("findById", () => {
    it("should fail if the element cannot be found", async () => {
      memoryStore.findIndex.mockReturnValueOnce(-1);
      await expect(peerView.findById("test")).rejects.toBeInstanceOf(Error);
    });

    it("should return the object if found", async () => {
      const expectedObject: IPeer = {
        connectionCount: 0,
        connectionMax: 1,
        features: [
          "pie",
        ],
        id: "test",
        lastSeenAt: new Date(),
      };
      memoryStore.findIndex.mockReturnValueOnce(1);
      memoryStore.getAt.mockReturnValueOnce(expectedObject);

      await expect(peerView.findById("test")).resolves.toEqual(expectedObject);
    });
  });

  describe("findByFeature", () => {
    it("should find features", async () => {
      const expectedObject: IPeer = {
        connectionCount: 0,
        connectionMax: 1,
        features: [
          "pie",
        ],
        id: "test",
        lastSeenAt: new Date(),
      };
      memoryStore.filter.mockReturnValueOnce([]);
      await expect(peerView.findByFeature("pie")).resolves.toEqual([]);
      memoryStore.filter.mockReturnValueOnce([expectedObject]);
      await expect(peerView.findByFeature("pie")).resolves.toEqual([expectedObject]);
    });
  });
});
