import http from 'http'

import HelpCommand from './command/help'
import BoCommand from './command/bo'
import AskCommand from './command/ask'
import { CacheType, Client, Interaction, REST, Routes } from 'discord.js'
import { RawCommand } from './command/command'
import 'dotenv/config'

http
  .createServer(function (_, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Discord bot is active now \n')
  })
  .listen(process.env['PORT'])

const getCommands = (): RawCommand[] => {
  return [
    HelpCommand.getCommand(),
    BoCommand.getCommand(),
    AskCommand.getCommand(),
  ]
}

export const handleCommands = async (
  i: Interaction<CacheType>,
  c: Client<boolean>
) => {
  if (!i.isCommand()) return

  const command = i.commandName

  switch (command) {
    case 'help':
      await HelpCommand.handle()
      break
    case 'bo':
      await BoCommand.handle(i, c)
      break
    case 'ask':
      await AskCommand.handle(i)
      break
    default:
      console.log('unknown command')
      break
  }
}

const waitSeconds = (second: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000 * second)
  })
}

const main = async () => {
  const rest: REST = new REST({ version: '10' }).setToken(
    process.env['DISCORD_BOT_TOKEN'] || ''
  )

  try {
    const commands = getCommands()
    await waitSeconds(5)
    console.log('Started refreshing application (/) commands.')
    if (process.env['GUILD_ID']) {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env['CLIENT_ID'] || '',
          process.env['GUILD_ID'] as string
        ),
        {
          body: commands,
        }
      )
    } else {
      await rest.put(
        Routes.applicationCommands(process.env['CLIENT_ID'] || ''),
        {
          body: commands,
        }
      )
    }
  } catch (error) {
    console.error('Error while reloading application (/) commands: ', error)
    console.table(error)
    console.error(error)
  }
}

import './client'

main()
