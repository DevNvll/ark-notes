'use client'
import OpenAISettingsCard from '@/components/settings/open-ai-settings-card'

export default function SettingsPage() {
  return (
    <div className="container">
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>
      <OpenAISettingsCard />
    </div>
  )
}
