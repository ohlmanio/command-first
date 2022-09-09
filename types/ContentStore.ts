export interface ContentStore {
  storeObject(object: unknown, owner: string): string;
  releaseObject(id: string, owner: string): void
  getObject(id: string): unknown;
}