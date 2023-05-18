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
import { LoadingResponse } from '@/components/ask/loading-response'
import { ScrollArea } from '../ui/scroll-area'

interface Props {
  compact?: boolean
}

export function Chat({ compact = false }: Props) {
  const [history, setHistory] = useState<Message[]>([])
  const [inflight, setInflight] = useState(false)
  const [writting, setWritting] = useState('')
  const chain = useRef<LLMChain>(null)
  const abortController = useRef<AbortController>(null)
  const scrollArea = useRef<HTMLDivElement>(null)

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
    scrollToBottom(true)
    try {
      addMessage('USER', text)
      e.target.message.value = ''
      const message = await sendMessage(
        chain.current,
        text,
        (token: string) => {
          setWritting((w) => w + token)
          scrollToBottom()
        },
        abortController.current.signal
      )
      setInflight(false)
      setWritting('')
      addMessage('AI', message.text)
    } catch (err) {
      setInflight(false)
      setWritting('')
      if (err.name === 'AbortError') return
      addMessage('AI', 'Something went wrong', true)
    }
  }

  const handleStop = () => {
    abortController.current.abort()
    setInflight(false)
  }

  const scrollToBottom = (bypassScrollCheck?: boolean) => {
    const element = scrollArea.current.children[1]
    const { offsetHeight, scrollHeight, scrollTop } = element as HTMLDivElement
    if (bypassScrollCheck || scrollHeight <= scrollTop + offsetHeight + 100) {
      setTimeout(() => {
        element.scrollTo(0, scrollHeight)
      }, 1)
    }
  }

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ScrollArea
        className="flex flex-col flex-grow max-h-full mb-4 space-y-4"
        ref={scrollArea}
      >
        {history.map((m) => {
          const isUser = m.role === 'USER'
          return (
            <div
              key={m.id}
              className={cn('flex items-center space-x-2 w-full mb-4', {
                'justify-end': isUser
              })}
            >
              <div
                className={cn(
                  'px-4 py-3 rounded-[--radius] shadow-sm text-black  max-w-[50%]',
                  {
                    'bg-primary': isUser,
                    'bg-white ': !isUser,
                    'text-sm': compact
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
        {inflight && <LoadingResponse writting={writting} />}
      </ScrollArea>

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
