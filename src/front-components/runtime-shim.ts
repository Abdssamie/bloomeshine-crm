const host = globalThis as typeof globalThis & {
  window?: Record<string, unknown>;
};

const windowLike = host.window ?? {};

host.window = windowLike;

const setIfMissing = (key: string, value: unknown) => {
  if (typeof windowLike[key] !== 'function') {
    windowLike[key] = value;
  }
};

setIfMissing('setTimeout', globalThis.setTimeout.bind(globalThis));
setIfMissing('clearTimeout', globalThis.clearTimeout.bind(globalThis));
setIfMissing('setInterval', globalThis.setInterval.bind(globalThis));
setIfMissing('clearInterval', globalThis.clearInterval.bind(globalThis));

setIfMissing('requestAnimationFrame', (callback: FrameRequestCallback) =>
  globalThis.setTimeout(() => callback(Date.now()), 16),
);
setIfMissing('cancelAnimationFrame', (handle: number) =>
  globalThis.clearTimeout(handle),
);
