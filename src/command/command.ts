import {
  CacheType,
  Client,
  CommandInteraction,
  ApplicationCommandOption,
} from 'discord.js'
export abstract class CommandBase {
  protected command: RawCommand

  constructor(commandName: string, commandDescription: string) {
    const options = this.defineOptions()
    if (options == null) {
      this.command = {
        name: commandName,
        description: commandDescription,
      }
    } else {
      this.command = {
        name: commandName,
        description: commandDescription,
        options: options,
      }
    }
  }

  protected abstract defineOptions():
    | {
        name: string
        type: number
        description: string
        required: boolean
      }[]
    | null

  public getCommand(): RawCommand {
    return this.command
  }

  public abstract handle(
    i: CommandInteraction<CacheType>,
    c: Client<boolean>
  ): Promise<void>
}

export type RawCommand = {
  name: string
  description: string
  options?: ApplicationCommandOption[]
}
