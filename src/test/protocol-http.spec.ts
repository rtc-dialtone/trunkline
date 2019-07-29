import { default as pino } from "pino";
import { default as request } from "superagent";
import { IMessage, IMutableMessage } from "../lib/models/message";
import { IMutablePeer, IPeer } from "../lib/models/peer";
import { HttpProtocol } from "../lib/protocols/http";
import { allocateRegistry, DatabaseType } from "../lib/views";
import { MemoryMessageView } from "../lib/views/memory/memory-message-view";
import { MemoryPeerView } from "../lib/views/memory/memory-peer-view";

// mock our in-memory view providers
// this implies that the allocateRegistry(DatabaseType.Memory) result will contain mocks
jest.mock("../lib/views/memory/memory-message-view");
jest.mock("../lib/views/memory/memory-peer-view");

describe("protocol.http", () => {
  const registry = allocateRegistry(DatabaseType.Memory);
  const http = new HttpProtocol({
    // note: we always mock pino, so this is a mock, not real
    logger: pino(),
    // per fastify docs, a port of zero will self-assign
    port: 0,
    // the memory database adapter is mocked, so this is a mock
    views: registry,
  });

  beforeEach(async () => {
    await http.setup();
  });

  afterEach(async () => {
    await http.tearDown();
  });

  describe("peers", () => {
    const peerRegistry = registry.peer as jest.Mocked<MemoryPeerView>;

    afterEach(async () => {
      // TODO(bengreenier): can we resetAll without touching pino?
      peerRegistry.create.mockReset();
      peerRegistry.findByFeature.mockReset();
      peerRegistry.findById.mockReset();
      peerRegistry.remove.mockReset();
      peerRegistry.update.mockReset();
    });

    describe("POST", () => {
      it("should create a peer", async () => {
        // the mutable data that composes our peer
        const expectedPeerData: IMutablePeer = {
          connectionCount: 0,
          connectionMax: 1,
          features: [
            "test",
          ],
        };
        // the peer that we mock generate
        const expectedPeer: IPeer = {...expectedPeerData,
          id: "testuuid",
          lastSeenAt: new Date("16 March 1993 12:00:00"),
        };
        // this is required, as our response will contain the date as a string
        // due to serialization/deserialization as JSON
        const expectedSerializedPeer = {...expectedPeer,
          lastSeenAt: expectedPeer.lastSeenAt.toISOString(),
        };

        peerRegistry.create.mockResolvedValueOnce(expectedPeer);

        const res = await request.post(`http://localhost:${http.portBound}/peers`)
          .send(expectedPeerData);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(expectedSerializedPeer);
        expect(peerRegistry.create).toBeCalledTimes(1);
        expect(peerRegistry.create).toBeCalledWith(expectedPeerData);
      });

      it("should allocate default peer data", async () => {
        // the default data that composes our peer
        const expectedDefaultData: IMutablePeer = {
          connectionCount: 0,
          connectionMax: 1,
          features: [],
        };

        // since our test is only concerned with http generating and handing
        // the correct data to create, we don't need a valid create response
        peerRegistry.create.mockResolvedValueOnce(null as any);

        await request.post(`http://localhost:${http.portBound}/peers`);
        expect(peerRegistry.create).toBeCalledTimes(1);
        expect(peerRegistry.create).toBeCalledWith(expectedDefaultData);
      });
    });

    describe("GET", () => {
      it("should get a peer", async () => {
        // the peer that we mock generate
        const expectedPeer: IPeer = {
          connectionCount: 0,
          connectionMax: 1,
          features: [
            "test",
          ],
          id: "testuuid",
          lastSeenAt: new Date("16 March 1993 12:00:00"),
        };
        // this is required, as our response will contain the date as a string
        // due to serialization/deserialization as JSON
        const expectedSerializedPeer = {...expectedPeer,
          lastSeenAt: expectedPeer.lastSeenAt.toISOString(),
        };

        peerRegistry.findById.mockResolvedValueOnce(expectedPeer);

        const res = await request.get(`http://localhost:${http.portBound}/peers/${expectedPeer.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expectedSerializedPeer);
      });

      it("should 404 when peer doesn't exist", async () => {
        const expectedId = "1337";
        peerRegistry.findById.mockRejectedValueOnce(new Error("No such peer"));

        // note: ok must be used here to tell request that a 404 (well in this case any request) is allowed
        const res = await request.get(`http://localhost:${http.portBound}/peers/${expectedId}`)
          .ok(() => true);

        expect(res.status).toBe(404);
        expect(peerRegistry.findById).toBeCalledTimes(1);
        expect(peerRegistry.findById).toBeCalledWith(expectedId);
      });
    });

    describe("PUT", () => {
      it("should update a peer", async () => {
        // the mutable data that composes our peer
        const expectedPeerData: IMutablePeer = {
          connectionCount: 0,
          connectionMax: 1,
          features: [
            "test",
          ],
        };
        // the peer that we mock generate
        const expectedPeer: IPeer = {...expectedPeerData,
          id: "testuuid",
          lastSeenAt: new Date("16 March 1993 12:00:00"),
        };
        // this is required, as our response will contain the date as a string
        // due to serialization/deserialization as JSON
        const expectedSerializedPeer = {...expectedPeer,
          lastSeenAt: expectedPeer.lastSeenAt.toISOString(),
        };

        peerRegistry.update.mockResolvedValueOnce(expectedPeer);

        const res = await request.put(`http://localhost:${http.portBound}/peers/${expectedPeer.id}`)
          .send(expectedPeerData);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(expectedSerializedPeer);
        expect(peerRegistry.update).toBeCalledTimes(1);
        expect(peerRegistry.update).toBeCalledWith(expectedPeer.id, expectedPeerData);
      });

      it("should 404 when peer doesn't exist", async () => {
        const expectedId = "1337";
        // the mutable data that composes our peer
        const expectedPeerData: IMutablePeer = {
          connectionCount: 0,
          connectionMax: 10,
          features: [
            "test",
          ],
        };

        peerRegistry.update.mockRejectedValueOnce(new Error("No such peer"));

        // note: ok must be used here to tell request that a 404 (well in this case any request) is allowed
        const res = await request.put(`http://localhost:${http.portBound}/peers/${expectedId}`)
          .send(expectedPeerData)
          .ok(() => true);

        expect(res.status).toBe(404);
        expect(peerRegistry.update).toBeCalledTimes(1);
        expect(peerRegistry.update).toBeCalledWith(expectedId, expectedPeerData);
      });
    });

    describe("DELETE", () => {
      it("should remove a peer", async () => {
        const expectedId = "1337";

        peerRegistry.remove.mockResolvedValueOnce();

        const res = await request.delete(`http://localhost:${http.portBound}/peers/${expectedId}`);
        expect(res.status).toBe(200);
        expect(peerRegistry.remove).toBeCalledTimes(1);
        expect(peerRegistry.remove).toBeCalledWith(expectedId);
      });

      it("should 404 when peer doesn't exist", async () => {
        const expectedId = "1337";

        peerRegistry.remove.mockRejectedValue(new Error("No such peer"));

        // note: ok must be used here to tell request that a 404 (well in this case any request) is allowed
        const res = await request.delete(`http://localhost:${http.portBound}/peers/${expectedId}`)
          .ok(() => true);
        expect(res.status).toBe(404);
        expect(peerRegistry.remove).toBeCalledTimes(1);
        expect(peerRegistry.remove).toBeCalledWith(expectedId);
      });
    });

    describe("GET by feature", () => {
      it("should return all feature peers", async () => {
        const expectedFid = "test";
        const expectedPeers: IPeer[] = [
          {
            connectionCount: 0,
            connectionMax: 1,
            features: [
              "test",
            ],
            id: "testuuid",
            lastSeenAt: new Date("16 March 1993 12:00:00"),
          },
        ];
        const expectedSerializedPeers = expectedPeers.map((peer) => ({...peer,
          lastSeenAt: peer.lastSeenAt.toISOString(),
        }));

        peerRegistry.findByFeature.mockResolvedValueOnce(expectedPeers);

        const res = await request.get(`http://localhost:${http.portBound}/features/${expectedFid}/peers`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          peers: expectedSerializedPeers,
        });
        expect(peerRegistry.findByFeature).toBeCalledTimes(1);
        expect(peerRegistry.findByFeature).toBeCalledWith(expectedFid);
      });

      it("should 404 if peer cannot be found", async () => {
        const expectedFid = "featureid";

        peerRegistry.findByFeature.mockRejectedValue(new Error("no such peer"));

        const res = await request.get(`http://localhost:${http.portBound}/features/${expectedFid}/peers`)
          .ok(() => true);
        expect(res.status).toBe(404);
        expect(peerRegistry.findByFeature).toHaveBeenCalledTimes(1);
        expect(peerRegistry.findByFeature).toHaveBeenCalledWith(expectedFid);
      });
    });
  });

  describe("message", () => {
    const msgRegistry = registry.message as jest.Mocked<MemoryMessageView>;

    afterEach(async () => {
      // TODO(bengreenier): can we resetAll without touching pino?
      msgRegistry.create.mockReset();
      msgRegistry.findById.mockReset();
      msgRegistry.findByPeer.mockReset();
      msgRegistry.remove.mockReset();
    });

    describe("GET", () => {
      it("should get peer messages", async () => {
        const receiverId = "receiverpeeruuid";
        const expectedMsg: IMessage = {
          createdAt: new Date("16 March 1993 12:00:00"),
          createdBy: "authorpeeruuid",
          data: "hello world",
          id: "testuuid",
          mimeType: "text/plain",
          sentTo: receiverId,
        };
        // this is required, as our response will contain the date as a string
        // due to serialization/deserialization as JSON
        const expectedSerializedMsg = {...expectedMsg,
          createdAt: expectedMsg.createdAt.toISOString(),
        };

        msgRegistry.findByPeer.mockResolvedValueOnce([ expectedMsg ]);

        const res = await request.get(`http://localhost:${http.portBound}/peers/${receiverId}/messages`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ messages: [ expectedSerializedMsg ] });
        expect(msgRegistry.findByPeer).toHaveBeenCalledTimes(1);
        expect(msgRegistry.findByPeer).toHaveBeenCalledWith(receiverId);
      });

      it("should fail to get peer messages if peer is missing", async () => {
        const receiverId = "authorid";

        msgRegistry.findByPeer.mockRejectedValueOnce(new Error("No such peer"));

        const res = await request.get(`http://localhost:${http.portBound}/peers/${receiverId}/messages`)
          .ok(() => true);
        expect(res.status).toBe(404);
        expect(msgRegistry.findByPeer).toHaveBeenCalledTimes(1);
        expect(msgRegistry.findByPeer).toHaveBeenCalledWith(receiverId);
      });

      it("should get peer message", async () => {
        const messageId = "testuuid";
        const receiverId = "receiverpeeruuid";
        const expectedMsg: IMessage = {
          createdAt: new Date("16 March 1993 12:00:00"),
          createdBy: "authorpeeruuid",
          data: "hello world",
          id: messageId,
          mimeType: "text/plain",
          sentTo: receiverId,
        };
        // this is required, as our response will contain the date as a string
        // due to serialization/deserialization as JSON
        const expectedSerializedMsg = {...expectedMsg,
          createdAt: expectedMsg.createdAt.toISOString(),
        };

        msgRegistry.findById.mockResolvedValueOnce(expectedMsg);

        const res = await request.get(`http://localhost:${http.portBound}/peers/${receiverId}/messages/${messageId}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expectedSerializedMsg);
        expect(msgRegistry.findById).toHaveBeenCalledTimes(1);
        expect(msgRegistry.findById).toHaveBeenCalledWith(messageId);
      });

      it("should fail to get a peer message if message is missing", async () => {
        const receiverId = "authorid";
        const msgId = "testid";

        msgRegistry.findById.mockRejectedValueOnce(new Error("No such message"));

        const res = await request.get(`http://localhost:${http.portBound}/peers/${receiverId}/messages/${msgId}`)
          .ok(() => true);
        expect(res.status).toBe(404);
        expect(msgRegistry.findById).toHaveBeenCalledTimes(1);
        expect(msgRegistry.findById).toHaveBeenCalledWith(msgId);
      });
    });

    describe("POST", () => {
      it("should create a message", async () => {
        const senderId = "authorpeeruuid";
        const receiverId = "receiverpeeruuid";
        // the mutable data that composes our peer
        const expectedMsgData: IMutableMessage = {
          data: "test data",
          mimeType: "text/plain",
        };
        // the peer that we mock generate
        const expectedMsg: IMessage = {...expectedMsgData,
          createdAt: new Date("16 March 1993 12:00:00"),
          createdBy: senderId,
          id: "testuuid",
          sentTo: receiverId,
        };
        // this is required, as our response will contain the date as a string
        // due to serialization/deserialization as JSON
        const expectedSerializedPeer = {...expectedMsg,
          createdAt: expectedMsg.createdAt.toISOString(),
        };

        msgRegistry.create.mockResolvedValueOnce(expectedMsg);

        const res = await request.post(`http://localhost:${http.portBound}/peers/${receiverId}/messages`)
          .set("X-Peer-Id", senderId)
          .send(expectedMsgData);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(expectedSerializedPeer);
        expect(msgRegistry.create).toBeCalledTimes(1);
        expect(msgRegistry.create).toBeCalledWith(senderId, receiverId, expectedMsgData);
      });

      it("400s when missing x-peer-id", async () => {
        const res = await request.post(`http://localhost:${http.portBound}/peers/2/messages`)
          .send({ irrelevantContent: true })
          .ok(() => true);
        expect(res.status).toBe(400);
      });
    });

    describe("DELETE", () => {
      it("should remove a message", async () => {
        const msgId = "testid";
        msgRegistry.remove.mockResolvedValueOnce();

        const res = await request.delete(`http://localhost:${http.portBound}/peers/2/messages/${msgId}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
        expect(msgRegistry.remove).toHaveBeenCalledTimes(1);
        expect(msgRegistry.remove).toHaveBeenCalledWith(msgId);
      });

      it("should 404 if the message isn't found", async () => {
        const msgId = "testid";
        msgRegistry.remove.mockRejectedValueOnce(new Error("no such message"));

        const res = await request.delete(`http://localhost:${http.portBound}/peers/2/messages/${msgId}`)
          .ok(() => true);
        expect(res.status).toBe(404);
        expect(msgRegistry.remove).toHaveBeenCalledTimes(1);
        expect(msgRegistry.remove).toHaveBeenCalledWith(msgId);
      });
    });
  });
});
