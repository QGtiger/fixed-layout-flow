class EventEmitter {
  private events: Record<string, Function[]> = {};

  on(event: string, fn: Function) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(fn);
  }

  async emit(event: string, ...args: any[]) {
    return await Promise.all(this.events[event]?.map((fn) => fn(...args)));
  }

  off(event: string, fn: Function) {
    this.events[event] = this.events[event]?.filter((f) => f !== fn);
  }

  once(event: string, fn: Function) {
    const onceFn = (...args: any[]) => {
      fn(...args);
      this.off(event, onceFn);
    };
    this.on(event, onceFn);
  }

  clear() {
    this.events = {};
  }
}

export const GlobalEventEmitter = new EventEmitter();
