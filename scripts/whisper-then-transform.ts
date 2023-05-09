// Name: Whisper then Transform

import "@johnlindquist/kit"
import { Shortcut } from "@johnlindquist/kit/types/core"
import { dictate, transformEditor } from "../lib/whisper"

let value = await dictate()

let shortcuts: Shortcut[] = [
  {
    name: `Dictate to Transform`,
    key: `${cmd}+s`,
    bar: "right",
    onPress: async (input, state) => {
      submit(state.value)
    },
  },
]

let dictated = await editor({
  scrollTo: "bottom",
  value,
  shortcuts,
})

let instructions = await dictate()

let transformed = await transformEditor(dictated, instructions)

instructions = await dictate()

await transformEditor(transformed, instructions)
