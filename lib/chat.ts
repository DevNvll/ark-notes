import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate
} from 'langchain/prompts'
import { BufferMemory } from 'langchain/memory'
import { API_KEY_LOCAL_STORAGE_KEY } from './constants'
import { createEmbedding, generateContext } from './openai'
import { VectorDB } from './vector-db'
import { CallbackManager } from 'langchain/callbacks'
import { getCustomPrompt, getOpenAIKey } from './settings'

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

export function createChain(chatId: string) {
  const openAIApiKey = getOpenAIKey()

  const chat = new ChatOpenAI({
    temperature: 0,
    streaming: true,
    openAIApiKey
  })

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      getCustomPrompt() ||
        `
      You are a helpful AI assistant that answer questions about user texts. 
      Respond using markdown. 
      If your response has code, don't forget to add the language at the top of the markdown codeblock.
      Given the following relevant sections from the user notes, answer the question using only that information. 
      If you are unsure and the answer is not explicitly written in the notes, just say \"Sorry, I don't know how to help with that.\" 
      Relevant information:
      {context}
      (You do not need to use these pieces of information if not relevant)
      Question:
    `
    ),
    new MessagesPlaceholder(chatId),
    HumanMessagePromptTemplate.fromTemplate('{input}')
  ])

  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: chatId,
    inputKey: 'input'
  })

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
    memory
  })

  return chain
}

export const sendMessage = async (
  chain: LLMChain,
  message: string,
  onNewToken: (token: string) => void,
  abortSignal: AbortSignal
) => {
  const context = await getContext(message)

  const response = await chain.call(
    {
      context,
      input: message,
      signal: abortSignal
    },
    CallbackManager.fromHandlers({
      handleLLMNewToken: onNewToken
    })
  )

  return response
}
