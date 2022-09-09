import {nanoid} from "https://deno.land/x/nanoid/mod.ts"

export class RemoteDocumentStore {
  constructor(
    private backend: Backend
  ) {}

  // v1 stores all objects in their entirety

  // v2 is more efficient
  // 1KB and smaller items are always stored in their entirety
  // >1KB are stored as key/value stream:
  // {} keys & values
  // [] array
  // +[] append array
  // @1[] insert array at index
  // x=hash
  // delete x,y,z
  // delete 0-9



  private storeObject(object: unknown, owner: string): Promise<string> {
    throw new Error("Not implemented");
  }
  private releaseObject(id: string, owner: string): Promise<void> {
    throw new Error("Not implemented");
  }
  private getObject(id: string): Promise<unknown> {
    throw new Error("Not implemented");
  }
}

export interface Backend {
  setKey(key: string, value: string): Promise<void>
  getKey(key: string): Promise<string | null>
}