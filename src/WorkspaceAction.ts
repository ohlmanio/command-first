import { DocumentAction } from "./DocumentAction";

export interface WorkspaceAction extends DocumentAction {
  /**
   * The id of the document, if any, affected by this action (e.g. created, 
   * destroyed, modified)
   */
  documentId: string
}
;
