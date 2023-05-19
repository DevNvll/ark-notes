'use client'
import CustomPromptCard from '@/components/settings/custom-prompt-card'
import OpenAISettingsCard from '@/components/settings/open-ai-settings-card'

export default function SettingsPage() {
  return (
    <div className="container">
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>
      <div className="flex flex-col space-y-4">
        <OpenAISettingsCard />
        <CustomPromptCard />
      </div>
    </div>
  )
}
