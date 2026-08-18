import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Event, EventChoice } from '@/domain/events/types'

export function EventCard({
  event,
  onChoose,
  disabled = false,
}: {
  event: Event
  onChoose: (choice: EventChoice) => void
  disabled?: boolean
}) {
  return (
    <Card className="ring-border/60 border-t-4 border-t-bordeaux">
      <CardHeader>
        <CardTitle className="font-serif text-xl">{event.title}</CardTitle>
        <CardDescription className="text-base text-foreground/80">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {event.choices.map((choice) => (
          <Button
            key={choice.id}
            variant="outline"
            size="lg"
            className="h-auto justify-start px-4 py-3 text-left whitespace-normal"
            disabled={disabled}
            onClick={() => onChoose(choice)}
          >
            {choice.text}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
