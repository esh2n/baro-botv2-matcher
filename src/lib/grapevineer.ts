import * as grpc from '@grpc/grpc-js'
import { GrapevineerClient } from 'grapevineer/gen/ts/v1/grapevineer_grpc_pb'
import { GetBoScriptRandomlyRequest } from 'grapevineer/gen/ts/v1/bo_pb'

const grpcClient = new GrapevineerClient(
  'grapevineer-grpc.fly.dev:443',
  grpc.credentials.createInsecure()
)

export const getBoScriptRandomly = async () => {
  const request = new GetBoScriptRandomlyRequest()

  return new Promise<string | null>((resolve, reject) => {
    grpcClient.getBoScriptRandomly(request, (err, response) => {
      if (err || response === null) {
        console.error(err)
        reject(null)
      }
      resolve(response?.getScript()!)
    })
  })
}
