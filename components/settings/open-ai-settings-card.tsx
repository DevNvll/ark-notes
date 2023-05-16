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
import { API_KEY_LOCAL_STORAGE_KEY } from '@/lib/constants'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

export default function OpenAISettingsCard() {
  const { toast } = useToast()
  const [apiKey, setAPIKey] = useState(
    window.localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY) || ''
  )
  const [showAPIKey, setShowAPIKey] = useState(false)

  function saveAPIKey(apiKey: string) {
    window.localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, apiKey)
    toast({
      description: 'API key saved'
    })
  }

  const isEqual =
    apiKey === window.localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY)

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
            disabled={isEqual}
            onClick={() => saveAPIKey(apiKey)}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
