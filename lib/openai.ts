import { Configuration, OpenAIApi } from 'openai'
import GPT3NodeTokenizer from 'gpt3-tokenizer'
import { OpenAI } from 'openai-streams'
import { API_KEY_LOCAL_STORAGE_KEY } from './constants'

const apiKey = window.localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY)

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

export async function getAnswer(question: string, context: string) {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a AI assistant that answer questions about user notes. Given the following sections from your user notes, answer the question using only that information. If you are unsure and the answer is not explicitly written in the notes, say \"Sorry, I don't know how to help with that.\" Context sections:  ${context}`
      },
      { role: 'user', content: question }
    ]
  })

  return response.data.choices[0].message.content
}

export async function getAnswerStream(question: string, context: string) {
  const stream = await OpenAI(
    'chat',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a AI assistant that answer questions about user notes. Given the following sections from your user notes, answer the question using only that information. If you are unsure and the answer is not explicitly written in the notes, say \"Sorry, I don't know how to help with that.\" Context sections:  ${context}`
        },
        { role: 'user', content: question }
      ]
    },
    { apiKey }
  )

  return stream
}
