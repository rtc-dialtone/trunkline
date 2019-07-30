import { MemoryStore } from "../lib/views/memory/memory-store";

class TestStore extends MemoryStore<string> {
  public constructor(...data: string[]) {
    super();
    this.backing = data || [];
  }

  public getBacking() {
    return this.backing;
  }
}

describe("MemoryStore", () => {
  it("supports push", () => {
    const instance = new TestStore();
    instance.push("test");
    expect(instance.getBacking()).toEqual(["test"]);
  });

  it("supports getAt", () => {
    const instance = new TestStore("one", "two", "three");
    expect(instance.getAt(1)).toBe("two");
  });

  it("supports setAt", () => {
    const instance = new TestStore("one", "two", "three");
    instance.setAt(1, "four");
    expect(instance.getBacking()).toEqual(["one", "four", "three"]);
  });

  it("supports findIndex", () => {
    const instance = new TestStore("one", "two", "three");
    expect(instance.findIndex((e) => e === "two")).toBe(1);
  });

  it("supports filter", () => {
    const instance = new TestStore("one", "two", "three");
    expect(instance.filter((e) => e !== "two")).toEqual(["one", "three"]);
  });

  it("supports splice", () => {
    const instance = new TestStore("one", "two", "three");
    instance.splice(1, 2);
    expect(instance.getBacking()).toEqual(["one"]);
  });
});
