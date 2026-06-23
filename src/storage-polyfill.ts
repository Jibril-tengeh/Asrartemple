try {
  localStorage.setItem('__test__', '__test__');
  localStorage.removeItem('__test__');
} catch (e) {
  const memoryStorage = new Map<string, string>();
  const storageMock = {
    getItem: (key: string) => memoryStorage.has(key) ? memoryStorage.get(key) || null : null,
    setItem: (key: string, value: string) => memoryStorage.set(key, String(value)),
    removeItem: (key: string) => memoryStorage.delete(key),
    clear: () => memoryStorage.clear(),
    get length() { return memoryStorage.size; },
    key: (index: number) => Array.from(memoryStorage.keys())[index] || null
  };
  try {
    Object.defineProperty(window, 'localStorage', {
      value: storageMock,
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn("Could not polyfill localStorage", e);
  }
}
