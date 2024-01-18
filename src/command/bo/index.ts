import {
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  TextChannel,
} from 'discord.js'
import { CommandBase } from '../command'
import { send } from '../../lib/gas'
import { exec } from '../../lib/langchain'

export class BoCommand extends CommandBase {
  private static _instance: BoCommand | null = null

  constructor() {
    super('bo', '募集をします')
  }
  public static getInstance(): BoCommand {
    if (!BoCommand._instance) {
      BoCommand._instance = new BoCommand()
    }
    return BoCommand._instance
  }

  protected defineOptions() {
    return [
      {
        name: 'message',
        type: 3,
        description: 'メッセージ',
        required: true,
      },
      {
        name: 'enable_send_to_line',
        type: 5,
        description: 'LINEにも送信するか',
        required: false,
        default: false,
      },
    ]
  }

  public async handle(i: CommandInteraction<CacheType>, c: Client<boolean>) {
    const inputMessage = (
      i.options as CommandInteractionOptionResolver
    ).getString('message') as string
    await this.sendToChannel(i, c, inputMessage)
    const enableSendToLine = (
      i.options as CommandInteractionOptionResolver
    ).getBoolean('enable_send_to_line') as boolean
    if (enableSendToLine) {
      await this.sendToLineViaGas(i, c, inputMessage)
    }
  }

  protected async sendToLineViaGas(
    i: CommandInteraction<CacheType>,
    c: Client<boolean>,
    inputMessage: string
  ) {
    try {
      await send(inputMessage, c, i.user)
    } catch (e) {
      console.error(e)
    }
  }

  protected async sendToChannel(
    i: CommandInteraction<CacheType>,
    c: Client<boolean>,
    inputMessage: string
  ) {
    try {
      await i.deferReply()
      const message = await i.editReply({
        content: `
        @here
        ## ${i.user.username}さんが募集を開始しました
        `,
        embeds: [
          {
            title: '募集',
            description:
              inputMessage +
              '\n\n参加する場合は✅を、参加しない場合は❌を押してください',
            color: 0x00ff00,
            fields: [
              {
                name: '参加する',
                value: '✅',
                inline: true,
              },
              {
                name: '参加しない',
                value: '❌',
                inline: true,
              },
            ],
          },
        ],
      })
      await message.react('✅')
      await message.react('❌')
      const filter = (reaction, user) => {
        return (
          ['✅', '❌'].includes(reaction.emoji.name) &&
          user.id !== c!.user!.id &&
          !user.bot
        )
      }
      const collector = message.createReactionCollector({
        filter,
        dispose: true,
      })
      collector?.on('collect', async (reaction, _) => {
        const yepReaction = reaction.message.reactions.cache.find(
          (r) => r.emoji.name === '✅'
        )
        const yepUsers = await yepReaction?.users.fetch()
        const yepNames = yepUsers?.map((user) => {
          if (user.bot) {
            return
          }
          return user.username
        })
        const yepCount = yepReaction!.count - 1

        const nopeReaction = reaction.message.reactions.cache.find(
          (r) => r.emoji.name === '❌'
        )
        const nopeUsers = await nopeReaction?.users.fetch()
        const nopeNames = nopeUsers?.map((user) => {
          if (user.bot) {
            return
          }
          return user.username
        })
        if (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') {
          await message.edit({
            content: `
            ## ${i.user.username}さんが募集を開始しました
            @here
            `,
            embeds: [
              {
                title: '募集',
                description:
                  inputMessage +
                  '\n\n参加する場合は✅を、参加しない場合は❌を押してください',
                color: 0x00ff00,
                fields: [
                  {
                    name: `参加する (${yepCount}人)`,
                    value: `✅
                    ${yepNames!.join('\n')}`,
                    inline: true,
                  },
                  {
                    name: '参加しない',
                    value: `❌
                    ${nopeNames!.join('\n')}`,
                    inline: true,
                  },
                ],
              },
            ],
          })
        }
      })
      collector?.on('remove', async (reaction, _) => {
        const yepReaction = reaction.message.reactions.cache.find(
          (r) => r.emoji.name === '✅'
        )
        const yepUsers = await yepReaction?.users.fetch()
        const yepNames = yepUsers?.map((user) => {
          if (user.bot) {
            return
          }
          return user.username
        })
        const yepCount = yepReaction!.count - 1

        const nopeReaction = reaction.message.reactions.cache.find(
          (r) => r.emoji.name === '❌'
        )
        const nopeUsers = await nopeReaction?.users.fetch()
        const nopeNames = nopeUsers?.map((user) => {
          if (user.bot) {
            return
          }
          return user.username
        })
        if (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') {
          await message.edit({
            content: `
            @here
            ## ${i.user.username}さんが募集を開始しました
            `,
            embeds: [
              {
                title: '募集',
                description:
                  inputMessage +
                  '\n\n参加する場合は✅を、参加しない場合は❌を押してください',
                color: 0x00ff00,
                fields: [
                  {
                    name: `参加する (${yepCount}人)`,
                    value: `✅
                    ${yepNames!.join('\n')}`,
                    inline: true,
                  },
                  {
                    name: '参加しない',
                    value: `❌
                    ${nopeNames!.join('\n')}`,
                    inline: true,
                  },
                ],
              },
            ],
          })
        }
      })
    } catch (e) {
      console.error(e)
      await i.reply('エラーが発生しました')
    }
  }

