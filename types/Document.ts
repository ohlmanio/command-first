import { Context } from "./Context";
import { DocumentFactory } from "./DocumentFactory";

/**
 * A Document is an immutable object which responds to commands and queries.
 */
export interface Document {
  /**
   *
   * @param command the name of the command to execute
   * @param args the arguments to the command
   * @param context the context in which the command is being executed,
   *                this should generally be the (readonly) DocumentRecord 
   *                to which this document belongs, in case the command needs
   *                access to the document history.
   */
  execute(
    command: string,
    args: Record<string, unknown>,
    context: Context
  ): Document;
  query(
    query: string,
    args: Record<string, unknown>,
    context: Context
  ): unknown;
  toJSON(): [DocumentFactory, Record<string, unknown>];
}

