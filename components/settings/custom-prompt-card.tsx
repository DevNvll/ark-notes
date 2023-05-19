import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CUSTOM_PROMPT_LOCAL_STORAGE_KEY } from '@/lib/constants'
import { useToast } from '@/components/ui/use-toast'
import { useLocalStorage } from '@/hooks/use-localstorage'
import { Textarea } from '../ui/textarea'

export default function CustomPromptCard() {
  const [customPromptStore, setCustomPromptStore] = useLocalStorage(
    CUSTOM_PROMPT_LOCAL_STORAGE_KEY,
    ''
  )
  const [customPrompt, setCustomPrompt] = useState(customPromptStore)

  const { toast } = useToast()

  function save(value: string) {
    setCustomPromptStore(value)
    toast({
      description: 'Custom Prompt saved'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Prompt</CardTitle>
        <CardDescription>
          The prompt that will be used as system message and where the context
          will be injected. Use <code>{'{context}'}</code> to mark where to
          inject context sections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Textarea
            value={customPrompt}
            rows={10}
            className="h-auto"
            onChange={(e) => setCustomPrompt(e.target.value)}
          />

          <Button
            variant="default"
            className="shrink-0"
            onClick={() => save(customPrompt)}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
