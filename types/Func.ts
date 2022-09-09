import { Document } from "./Document.ts";

export interface Func extends Document {
  compile(): Function
  addDependency(alias: string, src: string): Func
}