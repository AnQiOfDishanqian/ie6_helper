import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { polyfillFunction } from "../src/function";

describe("polyfillFunction", () => {
  let origBind: any;

  beforeEach(() => {
    origBind = Function.prototype.bind;
    delete (Function.prototype as any).bind;
  });

  afterEach(() => {
    (Function.prototype as any).bind = origBind;
  });

  it("binds this correctly", () => {
    polyfillFunction();
    const obj = { x: 42 };
    function getX(this: any) { return this.x; }
    const bound = getX.bind(obj);
    expect(bound()).toBe(42);
  });

  it("partially applies arguments", () => {
    polyfillFunction();
    function add(a: number, b: number) { return a + b; }
    const add5 = add.bind(null, 5);
    expect(add5(3)).toBe(8);
  });

  it("works with constructor when called with new", () => {
    polyfillFunction();
    function Person(this: any, name: string) { this.name = name; }
    const BoundPerson = Person.bind(null as any, "Alice");
    const instance = new (BoundPerson as any)();
    expect(instance.name).toBe("Alice");
  });

  it("bound constructor instance has correct prototype", () => {
    polyfillFunction();
    function Animal(this: any, type: string) { this.type = type; }
    (Animal as any).prototype.speak = function() { return this.type; };
    const BoundAnimal = Animal.bind(null as any, "Dog");
    const dog = new (BoundAnimal as any)();
    expect(dog.speak()).toBe("Dog");
  });

  it("does not overwrite existing bind", () => {
    const fakeBind = () => "fake";
    (Function.prototype as any).bind = fakeBind;
    polyfillFunction();
    expect((Function.prototype as any).bind).toBe(fakeBind);
  });
});
