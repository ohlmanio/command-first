
/**
 * Describes a command to be executed
 */
export interface Command {
  /**
   * The name of the command to execute
   */
  command: string;
  /**
   * The command arguments
   */
  args: CommandArgs;
  /**
   * A comment explaining what the user is doing
   */
  comment: string;
}
export type CommandArgs = Record<string, unknown>;