  public static async send(textChannel: TextChannel, c: Client<boolean>) {
    const text = await exec(
      textChannel.id,
      'VALORANTの参加メンバーを募集するための文章を考えてください'
    )
    const today = new Date()
    const message = await textChannel.send({
      content: `
      @here
      ## ばろ犬が募集を開始しました(${today.getMonth() + 1}/${today.getDate()}
      `,
      embeds: [
        {
          title: '募集',
          description:
            text + '\n\n参加する場合は✅を、参加しない場合は❌を押してください',
          color: 0x00ff00,
          fields: [
            {
              name: '参加する',
              value: '✅',
              inline: true,
            },
            {
              name: '参加しない',
              value: '❌',
              inline: true,
            },
          ],
        },
      ],
    })
    await message.react('✅')
    await message.react('❌')
    const filter = (reaction, user) => {
      return (
        ['✅', '❌'].includes(reaction.emoji.name) &&
        user.id !== c!.user!.id &&
        !user.bot
      )
    }
    const collector = message.createReactionCollector({
      filter,
      dispose: true,
    })
    collector?.on('collect', async (reaction, _) => {
      const yepReaction = reaction.message.reactions.cache.find(
        (r) => r.emoji.name === '✅'
      )
      const yepUsers = await yepReaction?.users.fetch()
      const yepNames = yepUsers?.map((user) => {
        if (user.bot) {
          return
        }
        return user.username
      })
      const yepCount = yepReaction!.count - 1

      const nopeReaction = reaction.message.reactions.cache.find(
        (r) => r.emoji.name === '❌'
      )
      const nopeUsers = await nopeReaction?.users.fetch()
      const nopeNames = nopeUsers?.map((user) => {
        if (user.bot) {
          return
        }
        return user.username
      })
      if (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') {
        await message.edit({
          content: `
          @here
          ## ばろ犬が募集を開始しました(${
            today.getMonth() + 1
          }/${today.getDate()}
          `,
          embeds: [
            {
              title: '募集',
              description:
                text +
                '\n\n参加する場合は✅を、参加しない場合は❌を押してください',
              color: 0x00ff00,
              fields: [
                {
                  name: `参加する (${yepCount}人)`,
                  value: `✅
                  ${yepNames!.join('\n')}`,
                  inline: true,
                },
                {
                  name: '参加しない',
                  value: `❌
                  ${nopeNames!.join('\n')}`,
                  inline: true,
                },
              ],
            },
          ],
        })
      }
    })
  }
}

export default BoCommand.getInstance()
