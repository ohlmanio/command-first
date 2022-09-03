
export interface Subscription {
  subscriptionId: string;
  cancel(): void;
}
