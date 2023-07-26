export class Queue {
  isFlushing: boolean;

  stack: (() => void)[];

  constructor() {
    this.stack = [];
    this.isFlushing = false;
  }

  addFn(fn: () => void) {
    if (!('requestIdleCallback' in window || 'Promise' in window)) {
      fn();
      return;
    }
    this.stack.push(fn);
    if (!this.isFlushing) {
      this.isFlushing = true;
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.flushStack());
      } else {
        Promise.resolve().then(() => this.flushStack());
      }
    }
  }

  flushStack() {
    const todoStack = [...this.stack];
    this.stack = [];
    this.isFlushing = false;
    todoStack.forEach((fn) => fn());
  }
}
