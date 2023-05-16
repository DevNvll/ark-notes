'use client'
import { useState } from 'react'
import { ask } from '@/lib/ask'
import { AskForm } from '@/components/ask/ask-form'
import AskResponse from '@/components/ask/ask-response'

export default function AskPage() {
  const [answer, setAnswer] = useState('')
  const [inflight, setInflight] = useState(false)

  const handleAsk = async (e) => {
    e.preventDefault()
    setInflight(true)
    setAnswer('')

    ask(e.target.data.value, {
      onAnswerChunk: (chunk) => {
        setAnswer((a) => a + chunk)
      },
      onEnd: () => {
        setInflight(false)
      }
    })
  }

  return (
    <div className="flex flex-col w-full ">
      <AskForm onSubmit={handleAsk} inflight={inflight} />
      {answer && (
        <div className="flex flex-col mt-4">
          <AskResponse>{answer}</AskResponse>
        </div>
      )}
    </div>
  )
}
