/**
 * Test setup helpers for ie6_helper
 * Provides utilities to save/restore native methods so we can test polyfills
 */

/**
 * Removes a method from a prototype and returns the original.
 * Call in beforeEach to simulate IE6 where the method doesn't exist.
 */
export function removeMethod(obj: any, key: string): any {
  const original = obj[key];
  delete obj[key];
  return original;
}

/**
 * Restores a previously saved method to a prototype.
 * Call in afterEach to clean up.
 */
export function restoreMethod(obj: any, key: string, original: any): void {
  if (original !== undefined) {
    obj[key] = original;
  } else {
    delete obj[key];
  }
}
