'use client'
import { useEffect, useRef, useState } from 'react'
import type { LLMChain } from 'langchain/chains'
import { v4 as uuid } from 'uuid'
import { SendIcon, StopCircleIcon } from 'lucide-react'

import { createChain, sendMessage } from '@/lib/chat'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import AskResponse from '@/components/ask/ask-response'
import { Message, Role } from '@/types'

function LoadingResponse() {
  return (
    <div className="flex items-center w-full space-x-2">
      <div
        className={cn(
          'px-4 py-3 rounded-[--radius] shadow-sm max-w-[80%] bg-gray-100 text-gray-900'
        )}
      >
        Loading
      </div>
    </div>
  )
}

export default function AskPage() {
  const [history, setHistory] = useState<Message[]>([])
  const [inflight, setInflight] = useState(false)
  const chain = useRef<LLMChain>(null)
  const abortController = useRef<AbortController>(null)

  useEffect(() => {
    const chatId = uuid()
    chain.current = createChain(chatId)
  }, [])

  const addMessage = (role: Role, message: string, error?: boolean) => {
    setHistory((h) => [
      ...h,
      {
        id: uuid(),
        text: message,
        role,
        error
      }
    ])
  }

  const handleSubmitMessage = async (e) => {
    e.preventDefault()
    if (inflight) return
    const text = e.target.message.value
    abortController.current = new AbortController()
    setInflight(true)
    try {
      addMessage('USER', text)
      e.target.message.value = ''
      const message = await sendMessage(
        chain.current,
        text,
        abortController.current.signal
      )
      setInflight(false)
      addMessage('AI', message.text)
    } catch (err) {
      setInflight(false)
      if (err.name === 'AbortError') return
      addMessage('AI', 'Something went wrong', true)
    }
  }

  const handleStop = () => {
    abortController.current.abort()
    setInflight(false)
  }

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <div className="flex flex-col flex-grow mb-4 space-y-4">
        {history.map((m) => {
          const isUser = m.role === 'USER'
          return (
            <div
              key={m.id}
              className={cn('flex items-center space-x-2 w-full', {
                'justify-end': isUser
              })}
            >
              <div
                className={cn(
                  'px-4 py-3 rounded-[--radius] shadow-sm max-w-[80%]',
                  {
                    'bg-primary': isUser,
                    'bg-gray-100 text-gray-900': !isUser
                  }
                )}
              >
                {!m.error ? (
                  <AskResponse>{m.text}</AskResponse>
                ) : (
                  <p className="text-destructive">{m.text}</p>
                )}
              </div>
            </div>
          )
        })}
        {inflight && <LoadingResponse />}
      </div>
      <form
        onSubmit={handleSubmitMessage}
        className="flex flex-row items-center w-full space-x-4"
      >
        <Input name="message" autoFocus placeholder="Ask something..." />
        <button className="h-full">
          <SendIcon />
        </button>
        {inflight && (
          <button
            className="h-full"
            type="button"
            onClick={handleStop}
            title="stop generation"
          >
            <StopCircleIcon />
          </button>
        )}
      </form>
    </div>
  )
}
