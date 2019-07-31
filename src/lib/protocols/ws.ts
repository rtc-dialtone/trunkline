import { BaseProtocol } from ".";

export class Ws extends BaseProtocol {
  public setup(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public tearDown(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
