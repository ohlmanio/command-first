export interface Func extends Document {
  compile(): Function
  addDependency(alias: string, src: string): Func
}