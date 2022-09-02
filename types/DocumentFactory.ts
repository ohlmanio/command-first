import { Document } from "./Document";

/**
 * A method which can create (or re-create) a document from the json
 * representation of that document.
 */
export interface DocumentFactory {
  (id: string, args: Record<string, unknown>, context: object): Document;
}
