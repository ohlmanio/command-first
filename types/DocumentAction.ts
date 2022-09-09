import { Command } from "./Command.ts";

export interface DocumentAction extends Command {
  /**
   * Date.now()
   */
  timestamp: number;
  version: number;
}


