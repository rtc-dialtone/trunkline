import { IMessage, IMutableMessage } from "../lib/models/message";
import { MemoryMessageView } from "../lib/views/memory/memory-message-view";
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
  let messageView: MemoryMessageView;
  const memoryStore = new MemoryStore<IMessage>() as jest.Mocked<MemoryStore<IMessage>>;
  const messageDate = new Date();

  beforeEach(() => {
    messageView = new MemoryMessageView(memoryStore);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create messages with data", async () => {
      const expectedAuthor = "authoruuid";
      const expectedReceiver = "receiveruuid";
      const expectedData: IMutableMessage = {
        data: "hello world",
        mimeType: "text/plain",
      };
      const expectedMsg: IMessage = {...expectedData,
        createdAt: messageDate,
        createdBy: expectedAuthor,
        id: mockGeneratedUuid,
        sentTo: expectedReceiver,
      };
      const message = await messageView.create(expectedAuthor, expectedReceiver, expectedData);
      expect(message).toEqual(expectedMsg);
      expect(memoryStore.push).toHaveBeenCalledTimes(1);
      expect(memoryStore.push).toHaveBeenCalledWith(expectedMsg);
    });
  });

  describe("remove", () => {
    it("should remove messages", async () => {
      const expectedId = "testuuid";
      const expectedIndex = 1337;

      memoryStore.findIndex.mockReturnValueOnce(expectedIndex);

      await messageView.remove(expectedId);
      expect(memoryStore.spliceInPlace).toHaveBeenCalledTimes(1);
      expect(memoryStore.spliceInPlace).toHaveBeenCalledWith(expectedIndex, 1);
    });

    it("should not remove not-found messages", async () => {
      memoryStore.findIndex.mockReturnValueOnce(-1);

      await expect(messageView.remove("non-existent")).rejects.toBeInstanceOf(Error);
    });
  });

  describe("findById", () => {
    it("should find an element", async () => {
      const expectedMsg: IMessage = {
        createdAt: messageDate,
        createdBy: "authoruuid",
        data: "hello world",
        id: mockGeneratedUuid,
        mimeType: "text/plain",
        sentTo: "receiveruuid",
      };
      memoryStore.findIndex.mockReturnValueOnce(10);
      memoryStore.getAt.mockImplementationOnce(() => {
        return expectedMsg;
      });

      const msg = await messageView.findById(mockGeneratedUuid);
      expect(msg).toEqual(expectedMsg);
      expect(memoryStore.findIndex).toHaveBeenCalledTimes(1);
    });

    it("should not find not-found messages", async () => {
      memoryStore.findIndex.mockReturnValueOnce(-1);

      await expect(messageView.findById("non-existent")).rejects.toBeInstanceOf(Error);
    });
  });

  describe("findByPeer", () => {
    it("should find by peer", async () => {
      const expectedMsgs: IMessage[] = [{
        createdAt: messageDate,
        createdBy: "authoruuid",
        data: "hello world",
        id: mockGeneratedUuid,
        mimeType: "text/plain",
        sentTo: "receiveruuid",
      }];
      memoryStore.filter.mockReturnValueOnce(expectedMsgs);

      const messages = await messageView.findByPeer("id");
      expect(messages).toEqual(expectedMsgs);
      expect(memoryStore.filter).toHaveBeenCalledTimes(1);
    });

    it("should not find not-found messages", async () => {
      memoryStore.filter.mockReturnValueOnce([]);

      await expect(messageView.findByPeer("non-existent")).rejects.toBeInstanceOf(Error);
    });
  });
});
