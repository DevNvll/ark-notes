import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function OpenAISettingsCard() {
  const [apiKey, setAPIKey] = useState(
    window.localStorage.getItem('openai-api-key') || ''
  )
  const [showAPIKey, setShowAPIKey] = useState(false)

  function saveAPIKey(apiKey: string) {
    window.localStorage.setItem('openai-api-key', apiKey)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenAI API Key</CardTitle>
        <CardDescription>
          Your API key is used to access the OpenAI API. You can find your API
          key in the{' '}
          <a
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenAI dashboard
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="sk-..."
            type={showAPIKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setAPIKey(e.target.value)}
          />
          <Button
            variant="ghost"
            className="shrink-0"
            onClick={() => setShowAPIKey(!showAPIKey)}
          >
            {showAPIKey ? <EyeOff /> : <Eye />}
          </Button>
          <Button
            variant="default"
            className="shrink-0"
            onClick={() => saveAPIKey(apiKey)}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
