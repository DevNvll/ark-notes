import { Configuration, OpenAIApi } from 'openai'
import GPT3NodeTokenizer from 'gpt3-tokenizer'
import { getOpenAIKey } from './settings'

const apiKey = getOpenAIKey()

const configuration = new Configuration({
  apiKey
})

const openai = new OpenAIApi(configuration)

export default openai

export async function createEmbedding(input: string) {
  const embeddingResponse = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input
  })

  const [{ embedding }] = embeddingResponse.data.data

  return embedding
}

export async function generateContext(documents: string[]) {
  const tokenizer = new GPT3NodeTokenizer({ type: 'gpt3' })
  let tokenCount = 0
  let contextText = ''

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i]

    const encoded = tokenizer.encode(document)
    tokenCount += encoded.text.length

    // Limit context to max 1500 tokens (configurable)
    if (tokenCount > 1500) {
      break
    }

    contextText += `${document.trim()}\n---\n`
  }

  return contextText
}
