import { Logger } from "..";
import { IViewRegistry } from "../views";

export enum SupportedProtocol {
  Http = "http",
  RawSocket = "raw-socket",
  Websocket = "ws",
}

export interface IBaseProtocolOpts {
  port: number;
  logger: Logger;
  views: IViewRegistry;
}

export abstract class BaseProtocol {
  protected logger: Logger;
  protected views: IViewRegistry;
  protected port: number;

  /**
   * The port that is bound to the underlying protocol
   * Note: this has a strange name, as to not collide with port
   * If https://github.com/Microsoft/TypeScript/issues/2845 changes, we'll adapt
   */
  public get portBound() { return this.port; }

  constructor(opts: IBaseProtocolOpts) {
    this.port = opts.port;
    this.logger = opts.logger;
    this.views = opts.views;
  }

  public abstract setup(): Promise<void>;
  public abstract tearDown(): Promise<void>;
}
