import { createEmbedding, generateContext, getAnswerStream } from './openai'
import { VectorDB } from './vector-db'

export async function ask(
  question: string,
  callbacks: {
    onAnswerChunk: (answer: string) => void
    onEnd: () => void
  }
) {
  const db = new VectorDB({
    vectorPath: 'embedding'
  })

  const embedding = await createEmbedding(question)
  const context = await db.query(embedding, { limit: 10 })
  const serializedContext = await generateContext(
    context.map((s) => s.object.text)
  )

  const answerStream = await getAnswerStream(question, serializedContext)
  const reader = answerStream.getReader()

  const decoder = new TextDecoder('utf-8')

  const readStream = async () => {
    const { done, value } = await reader.read()
    if (done) {
      return
    }
    const text = decoder.decode(value)

    callbacks.onAnswerChunk(text)
    readStream()
  }

  readStream()
}
