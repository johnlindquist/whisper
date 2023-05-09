import { ChatOpenAI } from "langchain/chat_models"
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts"
import { ConversationChain } from "langchain/chains"

export let dictate = async () => {
  let { Configuration, OpenAIApi } = await import("openai")
  let config = new Configuration({
    apiKey: await env("OPENAI_API_KEY"),
  })

  let openai = new OpenAIApi(config)
  let xxs = {
    width: PROMPT.WIDTH.XXS,
    height: PROMPT.HEIGHT.XXS,
  }
  let buffer = await mic(xxs)

  let html = `<div class="h-full w-full flex flex-col justify-center items-center text-text-base">
  <h1 class="text-5xl animate-pulse">Whispering...</h1>
</div>`

  return await div({
    ...xxs,
    html,
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
}

export let transformEditor = async (value, instructions) => {
  let transformLogPath = tmpPath(`transform-${Date.now()}.txt`)
  let callbacks = [
    {
      handleLLMNewToken: async token => {
        editor.append(token)
        await appendFile(transformLogPath, token)
      },
    },
  ]

  return await editor({
    value: value + "\n\n",
    shortcuts: [],
    scrollTo: "bottom",
    onInit: async () => {
      let prompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(`Act as a tool that transforms dictated text based on instructions.
-- Dictated Text --
{dictated}

-- Instructions --        
`),
        HumanMessagePromptTemplate.fromTemplate(`{instructions}`),
      ])
      let llm = new ChatOpenAI({
        modelName: "gpt-4",
        streaming: true,
        callbacks,
      })

      let chain = new ConversationChain({
        llm,
        prompt,
      })

      await chain.call({
        dictated: value,
        instructions,
      })
    },
  })
}
