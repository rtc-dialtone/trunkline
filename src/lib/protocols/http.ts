import { default as fastify } from "fastify";
import { default as http } from "http";
import { AddressInfo } from "net";
import { BaseProtocol } from ".";
import { PeerId } from "../models/peer";

type Request = fastify.FastifyRequest<http.IncomingMessage>;
type Reply = fastify.FastifyReply<http.ServerResponse>;

export class HttpProtocol extends BaseProtocol {
  protected boundRouter?: fastify.FastifyInstance;

  public async setup(): Promise<void> {
    const router = fastify({
      logger: this.logger,
    });

    // TODO(bengreenier): refactor out binds
    router.post("/peers", this.createPeer.bind(this));
    router.get("/peers/:peerid", this.getPeer.bind(this));
    router.put("/peers/:peerid", this.updatePeer.bind(this));
    router.delete("/peers/:peerid", this.removePeer.bind(this));
    router.get("/features/:featureid/peers", this.getPeersWithFeature.bind(this));
    router.get("/peers/:peerid/messages", this.getPeerMessages.bind(this));
    router.post("/peers/:peerid/messages", this.createPeerMessage.bind(this));
    router.get("/peers/:peerid/messages/:messageid", this.getPeerMessage.bind(this));
    router.delete("/peers/:peerid/messages/:messageid", this.removePeerMessage.bind(this));

    // do the actual async bind
    await router.listen(this.port);
    const boundPort = (router.server.address() as AddressInfo).port;
    this.boundRouter = router;
    if (this.port !== boundPort) {
      this.port = boundPort;
    }
    this.logger.info(`HttpProtocol listening on ${this.port}`);
  }

  public async tearDown(): Promise<void> {
    if (this.boundRouter) {
      await this.boundRouter.close();
    }
  }

  private async createPeer(req: Request, res: Reply) {
    if (!req.body || Object.entries(req.body).length === 0) {
      req.body = {
        connectionCount: 0,
        connectionMax: 1,
        features: [],
      };
    }

    const peer = await this.views.peer.create(req.body);
    res.status(201);
    return peer;
  }

  private async getPeer(req: Request, res: Reply) {
    try {
      const peer = await this.views.peer.findById(req.params.peerid);
      res.status(200);
      return peer;
    } catch (e) {
      this.logger.debug(`Failed to find peer: ${e}`);
      res.status(404);
      throw e;
    }
  }

  private async updatePeer(req: Request, res: Reply) {
    try {
      const peer = await this.views.peer.update(req.params.peerid, req.body);
      res.status(201);
      return peer;
    } catch (e) {
      this.logger.debug(`Failed to find peer: ${e}`);
      res.status(404);
      throw e;
    }
  }

  private async removePeer(req: Request, res: Reply) {
    try {
      await this.views.peer.remove(req.params.peerid);
      res.status(200);
      res.send();
    } catch (e) {
      this.logger.debug(`Failed to find peer: ${e}`);
      res.status(404);
      throw e;
    }
  }

  private async getPeersWithFeature(req: Request, res: Reply) {
    try {
      const peers = await this.views.peer.findByFeature(req.params.featureid);
      res.status(200);
      return { peers };
    } catch (e) {
      this.logger.debug(`Failed to find peer: ${e}`);
      res.status(404);
      throw e;
    }
  }

  private async getPeerMessages(req: Request, res: Reply) {
    try {
      const messages = await this.views.message.findByPeer(req.params.peerid);
      res.status(200);
      return { messages };
    } catch (e) {
      this.logger.debug(`Failed to find peer: ${e}`);
      res.status(404);
      throw e;
    }
  }

  private async createPeerMessage(req: Request, res: Reply) {
    const createdBy: PeerId = req.headers["x-peer-id"];

    if (!createdBy) {
      res.status(400);
      throw new Error("Missing x-peer-id");
    }

    const message = await this.views.message.create(createdBy, req.params.peerid, req.body);
    res.status(201);
    return message;
  }

  private async getPeerMessage(req: Request, res: Reply) {
    try {
      const message = await this.views.message.findById(req.params.messageid);
      res.status(200);
      return message;
    } catch (e) {
      this.logger.debug(`Failed to find message: ${e}`);
      res.status(404);
      throw e;
    }
  }

  private async removePeerMessage(req: Request, res: Reply) {
    try {
      await this.views.message.remove(req.params.messageid);
      res.status(200);
      res.send();
    } catch (e) {
      this.logger.debug(`Failed to find message: ${e}`);
      res.status(404);
      throw e;
    }
  }
}
