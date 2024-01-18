export const send = (message, client, user) => {
  const jsonData = {
    events: [
      {
        type: 'discord',
        name: user.username,
        message: message,
      },
    ],
  }
  post(message, process.env.GAS_URL || '', jsonData, client)
}
function post(msg, url, data, client) {
  const request = require('request')
  const options = {
    uri: url,
    headers: { 'Content-type': 'application/json' },
    json: data,
    followAllRedirects: true,
  }
  request.post(options, function (error, response, _) {
    if (error != null) {
      msg.reply('更新に失敗しました')
      return
    }

    const userid = response.body.userid
    const channelid = response.body.channelid
    const message = response.body.message
    if (userid != undefined && channelid != undefined && message != undefined) {
      const channel = client.channels.get(channelid)
      if (channel != null) {
        channel.send(message)
      }
    }
  })
}
