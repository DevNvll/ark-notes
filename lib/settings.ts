import {
  API_KEY_LOCAL_STORAGE_KEY,
  CUSTOM_PROMPT_LOCAL_STORAGE_KEY
} from './constants'
import { dedent } from './utils'

export function safelyGetLocalStorageItem(key: string) {
  if (typeof window === 'undefined') return null

  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (e) {
    return null
  }
}

export function getOpenAIKey() {
  return safelyGetLocalStorageItem(API_KEY_LOCAL_STORAGE_KEY)
}

export function getCustomPrompt() {
  return safelyGetLocalStorageItem(CUSTOM_PROMPT_LOCAL_STORAGE_KEY)
}

export function bootstrapSettings() {
  const customPrompt = getCustomPrompt()

  if (!customPrompt) {
    localStorage.setItem(
      CUSTOM_PROMPT_LOCAL_STORAGE_KEY,
      JSON.stringify(
        dedent(`
        You are a helpful AI assistant that answer questions about user texts. 
        Respond using markdown. 
        If your response has code, don't forget to add the language at the top of the markdown codeblock.
        Given the following relevant sections from the user notes, answer the question using only that information. 
        If you are unsure and the answer is not explicitly written in the notes, just say \"Sorry, I don't know how to help with that.\" 
        Relevant information:
        {context}
        (You do not need to use these pieces of information if not relevant)
        Question:
      `).trim()
      )
    )
  }
}
