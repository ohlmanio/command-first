import { Command } from "../types/Command";
import { Document } from "../types/Document";
import { Query } from "../types/Query";
import { Record } from "../types/Record";
import { Subscription } from "../types/Subscription";
import { WorkspaceAction } from "../types/WorkspaceAction";

export default class SyncedWorkspace {
  constructor(public readonly id: string, private readonly backend: Backend) {}

  private documents: { [id: string]: RevisableRecord } = {};
  private pendingRefresh: { [id: string]: Promise<Document> };

  getDocument(id: string): OptimisticResult<Document> {
    return {
      immediateResult: this.documents[id].snapshot(),
      finalResult: this.refreshDocument(id),
      hasImmediateResult: id in this.documents,
    };
  }
  private refreshDocument(id: string): Promise<Document> {
    if (id in this.pendingRefresh) return this.pendingRefresh[id];

    return (this.pendingRefresh[id] = this.backend
      .getDocument(id)
      .then((document) => this.saveDocument(id, document)));
  }

  private saveDocument(id: string, document: RevisableRecord): Document {
    this.documents[id] = document;

    delete this.pendingRefresh[id];

    return document.snapshot();
  }
  execute(id: string, command: Command): OptimisticResult<WorkspaceAction> {
    const hasImmediateResult = id in this.documents;
    const immediateResult = hasImmediateResult
      ? this.optimisticExecute(id, this.documents[id], command)
      : undefined;
    const finalResult = this.backend
      .execute(id, command)
      .then((result) => this.saveResult(immediateResult, result));

    return {
      hasImmediateResult,
      immediateResult,
      finalResult,
    };
  }
  private saveResult(
    originalAction: WorkspaceAction | undefined,
    finalResult: RemoteResult
  ): WorkspaceAction {
    if (originalAction && originalAction.documentId in this.documents) {
      this.documents[originalAction.documentId].replaceOptimisticAction(
        originalAction,
        finalResult
      );
    } else {
      this.saveDocument(finalResult.finalAction.documentId, finalResult.result);
    }

    return finalResult.finalAction;
  }
  private optimisticExecute(
    id: string,
    document: RevisableRecord,
    command: Command
  ): WorkspaceAction {
    const result = document.execute(command);

    const action = {
      documentId: id,
      timestamp: Date.now(),
      version: result,
      ...command,
    };

    this.notifyAction(id, action, false);
    this.notifyDocument(id, document.snapshot(), false);

    return action;
  }

  query(id: string, query: Query): OptimisticResult<unknown> {
    const hasImmediateResult = id in this.documents;
    const immediateResult = hasImmediateResult
      ? this.documents[id].query(query)
      : undefined;
    const finalResult = this.backend.query(id, query);
    return {
      hasImmediateResult,
      immediateResult,
      finalResult,
    };
  }

  private subscriptions: {
    [id: string]: (ActionSubscription | DocumentSubscription)[];
  };
  private remoteSubscriptions: {
    [id: string]: Subscription;
  };
  subscribeToActions(
    id: string,
    handler: (action: WorkspaceAction, isFinal: boolean) => void,
    includeRemote = false
  ): Subscription {
    this.subscriptions[id] = this.subscriptions[id] || [];

    const subscription = {
      actions: true as const,
      handler,
      subscriptionId: id + this.subscriptions[id].length,
      cancel: () => this.unsubscribe(id, subscription),
      includeRemote,
    };

    this.subscriptions[id].push(subscription);

    if (includeRemote && !(id in this.remoteSubscriptions)) {
      this.remoteSubscriptions[id] = this.backend.subscribe(id, (action) =>
        this.notifyAction(id, action, true)
      );
    }

    return subscription;
  }
  subscribeToDocument(
    id: string,
    handler: (document: Document, isFinal: boolean) => void
  ): Subscription {
    this.subscriptions[id] = this.subscriptions[id] || [];

    const subscription = {
      document: true as const,
      handler,
      subscriptionId: id + this.subscriptions[id].length,
      cancel: () => this.unsubscribe(id, subscription),
    };

    this.subscriptions[id].push(subscription);

    return subscription;
  }

  private unsubscribe(
    id: string,
    subscription: ActionSubscription | DocumentSubscription
  ) {
    this.subscriptions[id] = this.subscriptions[id].filter(
      (a) => a != subscription
    );

    if (
      id in this.remoteSubscriptions &&
      this.subscriptions[id].filter((a) => "actions" in a && a.includeRemote)
        .length <= 0
    ) {
      this.remoteSubscriptions[id].cancel();

      delete this.remoteSubscriptions[id];
    }
  }
  private notifyDocument(id: string, document: Document, isFinal: boolean) {
    const subscriptions = this.subscriptions[id];

    if (subscriptions) {
      subscriptions.forEach((subscription) => {
        try {
          if ("document" in subscription)
            subscription.handler(document, isFinal);
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
  private notifyAction(id: string, action: WorkspaceAction, isFinal: boolean) {
    const subscriptions = this.subscriptions[id];

    if (subscriptions) {
      subscriptions.forEach((subscription) => {
        try {
          if ("actions" in subscription) subscription.handler(action, isFinal);
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
}

export type OptimisticResult<T> = {
  finalResult: Promise<T>;
  immediateResult: T | undefined;
  hasImmediateResult: boolean;
};

export interface Backend {
  getDocument(id: string): Promise<RevisableRecord>;
  execute(id: string, command: Command): Promise<RemoteResult>;
  query(id: string, query: Query): Promise<unknown>;
  subscribe(
    id: string,
    handler: (action: WorkspaceAction) => void
  ): Subscription;
}

export type RemoteResult = {
  finalAction: WorkspaceAction;
  result: RevisableRecord;
};

export type RevisableRecord = Record & {
  replaceOptimisticAction(
    originalAction: WorkspaceAction,
    result: RemoteResult
  ): void;
};

export type ActionSubscription = Subscription & {
  actions: true;
  handler: (action: WorkspaceAction, isFinal: boolean) => void;
  includeRemote: boolean;
};
export type DocumentSubscription = Subscription & {
  document: true;
  handler: (document: Document, isFinal: boolean) => void;
};
