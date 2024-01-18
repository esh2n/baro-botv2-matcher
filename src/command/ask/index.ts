import {
  CommandInteraction,
  CacheType,
  CommandInteractionOptionResolver,
} from 'discord.js'
import { exec, refresh } from '../../lib/langchain'
import { CommandBase } from '../command'

export class AskCommand extends CommandBase {
  private static _instance: AskCommand | null = null

  constructor() {
    super('ask', 'ばろ犬に質問をします')
  }

  public static getInstance(): AskCommand {
    if (!AskCommand._instance) {
      AskCommand._instance = new AskCommand()
    }
    return AskCommand._instance
  }

  protected defineOptions() {
    return [
      {
        name: 'question',
        type: 3,
        description: '質問文',
        required: true,
      },
      {
        name: 'is_memory_refresh',
        type: 5,
        description: '記憶をリセットするか',
        required: false,
        default: false,
      },
    ]
  }

  public async handle(i: CommandInteraction<CacheType>) {
    const inputMessage = (
      i.options as CommandInteractionOptionResolver
    ).getString('question') as string

    await i.deferReply()
    const channelId = i.channelId
    const result = await exec(channelId, inputMessage)
    await i.editReply({
      content: `
## 質問
${inputMessage}`,
      embeds: [
        {
          title: '回答',
          color: 0x00ff00,
          description: result,
        },
      ],
    })

    const isMemoryRefresh = (
      i.options as CommandInteractionOptionResolver
    ).getBoolean('is_memory_refresh') as boolean

    if (isMemoryRefresh) {
      await refresh(channelId)
    }
  }
}

export default AskCommand.getInstance()
