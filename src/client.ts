import {
  CacheType,
  Client,
  GatewayIntentBits,
  Interaction,
  TextChannel,
} from 'discord.js'
import cron from 'node-cron'

import { handleCommands } from './main'
import { BoCommand } from './command/bo'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

client.on('ready', async () => {
  console.log('Bot is ready.')

  const textChannel = client.channels.cache.find(
    (channel) =>
      channel.isTextBased() &&
      (channel as TextChannel).name === '募集' &&
      (channel as TextChannel).id === '1006967319676846130'
  )

  if (!textChannel) {
    console.log('募集チャンネルが見つかりませんでした')
    return
  }

  if (textChannel) {
    // 平日9時に実行
    cron.schedule(
      '0 9 * * 1-5',
      () => {
        BoCommand.send(textChannel as TextChannel, client)
      },
      {
        scheduled: true,
        timezone: 'Asia/Tokyo',
      }
    )
    // 土日10時に実行
    cron.schedule(
      '0 10 * * 0,6',
      () => {
        BoCommand.send(textChannel as TextChannel, client)
      },
      {
        scheduled: true,
        timezone: 'Asia/Tokyo',
      }
    )
  }
})

client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
  await handleCommands(interaction, client)
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return
  }
})

client.on('voiceStateUpdate', (_, newState) => {
  if (newState.member?.user.bot) {
    return
  }
})

client.login(process.env['DISCORD_BOT_TOKEN'] || '')
