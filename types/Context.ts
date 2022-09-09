export type Context = ContextEntry[];

export type ContextEntry = {
  name: string;
  type: string;
  value: unknown;
};
