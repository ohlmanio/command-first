import { Command } from "./Command";
import { Query } from "./Query";
import { WorkspaceAction } from "./WorkspaceAction";

/**
 * The workspace is the "back-end" of command-first. Commands and queries 
 * are processed by the workspace, documents are owned by the workspace.
 */
export interface Workspace {
  readonly id: string;

  /**
   * Returns a document from the workspace
   * @param id The id of the document to be fetched
   */
  getDocument(id: string): Document;
  /**
   * Executes a command against the specified document (or this workspace) and
   * returns the resulting action.
   * @param id the object to execute the command against, must be in this 
   *           workspace or the id of the workspace itself
   * @param command the command to execute
   */
  execute(id: string, command: Command): WorkspaceAction;
  /**
   * Executes a query against the specified document (or this workspace) 
   * and returns the result.
      * @param id the object to execute the query against, must be in this 
   *           workspace or the id of the workspace itself
   * @param query the query to execute
   */
  query(id: string, query: Query): unknown;
}