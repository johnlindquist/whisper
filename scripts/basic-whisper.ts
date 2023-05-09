// Name: Basic Whisper

import "@johnlindquist/kit"
import { dictate } from "../lib/whisper"

let value = await dictate()

await editor(value)
