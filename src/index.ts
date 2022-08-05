import Fastify from "fastify"

import { logToEvent } from "./logToEvent"

const fastify = Fastify({
  logger: true,
})

fastify.get("/", async () => {
  return { hello: "world" }
})

// JSON log is passed directly as request body
// curl -v http://localhost:8080/json -X POST -H 'Content-Type: application/json' -d @sample-log-msg.json
fastify.post("/json", async (request) => {
  const jsonData = request.body

  logToEvent(jsonData)

  return { processed: true }
})

// Handle message received from a pub/sub event arc trigger when running on Cloud Run
fastify.post("/pubsub_message", async (request) => {
  const data: string | undefined = (request.body as any)?.message?.data

  if (!data) return { processed: false, error: "No message data" }

  const jsonData = JSON.parse(Buffer.from(data, "base64").toString())

  logToEvent(jsonData)

  return { processed: true }
})

const start = async () => {
  try {
    let port = 8080

    if (process.env["PORT"]) parseInt(process.env["PORT"])

    await fastify.listen({ port })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
