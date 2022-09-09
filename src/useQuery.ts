import { Query } from "../types/Query.ts";
import LocalWorkspace from "./LocalWorkspace.ts";
import RemoteWorkspace from "./RemoteWorkspace.ts";
import SyncedWorkspace from "./SyncedWorkspace.ts";

export default function useQuery(documentId: string, query: Query, workspace: LocalWorkspace | RemoteWorkspace | SyncedWorkspace): {value: unknown, isFinal: boolean} {
  // get the document,
  // useEffect(subscribe to the document and actions which modify the document)

  throw new Error("Not implemented");
}