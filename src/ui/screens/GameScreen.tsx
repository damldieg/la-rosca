import { useAtomValue, useSetAtom } from 'jotai'
import { CharacterHeader } from '@/ui/components/game/CharacterHeader'
import { ConsequencesPanel } from '@/ui/components/game/ConsequencesPanel'
import { EventCard } from '@/ui/components/game/EventCard'
import { OrnamentDivider } from '@/ui/components/game/OrnamentDivider'
import { StatsPanel } from '@/ui/components/game/StatsPanel'
import { chooseAtom, continueAtom, gameSessionAtom } from '@/ui/state/gameSession'

export function GameScreen() {
  const session = useAtomValue(gameSessionAtom)
  const choose = useSetAtom(chooseAtom)
  const goToNext = useSetAtom(continueAtom)

  if (session.phase !== 'playing' && session.phase !== 'resolved') return null

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
      <CharacterHeader state={session.state} />
      <StatsPanel state={session.state} />
      <OrnamentDivider />

      {session.phase === 'playing' && <EventCard event={session.event} onChoose={choose} />}

      {session.phase === 'resolved' && (
        <>
          <EventCard event={session.event} onChoose={() => {}} disabled />
          <ConsequencesPanel
            previousState={session.previousState}
            state={session.state}
            onContinue={() => goToNext()}
          />
        </>
      )}
    </main>
  )
}
