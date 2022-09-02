import { CommandArgs } from "./Command";

/**
 * Describes a query to be executed against some object such as a document or
 * workspace
 */
export interface Query {
  /**
   * The name of the query to execute
   */
  query: string;
  /**
   * The arguments to pass to the query function
   */
  args: CommandArgs;
  /**
   * A comment from the user
   */
  comment?: string;
}
