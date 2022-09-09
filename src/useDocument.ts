import { Document } from "../types/Document.ts";
import LocalWorkspace from "./LocalWorkspace.ts";
import RemoteWorkspace from "./RemoteWorkspace.ts";
import SyncedWorkspace from "./SyncedWorkspace.ts";

export default function useDocument(documentId: string, workspace: LocalWorkspace | RemoteWorkspace | SyncedWorkspace): {value: Document, isFinal: boolean} {
  // get the document,
  // useEffect(subscribe to the document and actions which modify the document)

  throw new Error("Not implemented");
}