// Name: Whisper then Transform

import "@johnlindquist/kit"

let { Configuration, OpenAIApi } = await import("openai")
await import("slugify")

let config = new Configuration({
  apiKey: await env("OPENAI_API_KEY"),
})

let openai = new OpenAIApi(config)

let xxs = {
  width: PROMPT.WIDTH.XXS,
  height: PROMPT.HEIGHT.XXS,
}

let buffer = await mic(xxs)

let value = await div({
  ...xxs,
  html: md(`# Whispering...`),
  ignoreBlur: true,
  onInit: async el => {
    let stream = Readable.from(buffer)
    // https://github.com/openai/openai-node/issues/77#issuecomment-1463150451
    // @ts-ignore
    stream.path = "speech.webm"
    // @ts-ignore
    let response = await openai.createTranscription(stream, "whisper-1")
    submit(response.data.text)
  },
})

await editor({
  value,
  shortcuts: [],
})
