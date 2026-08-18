import { useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { OrnamentDivider } from '@/components/game/OrnamentDivider'
import { startGameAtom } from '@/store/gameSession'

export function StartScreen() {
  const startGame = useSetAtom(startGameAtom)

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
          Un juego de carrera política
        </p>
        <h1 className="font-serif text-6xl font-bold tracking-tight text-primary sm:text-7xl">LA ROSCA</h1>
        <OrnamentDivider className="mx-auto w-48" />
        <p className="mx-auto max-w-sm text-lg text-foreground/80">
          Una carrera política.
          <br />
          Todas las decisiones equivocadas.
        </p>
      </div>

      <Button size="lg" className="px-10 text-base" onClick={() => startGame()}>
        Nueva partida
      </Button>
    </main>
  )
}
