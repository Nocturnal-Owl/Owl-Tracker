import { globalStore } from '../utils';
import { TimelineStack } from '../types';

export class Timeline {
  stack: TimelineStack[];

  constructor() {
    this.stack = [];
  }

  push(data: TimelineStack) {
    const newData = data;
    const { options: { maxTimelineNumber } } = globalStore;
    if (this.stack.length >= maxTimelineNumber) {
      this.stack.shift();
    }
    this.stack.push(newData);
    this.stack.sort((a, b) => a.time - b.time);
  }

  getStack() {
    return this.stack;
  }
}
