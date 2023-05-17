import { createEmbedding, generateContext } from './openai'
import { VectorDB } from './vector-db'

export async function getContext(question: string) {
  const db = new VectorDB({
    vectorPath: 'embedding'
  })

  const embedding = await createEmbedding(question)
  const context = await db.query(embedding, { limit: 10 })
  const serializedContext = await generateContext(
    context.map((s) => s.object.text)
  )

  return serializedContext
}
