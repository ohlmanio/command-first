import { Command } from "./Command";

export interface DocumentAction extends Command {
  /**
   * Date.now()
   */
  timestamp: number;
  version: number;
}


