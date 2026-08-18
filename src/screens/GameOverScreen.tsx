import { useAtomValue, useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { OrnamentDivider } from '@/components/game/OrnamentDivider'
import { ROLE_LABELS } from '@/components/game/roleLabels'
import { gameSessionAtom, startGameAtom } from '@/store/gameSession'

const SUMMARY_STATS = [
  { key: 'money', label: 'Dinero', format: (v: number) => `$${v}` },
  { key: 'power', label: 'Poder', format: (v: number) => `${v}` },
  { key: 'popularity', label: 'Popularidad', format: (v: number) => `${v}` },
  { key: 'corruption', label: 'Corrupción', format: (v: number) => `${v}` },
  { key: 'structure', label: 'Estructura', format: (v: number) => `${v}` },
] as const

export function GameOverScreen() {
  const session = useAtomValue(gameSessionAtom)
  const playAgain = useSetAtom(startGameAtom)

  if (session.phase !== 'gameover') return null
  const { state } = session

  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
        La carrera continúa
      </p>
      <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
        Llegaste hasta: {ROLE_LABELS[state.role]}
      </h1>

      <OrnamentDivider className="w-40" />

      <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-border bg-card p-6 text-left sm:grid-cols-3">
        <div>
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">Edad</dt>
          <dd className="font-serif text-lg font-semibold">{state.age} años</dd>
        </div>
        {SUMMARY_STATS.map(({ key, label, format }) => (
          <div key={key}>
            <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
            <dd className="font-serif text-lg font-semibold">{format(state[key])}</dd>
          </div>
        ))}
      </dl>

      <p className="text-foreground/80 max-w-sm text-base italic">
        La rosca nunca termina. Solo cambia de manos.
      </p>

      <Button size="lg" className="px-10 text-base" onClick={() => playAgain()}>
        Jugar de nuevo
      </Button>
    </main>
  )
}
