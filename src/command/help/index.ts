import { CommandBase } from '../command'

export class HelpCommand extends CommandBase {
  private static _instance: HelpCommand | null = null

  constructor() {
    super('help', 'help')
  }
  public static getInstance(): HelpCommand {
    if (!HelpCommand._instance) {
      HelpCommand._instance = new HelpCommand()
    }
    return HelpCommand._instance
  }

  protected defineOptions() {
    return null
  }

  public async handle() {
    console.log('call help')
  }
}

export default HelpCommand.getInstance()
