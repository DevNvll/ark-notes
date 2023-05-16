import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

interface Props {
  inflight: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function AskForm({ inflight, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-4">
      <Textarea name="data" placeholder="Ask a question..."></Textarea>
      <Button type="submit" variant="default" disabled={inflight}>
        {inflight ? 'Infering...' : 'Ask a question'}
      </Button>
    </form>
  )
}
