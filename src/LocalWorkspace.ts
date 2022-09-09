import { Command } from "../types/Command.ts";
import { Document } from "../types/Document.ts";
import { Query } from "../types/Query.ts";
import { Subscription } from "../types/Subscription.ts";
import { Workspace } from "../types/Workspace.ts";
import { WorkspaceAction } from "../types/WorkspaceAction.ts";
import { LocalDocumentStore } from "./LocalDocumentStore.ts";

export default class LocalWorkspace implements Workspace {
  constructor(public readonly id: string, private readonly backend: LocalDocumentStore) {}
  
  getDocument(id: string): Document {
    throw new Error("Method not implemented.");
  }
  execute(id: string, command: Command): WorkspaceAction {
    throw new Error("Method not implemented.");
  }
  query(id: string, query: Query): unknown {
    throw new Error("Method not implemented.");
  }
  subscribe(
    id: string,
    handler: (action: WorkspaceAction) => void
  ): Subscription {
    throw new Error("Method not implemented.");
  }
}
