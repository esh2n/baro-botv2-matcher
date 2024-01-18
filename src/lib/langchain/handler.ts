import { BaseCallbackHandler } from '@langchain/core/callbacks/base'

type Props = {
  channel: string
}
export default class DiscordBotCallbackHandler extends BaseCallbackHandler {
  name = 'DiscordBotCallbackHandler'

  private channel: string
  private message: string = ''
  private lastTime: number = 0

  constructor({ channel }: Props) {
    super()
    this.channel = channel
    console.log(this.channel)
  }

  handleLLMNewToken(token: string) {
    this.message = this.message + token

    const currentTime = new Date().getTime()
    if (currentTime - this.lastTime > 2000 && token) {
      this.lastTime = currentTime
      //   this.app.client.chat.update({
      //     channel: this.channel,
      //     text: this.message,
      //   })
    }
  }

  handleLLMEnd() {
    // this.app.client.chat.update({
    //   channel: this.channel,
    //   text: this.message,
    // })
  }
}
