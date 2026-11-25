/**
 * Clean asynchronous service adapter layer.
 * In this demonstration build, reads/writes operate against the local Zustand store.
 * When migrating to production, each function can be swapped to call REST endpoints
 * without changing UI components.
 */

export async function withSimulatedLatency<T>(work: () => T, delayMs = 80): Promise<T> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return work();
}
