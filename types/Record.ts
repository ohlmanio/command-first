import { Document } from "./Document.ts";
import { Command } from "./Command.ts";
import { Query } from "./Query.ts";
import { DocumentAction } from "./DocumentAction.ts";

/**
 * A Record wraps an immutable Document object providing current and past
 * versions and an api for appending to and modifying the history of the document.
 * 
 * The Record is used internally by the Workspace and should not be
 * exposed to the Workspace user directly.
 */
export interface Record {
  readonly id?: string;
  
  version(): number;

  snapshot(version?: number): Document
  clone(version?: number): Record
  history(version: number): DocumentAction

  withId(id: string): Record

  execute(comand: Command): number
  query(query: Query): unknown
}
