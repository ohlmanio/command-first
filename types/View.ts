/**
 * A view is anything which can render something else in some context,
 * generally a view should also be a document since a workspace only
 * contains documents
 */
export interface View {
  render(subject: unknown, context: unknown): unknown
  canRender(subject: unknown, context?: unknown): boolean
}