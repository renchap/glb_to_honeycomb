import { dec2hex } from "./utils"
import Libhoney from "libhoney"

const { HONEYCOMB_API_KEY, HONEYCOMB_DATASET } = process.env

if (!HONEYCOMB_API_KEY) {
  console.error("You need to provide HONEYCOMB_API_KEY")
  process.exit(1)
}

if (!HONEYCOMB_DATASET) {
  console.error("You need to provide HONEYCOMB_DATASET")
  process.exit(1)
}

const hny = new Libhoney({
  writeKey: HONEYCOMB_API_KEY,
  dataset: HONEYCOMB_DATASET,
  // disabled: true, // uncomment for testing or development.
})

import { name as packageName, version as packageVersion } from "../package.json"

export function logToEvent(jsonData: any) {
  const { httpRequest, spanId, trace, resource, timestamp } = jsonData

  let ev = hny.newEvent()

  const url = new URL(httpRequest.requestUrl)

  const durationMs = parseFloat(httpRequest.latency) * 1000
  const requestEndDate = new Date(timestamp)

  const requestStartDate = new Date(requestEndDate.getTime() - durationMs)

  ev.timestamp = requestStartDate

  // mandatory
  ev.addField("name", `${httpRequest.requestMethod} ${url.pathname}`)
  ev.addField("service.name", resource.labels.service_name)
  ev.addField("duration_ms", durationMs)
  ev.addField("trace.span_id", dec2hex(spanId))
  ev.addField("trace.trace_id", trace.split("/")[3])

  ev.addField("library.name", packageName)
  ev.addField("library.version", packageVersion)

  // http
  ev.addField("http.client_ip", httpRequest.remoteIp)
  ev.addField("http.path", url.pathname)
  ev.addField("http.url", url.href)
  ev.addField("http.status_code", httpRequest.status)
  ev.addField("http.user_agent", httpRequest.user_agent)

  // cloudrun
  ev.addField("cloudrun.service_name", resource.labels.service_name)
  ev.addField("cloudrun.location", resource.labels.location)
  ev.addField("cloudrun.project_id", resource.labels.project_id)
  ev.addField("cloudrun.revision_name", resource.labels.revision_name)

  // console.log(ev);

  ev.send()
}
