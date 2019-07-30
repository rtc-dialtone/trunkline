/**
 * A lightweight in-memory data store
 */
export interface IMemoryStore<T> {
  setAt(index: number, value: T): void;
  getAt(index: number): T;
  push(...items: T[]): number;
  findIndex(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number;
  filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];
  splice(start: number, deleteCount?: number | undefined): void;
}

/**
 * A lightweight fronting store over a basic array
 * Note: Why? Mock-ability of course.
 */
export class MemoryStore<T> implements IMemoryStore<T> {
  protected backing: T[] = [];

  public getAt(index: number): T {
    return this.backing[index];
  }

  public setAt(index: number, value: T) {
    this.backing[index] = value;
  }

  public push(...items: T[]): number {
    return this.backing.push(...items);
  }

  public findIndex(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): number {
    return this.backing.findIndex(predicate, thisArg);
  }

  public filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[] {
    return this.backing.filter(callbackfn, thisArg);
  }

  public splice(start: number, deleteCount?: number | undefined): void {
    this.backing.splice(start, deleteCount);
  }
}
