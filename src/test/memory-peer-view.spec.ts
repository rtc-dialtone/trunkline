import { IMutablePeer, IPeer } from "../lib/models/peer";
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

    // TODO(begreener): complete remaining tests
  });
});
