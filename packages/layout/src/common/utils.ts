export function cloneObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

class EventEmitter {
  private events: Record<string, Function[]> = {};

  on(event: string, fn: Function) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(fn);
  }

  async emit(event: string, ...args: any[]) {
    return await Promise.all((this.events[event] || [])?.map((fn) => fn(...args)));
  }

  off(event: string, fn?: Function) {
    if (fn) {
      this.events[event] = this.events[event]?.filter((f) => f !== fn);
    } else {
      this.events[event] = [];
    }
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

export const eventEmitter = new EventEmitter();
